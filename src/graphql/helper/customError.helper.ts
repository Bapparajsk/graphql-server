import { GraphQLError } from "graphql/error";

export type errorCode = "GRAPHQL_PARSE_FAILED" | "GRAPHQL_VALIDATION_FAILED" | "BAD_USER_INPUT" |
    "PERSISTED_QUERY_NOT_FOUND" | "OPERATION_RESOLUTION_FAILURE" | "BAD_REQUEST" | "INTERNAL_SERVER_ERROR" | "UNAUTHORIZED";

interface ErrorTypes {
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
        message: "Invalid user input",
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
    }
};


const customError = (code : errorCode | ErrorTypes) => {
    if (code && typeof code === "object" && "code" in code) {
        const { code: errorCode, message, status } = code as ErrorTypes;
        if (!errorCodes[errorCode as errorCode]) {
            throw new Error(`Unknown error code: ${errorCode}`);
        }
    }

    const errorType = errorCodes[code as errorCode] || {
        code: "INTERNAL_SERVER_ERROR",
        message: "An unknown error occurred",
        status: 500,
    };

    return new GraphQLError(errorType.message, {
        extensions: {
            code: errorType.code,
            http: {
                status: errorType.status,
            },
        },
    });
}

export default customError;
