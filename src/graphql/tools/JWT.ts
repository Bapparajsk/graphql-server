// Import jwt methods and types
import jwt, { SignOptions, VerifyOptions } from "jsonwebtoken";

// Custom error utility for consistent error handling
import { customError } from "../helper";

// Custom type for JWT payload
import { Payload } from "@/types/graphql/jwt";

/**
 * Jwt class provides methods to sign, verify, and decode JWT tokens
 * using a secret key from environment variables.
 */
class Jwt {
    // Private secret key used for signing/verifying tokens
    readonly #secret: string;

    constructor() {
        // Fallback to "default" if env var is not set (not recommended for production)
        this.#secret = process.env.JWT_SECRET_KEY || "default";
    }

    /**
     * Sign a payload into a JWT token with optional configurations.
     * @param payload - The payload to encode into the token
     * @param options - Optional signing options (e.g., expiresIn)
     * @returns A signed JWT token
     */
    sign(payload: Payload, options?: SignOptions): string {
        return jwt.sign(payload, this.#secret, {
            expiresIn: "1h",       // Default token expiry time
            algorithm: "HS256",    // Default signing algorithm
            ...options             // Spread in any custom options
        });
    }

    /**
     * Verify and decode a JWT token.
     * Throws an error if token is invalid or expired.
     * @param token - The JWT token string to verify
     * @param options - Optional verification options
     * @returns Decoded payload if valid
     */
    verify(token: string, options?: VerifyOptions): Payload {
        const decoded = jwt.verify(token, this.#secret, options);

        // In some cases, decoded may be a string (e.g., with non-object payloads)
        if (typeof decoded === "string") {
            throw customError("UNAUTHORIZED");
        }

        return decoded as Payload;
    }

    /**
     * Decode a JWT token without verifying its signature.
     * Useful for non-sensitive data like client-side previews.
     * @param token - The JWT token string to decode
     * @returns Decoded payload or null if invalid
     */
    decode(token: string): Payload | null {
        const decoded = jwt.decode(token);

        // Return null if the token can't be decoded into an object
        if (!decoded || typeof decoded === "string") {
            return null;
        }

        return decoded as Payload;
    }
}

export default Jwt;
