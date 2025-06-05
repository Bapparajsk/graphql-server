import {QueryResolvers} from "../../types";
import {customError, customErrors} from "../../helper";

export const post: QueryResolvers["post"] = async (_, { id, input }, ctx) => {
    try {
        await ctx.tools.isAuthenticated(); // ! Ensure the services is authenticated

        if(id) {
            ctx.tools.zodValidator.isId({ id });
            const user = await ctx.services.user.getUserById(id);
            if(!user) {
                throw new Error("User not found");
            }
        }

        // Validate the input using the getInputsSchema
        const validInput = ctx.tools.zodValidator.isGetInputs(input);

        const posts = await ctx.services.post.getPosts({...validInput, id });
        const hasNextPage = posts.length === input.limit;

        return { posts, hashNext: hasNextPage };
    } catch (e) {
        console.error("Error in getPosts query:", e);

        if(e instanceof Error && e.message === "User not found") {
            throw customError("USER_NOT_FOUND");
        }

        throw customErrors(e);
    }
}
