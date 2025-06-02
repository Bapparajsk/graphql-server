import {ZodError} from "zod/v4";
import {JsonWebTokenError} from "jsonwebtoken";
import {customError, isAuthenticated} from "../helper";
import {QueryResolvers} from "../types";


export const user: QueryResolvers["user"] = async (_, { input }, ctx) => {
    try {
        // Ensure the services is authenticated
        const user = await isAuthenticated(ctx);

        // Validate the input using the getInputsSchema
        const { limit, page } = ctx.tools.zodValidator.isGetInputs(input);

        const users =  await ctx.services.user.getUsers({limit, page, id: user.id});
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
}
