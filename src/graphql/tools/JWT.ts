import jwt, { SignOptions, VerifyOptions } from "jsonwebtoken";

import {customError} from "../helper";

import { Payload } from "@/types/graphql/jwt";



class Jwt {
    readonly #secret: string;

    constructor() {
        this.#secret = process.env.JWT_SECRET_KEY || "default";
    }

    sign(payload: Payload, options?: SignOptions): string {
        return jwt.sign(payload, this.#secret, {
            expiresIn: "1h", // Default expiration time
            algorithm: "HS256", // Default algorithm
            ...options
        });
    }

    verify(token: string, options?: VerifyOptions): Payload {
        const decoded = jwt.verify(token, this.#secret, options);

        if (typeof decoded === "string") {
            throw customError("UNAUTHORIZED");
        }

        // Optional: narrow or validate fields if needed
        return decoded as Payload;
    }

    decode(token: string): Payload | null {
        const decoded = jwt.decode(token);

        if (!decoded || typeof decoded === "string") {
            return null;
        }

        return decoded as Payload;
    }
}

export default Jwt;
