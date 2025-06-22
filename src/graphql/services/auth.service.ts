import crypto, { randomInt } from "node:crypto";
import { promisify } from "util";

import { customError, customErrors } from "@graphql/helper";
import { UserResult } from "@graphql/services/result";

import { PrismaClientKnownRequestError } from "../../../generated/prisma/runtime/library";
import prisma, { User } from "../../lib/prisma";
import { MutationCreateUserArgs, MutationSignInArgs } from "../types";

import redis from "@/config/redis.config";
import { sendOTPInEmail } from "@/lib/bullmq/producer";
import {
    HashPassword,
    IsValidThrottleType,
    OtpDetails,
    SaveOtpType,
    SendOtpType,
    VerifyOtpType,
    VerifyPasswordType
} from "@/types/graphql/auth.service";

// Configuration for password hashing using PBKDF2
const config = {
    iterations: 100_000,
    keylen: 64,
    digest: "sha512"
};

class AuthService {
    private readonly pbkdf2;

    constructor() {
        // Promisify pbkdf2 to use async/await
        this.pbkdf2 = promisify(crypto.pbkdf2);
    }

    /**
     * 🔒 Hashes a plain text password using PBKDF2 with a random salt.
     */
    async #hashPassword(password: string): Promise<HashPassword> {
        const salt = crypto.randomBytes(16).toString("hex");
        const derivedKey = await this.pbkdf2(password, salt, config.iterations, config.keylen, config.digest);
        return {
            salt,
            hash: derivedKey.toString("hex"),
        };
    }

    /**
     * 🔐 Verifies that a given password matches the stored hash using the stored salt.
     */
    async #verifyPassword({ password, salt, hash }: VerifyPasswordType): Promise<boolean> {
        const derivedKey = await this.pbkdf2(password, salt, config.iterations, config.keylen, config.digest);
        return derivedKey.toString("hex") === hash;
    }

    /**
     * 👤 Creates a new user in the database with a hashed password and salt.
     */
    async createUser({ input }: MutationCreateUserArgs): Promise<UserResult> {
        try {
            const { salt, hash } = await this.#hashPassword(input.password);
            const newUser = await prisma.user.create({
                data: {
                    email: input.email,
                    name: input.name,
                    password: hash,
                    salt
                }
            });

            return new UserResult(newUser);
        } catch (e) {
            // Handle unique constraint error (e.g., email already exists)
            if (e instanceof PrismaClientKnownRequestError) {
                if (e.code === "P2002") {
                    throw customError({
                        code: "USER_ALREADY_EXISTS",
                        message: "User with this email already exists",
                        status: 400
                    });
                }
            }

            // Throw unhandled Prisma or other errors
            throw customErrors(e);
        }
    }

    /**
     * 🔑 Authenticates a user by verifying their email and password.
     */
    async singInUser({ input }: MutationSignInArgs): Promise<User> {
        const data = await prisma.user.findUnique({
            where: { email: input.email },
        });

        if (!data) {
            throw customError({
                code: "INVALID_CREDENTIALS",
                message: "Invalid email or password",
                status: 400
            });
        }

        // Compare provided password with stored hash
        const isPasswordValid = await this.#verifyPassword({
            password: input.password,
            salt: data.salt,
            hash: data.password
        });

        if (!isPasswordValid) {
            throw customError({
                code: "INVALID_CREDENTIALS",
                message: "Invalid email or password",
                status: 400
            });
        }

        return data;
    }

    /**
     * 🔢 Generates a 6-digit OTP along with expiration and resend limit timestamps.
     */
    generateOtp(): OtpDetails {
        const otp = randomInt(100000, 999999); // Random 6-digit OTP
        const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // OTP valid for 5 minutes
        const resendTimeLimit = Date.now() + 60 * 1000; // Allow resend after 1 minute

        return {
            otp: otp.toString(),
            otpExpires,
            resendTimeLimit
        };
    }

    /**
     * 💾 Saves OTP details in Redis with an expiration time (5 minutes).
     */
    async saveOtp({ identifier, otpDetails, purpose }: SaveOtpType) {
        await redis.set(`${purpose}:${identifier}`, JSON.stringify(otpDetails), "EX", 300);
    }

    /**
     * 📦 Fetches OTP details from Redis using purpose and identifier as the key.
     */
    async getOtpDetails({ identifier, purpose }: IsValidThrottleType): Promise<string | null> {
        return await redis.get(`${purpose}:${identifier}`);
    }

    /**
     * ⏳ Validates if the user can request another OTP based on resend time limit.
     * Throws a throttling error if resend is too soon.
     */
    async isValidThrottle({ identifier, purpose }: IsValidThrottleType) {
        const cashOtp = await this.getOtpDetails({ identifier, purpose });

        if (!cashOtp) return true;

        const { resendTimeLimit } = JSON.parse(cashOtp) as OtpDetails;
        const currentDate = new Date();

        if (resendTimeLimit && resendTimeLimit > currentDate.getTime()) {
            throw customError({
                code: "RESEND_OTP_LIMIT",
                message: "Please wait before requesting another OTP.",
                status: 429,
            });
        }

        return true;
    }

    /**
     * 🔁 Checks whether the OTP reset count is within the allowed daily limit.
     */
    isValidOtpResetCount(otpResetCount: number): boolean {
        return otpResetCount <= 5;
    }

    /**
     * ✅ Verifies if the provided OTP is valid and not expired.
     */
    async verifyOtp({ otp, identifier, purpose }: VerifyOtpType) {
        const cashOtp = await this.getOtpDetails({ identifier, purpose });

        if (!cashOtp) {
            throw customError({
                code: "OTP_NOT_FOUND",
                message: "OTP not found or has expired",
                status: 404,
            });
        }

        const otpDetails: OtpDetails = JSON.parse(cashOtp);
        const currentDate = new Date();

        // Check for expiration
        if (currentDate > new Date(otpDetails.otpExpires)) {
            throw customError({
                code: "OTP_EXPIRED",
                message: "OTP has expired",
                status: 400,
            });
        }

        // Check OTP match
        if (otpDetails.otp !== otp) {
            throw customError({
                code: "INVALID_OTP",
                message: "Invalid OTP",
                status: 400,
            });
        }

        return true;
    }

    /**
     * 📧 Sends OTP to the user via email using BullMQ queue.
     */
    async sendOtp(sendOtpType: SendOtpType) {
        try {
            await sendOTPInEmail(sendOtpType);
        } catch (e) {
            console.log("Error sending OTP:", e);
            throw new Error("ERROR_SENDING_OTP");
        }
    }
}

export default AuthService;
