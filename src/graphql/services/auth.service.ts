import crypto from "node:crypto";
import { promisify } from "util";

import prisma from "../../lib/prisma";
import { MutationCreateUserArgs, MutationSignInArgs } from "../types";

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
        return {
            id: data.id,
            email: data.email,
            name: data.name
        };
    }
}

export default AuthService;
