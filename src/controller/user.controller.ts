import {JsonWebTokenError} from "jsonwebtoken";
import {Context} from "../graphql/context";
import {customError, isAuthenticated} from "../graphql/helper";
import {QueryResolvers} from "../graphql/types";

export const users: QueryResolvers["users"] = async (_, { input }, ctx) => {
    try {
        const user = await isAuthenticated(ctx);
        const users =  await ctx.Controller.userController.getUsers({...input, id: user.id});

        const hashNext =
            users.length > 0
                ? users.length === input.limit
                    ? !!users[users.length - 1].id
                    : false
                : false;

        return { users, hashNext };
    } catch (e) {
        console.error("Error in getUsers query:", e);

        if (e instanceof JsonWebTokenError) {
            throw customError("UNAUTHORIZED");
        }

        throw customError("INTERNAL_SERVER_ERROR");
    }
}
