import { GraphQLError } from "graphql/error";
import { JsonWebTokenError } from "jsonwebtoken";
import { ZodError } from "zod/v4";

import { formatError } from "../tools/zod";

// Define a set of allowed error code strings
export type ErrorCode =
    "GRAPHQL_PARSE_FAILED" |
    "GRAPHQL_VALIDATION_FAILED" |
    "BAD_USER_INPUT" |
    "USER_NOT_FOUND" |
    "PERSISTED_QUERY_NOT_FOUND" |
    "OPERATION_RESOLUTION_FAILURE" |
    "BAD_REQUEST" |
    "INTERNAL_SERVER_ERROR" |
    "UNAUTHORIZED" |
    "OTP_RESET_LIMIT";

// Interface for error type structure
export interface ErrorTypes {
    code: ErrorCode | string; // Accepts predefined codes or custom strings
    message: string;          // Human-readable error message
    status: number;           // HTTP status code associated with the error
}

// Mapping of all predefined error codes to their corresponding messages and status codes
export const ErrorCodes: Record<ErrorCode, ErrorTypes> = {
    // Error: GraphQL query syntax is invalid
    GRAPHQL_PARSE_FAILED: {
        code: "GRAPHQL_PARSE_FAILED",
        message: "GraphQL query parsing failed",
        status: 400,
    },

    // Error: Query did not conform to GraphQL schema/validation rules
    GRAPHQL_VALIDATION_FAILED: {
        code: "GRAPHQL_VALIDATION_FAILED",
        message: "GraphQL query validation failed",
        status: 400,
    },

    // Error: User provided invalid input (e.g., missing required fields)
    BAD_USER_INPUT: {
        code: "BAD_USER_INPUT",
        message: "Invalid services input",
        status: 400,
    },

    // Error: Persisted (cached) GraphQL query was not found on server
    PERSISTED_QUERY_NOT_FOUND: {
        code: "PERSISTED_QUERY_NOT_FOUND",
        message: "Persisted query not found",
        status: 404,
    },

    // Error: Server failed to resolve the requested operation
    OPERATION_RESOLUTION_FAILURE: {
        code: "OPERATION_RESOLUTION_FAILURE",
        message: "Operation resolution failed",
        status: 500,
    },

    // Error: Client made a bad request (e.g., malformed body or headers)
    BAD_REQUEST: {
        code: "BAD_REQUEST",
        message: "Bad request",
        status: 400,
    },

    // Error: Unexpected server error occurred
    INTERNAL_SERVER_ERROR: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Internal server error",
        status: 500,
    },

    // Error: Authentication failed or token is invalid/missing
    UNAUTHORIZED: {
        code: "UNAUTHORIZED",
        message: "Unauthorized access",
        status: 401,
    },

    // Error: User with given credentials/ID not found
    USER_NOT_FOUND: {
        code: "USER_NOT_FOUND",
        message: "User not found",
        status: 404,
    },

    // Error: Exceeded OTP resend/reset attempts (e.g., rate-limiting for security)
    OTP_RESET_LIMIT: {
        code: "OTP_RESET_LIMIT",
        message: "You have exceeded the maximum number of OTP reset attempts. Please contact support.",
        status: 429, // Too Many Requests
    }
};


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
