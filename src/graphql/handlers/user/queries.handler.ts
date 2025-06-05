import {customError} from "@graphql/helper";
import {QueryResolvers} from "@graphql/types";
import {JsonWebTokenError} from "jsonwebtoken";
import {ZodError} from "zod/v4";

export const user: QueryResolvers["user"] = async (_, { input }, { services, tools }) => {
    try {
        // Ensure the services is authenticated
        const user = await tools.isAuthenticated();

        // Validate the input using the getInputsSchema
        const { limit, page } = tools.zodValidator.isGetInputs(input);

        const users =  await services.user.getUsers({limit, page, id: user.id});
        const hasNextPage = users.length === input.limit;

        return { users, hashNext: hasNextPage };
    } catch (e) {
        console.error("Error in getUsers query:", e);

        if (e instanceof ZodError) {
            // Handle validation errors
            throw customError("BAD_USER_INPUT", e.message);
        }

        if (e instanceof JsonWebTokenError) {
            throw customError("UNAUTHORIZED");
        }

        throw customError("INTERNAL_SERVER_ERROR");
    }
};
