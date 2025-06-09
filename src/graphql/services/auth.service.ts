import crypto, { randomInt } from "node:crypto";
import { promisify } from "util";

import prisma from "../../lib/prisma";
import {MutationCreateUserArgs, MutationSignInArgs} from "../types";

import transporter from "@/config/nodemailer.config";
import redis from "@/config/redis.config";
import {user} from "@graphql/handlers/user";

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

    async createUser({ input }: MutationCreateUserArgs) {
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

    async singInUser({ input }: MutationSignInArgs) {
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
        return {
            otp: otp.toString(),
            otpExpires: new Date(Date.now() + 5 * 60 * 1000), // OTP expires in 5 minutes
        };
    };

    async saveOtp({ identifier, otpDetails, purpose } : { identifier: string; otpDetails: OtpDetails; purpose: string }) {
        await redis.set(`${purpose}:${identifier}`, JSON.stringify(otpDetails), "EX", 300); // Expires in 5 min
    }

    async verifyOtp({ identifier, otp, purpose }: { identifier: string; otp: string; purpose: string }) {
        const otpDetails = await redis.get(`${purpose}:${identifier}`);
        if (!otpDetails) {
            throw new Error("OTP_NOT_FOUND");
        }

        const { otp: savedOtp, otpExpires } = JSON.parse(otpDetails) as OtpDetails;
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
