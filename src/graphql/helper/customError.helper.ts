import { GraphQLError } from "graphql/error";
import { JsonWebTokenError } from "jsonwebtoken";
import { ZodError } from "zod/v4";

import {formatError} from "../tools/zod";


export type errorCode = "GRAPHQL_PARSE_FAILED" | "GRAPHQL_VALIDATION_FAILED" | "BAD_USER_INPUT" | "USER_NOT_FOUND" |
    "PERSISTED_QUERY_NOT_FOUND" | "OPERATION_RESOLUTION_FAILURE" | "BAD_REQUEST" | "INTERNAL_SERVER_ERROR" | "UNAUTHORIZED";

export interface ErrorTypes {
    code: errorCode | string;
    message: string;
    status: number
}

const errorCodes: Record<errorCode, ErrorTypes> = {
    GRAPHQL_PARSE_FAILED: {
        code: "GRAPHQL_PARSE_FAILED",
        message: "GraphQL query parsing failed",
        status: 400,
    },
    GRAPHQL_VALIDATION_FAILED: {
        code: "GRAPHQL_VALIDATION_FAILED",
        message: "GraphQL query validation failed",
        status: 400,
    },
    BAD_USER_INPUT: {
        code: "BAD_USER_INPUT",
        message: "Invalid services input",
        status: 400,
    },
    PERSISTED_QUERY_NOT_FOUND: {
        code: "PERSISTED_QUERY_NOT_FOUND",
        message: "Persisted query not found",
        status: 404,
    },
    OPERATION_RESOLUTION_FAILURE: {
        code: "OPERATION_RESOLUTION_FAILURE",
        message: "Operation resolution failed",
        status: 500,
    },
    BAD_REQUEST: {
        code: "BAD_REQUEST",
        message: "Bad request",
        status: 400,
    },
    INTERNAL_SERVER_ERROR: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Internal server error",
        status: 500,
    },
    UNAUTHORIZED: {
        code: "UNAUTHORIZED",
        message: "Unauthorized access",
        status: 401,
    },
    USER_NOT_FOUND: {
        code: "USER_NOT_FOUND",
        message: "User not found",
        status: 404,
    }
};


const customError = (code : errorCode | ErrorTypes, message?: string) => {
    if(code && typeof code === "object") {
        return new GraphQLError(message || code.message, {
            extensions: {
                code: code.code,
                http: {
                    status: code.status,
                },
            },
        });
    }

    const errorType = errorCodes[code as errorCode] || {
        code: "INTERNAL_SERVER_ERROR",
        message:  "An unknown error occurred",
        status: 500,
    };

    return new GraphQLError( message || errorType.message, {
        extensions: {
            code: errorType.code,
            http: {
                status: errorType.status,
            },
        },
    });
};


const customErrors = (e: unknown, eList: ErrorTypes[] = []) => {

    if (e instanceof GraphQLError) {
        throw e;
    }

    // Match errors with custom error list
    if (e instanceof Error) {
        const matchedError = eList.find(err => err.code === e.message);
        if (matchedError) {
            throw customError(matchedError);
        }
    }

    if (e instanceof JsonWebTokenError) {
        throw customError("UNAUTHORIZED");
    }

    if (e instanceof ZodError) {
        throw customError("BAD_USER_INPUT", formatError(e));
    }

    throw customError("INTERNAL_SERVER_ERROR");
};

export {
    customErrors,
    customError
};
