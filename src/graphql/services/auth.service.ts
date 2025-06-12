import crypto, { randomInt } from "node:crypto";
import { promisify } from "util";

import prisma, { User } from "../../lib/prisma";
import {MutationCreateUserArgs, MutationSignInArgs} from "../types";

import transporter from "@/config/nodemailer.config";
import redis from "@/config/redis.config";

interface HashPassword {
    salt: string;
    hash: string;
}

// const pbkdf2 =

const config = {
    iterations: 100_000,
    keylen: 64,
    digest: "sha512"
};

interface OtpDetails {
    otp: string;
    otpExpires: Date;
    resendTimeLimit: number; // Optional field to track resend attempts
}

class AuthService {

    private readonly pbkdf2;

    constructor() {
        this.pbkdf2 = promisify(crypto.pbkdf2);
    }

    async #hashPassword(password: string): Promise<HashPassword> {
        const salt = crypto.randomBytes(16).toString("hex");
        const derivedKey = await this.pbkdf2(password, salt, config.iterations, config.keylen, config.digest);
        return {
            salt,
            hash: derivedKey.toString("hex"),
        };
    }

    async #verifyPassword(password: string, salt: string, hash: string): Promise<boolean> {
        const derivedKey = await this.pbkdf2(password, salt, config.iterations, config.keylen, config.digest);
        return derivedKey.toString("hex") === hash;
    }

    async createUser({ input }: MutationCreateUserArgs): Promise<User> {
        const { salt, hash } = await this.#hashPassword(input.password);
        return prisma.user.create({
            data: {
                email: input.email,
                name: input.name,
                password: hash, // Store the hashed password
                salt // Store the salt for future password verification
            }
        });
    }

    async singInUser({ input }: MutationSignInArgs): Promise<User> {
        const data = await prisma.user.findUnique({
            where: {  email: input.email },
        });

        if (!data) {
            throw new Error("Invalid email or password");
        }

        // Verify the password
        const isPasswordValid = await this.#verifyPassword(input.password, data.salt, data.password);
        if (!isPasswordValid) {
            throw new Error("Invalid email or password");
        }
        // If the password is valid, return the services data
        return data;
    }

    generateOtp(): OtpDetails {
        const otp = randomInt(100000, 999999); // Generate a 6-digit OTP
        const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 minutes
        const resendTimeLimit = Date.now() + 60 * 1000; // Resend limit set to 1 minute

        return {
            otp: otp.toString(),
            otpExpires,
            resendTimeLimit
        };
    };


    async saveOtp({ identifier, otpDetails, purpose } : { identifier: string; otpDetails: OtpDetails; purpose: string }) {
        await redis.set(`${purpose}:${identifier}`, JSON.stringify(otpDetails), "EX", 300); // Expires in 5 min
    }

    async getOtpDetails({ identifier, purpose }: { identifier: string; purpose: string }) {
        const otpDetails = await redis.get(`${purpose}:${identifier}`);
        if (!otpDetails) {
            throw new Error("OTP_NOT_FOUND");
        }
        return JSON.parse(otpDetails) as OtpDetails;
    }

    async verifyOtp({ identifier, otp, purpose }: { identifier: string; otp: string; purpose: string }) {
        const { otp: savedOtp, otpExpires } = await this.getOtpDetails({ identifier, purpose });
        const currentDate = new Date();

        if (currentDate > new Date(otpExpires)) {
            throw new Error("OTP_EXPIRED");
        }

        return savedOtp === otp;
    }

    async sendOtp({ identifier, otp }: { identifier: string; otp: string }) {
        try {
            await transporter.sendMail({
                from: process.env.TRANSPORTER_USER || "your email",
                to: identifier,
                subject: "OTP",
                text: `Your OTP is ${otp}`,
            });
        } catch (e) {
            console.log("Error sending OTP:", e);
            throw new Error("ERROR_SENDING_OTP");
        }
    }
}

export default AuthService;
