import { GraphQLError } from "graphql/error";
import { JsonWebTokenError } from "jsonwebtoken";
import { ZodError } from "zod/v4";

import { formatError } from "../tools/zod";

import {
    ErrorCode,
    ErrorCodes,
    ErrorTypes
} from "@/types/graphql/helper/customError.helper";

/**
 * Returns a formatted GraphQLError instance based on a predefined error code or full error object.
 * @param code - Can be either an ErrorCode string or a full ErrorTypes object
 * @param message - Optional custom error message to override default
 */
const customError = (code: ErrorCode | ErrorTypes, message?: string) => {
    // If full ErrorTypes object is passed
    if (code && typeof code === "object") {
        return new GraphQLError(message || code.message, {
            extensions: {
                code: code.code,
                http: {
                    status: code.status,
                },
            },
        });
    }

    // If only ErrorCode is passed, get matching error object or fallback to internal error
    const errorType = ErrorCodes[code as ErrorCode] || {
        code: "INTERNAL_SERVER_ERROR",
        message: "An unknown error occurred",
        status: 500,
    };

    return new GraphQLError(message || errorType.message, {
        extensions: {
            code: errorType.code,
            http: {
                status: errorType.status,
            },
        },
    });
};

/**
 * Centralized error handler to throw GraphQL-compliant errors
 * @param e - The caught error (can be anything)
 * @param eList - Optional list of custom ErrorTypes to match string-based errors
 */
const customErrors = (e: unknown, eList: ErrorTypes[] = []) => {

    // If already a GraphQL error, re-throw it
    if (e instanceof GraphQLError) {
        throw e;
    }

    // If it's a known Error object and matches a code from provided custom list
    if (e instanceof Error) {
        const matchedError = eList.find(err => err.code === e.message);
        if (matchedError) {
            throw customError(matchedError);
        }
    }

    // Handle JWT token-related errors
    if (e instanceof JsonWebTokenError) {
        throw customError("UNAUTHORIZED");
    }

    // Handle Zod validation errors with formatted message
    if (e instanceof ZodError) {
        throw customError("BAD_USER_INPUT", formatError(e));
    }

    // Fallback for unknown/unhandled errors
    throw customError("INTERNAL_SERVER_ERROR");
};

export {
    customErrors,
    customError
};
