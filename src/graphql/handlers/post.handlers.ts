import {MutationResolvers, QueryResolvers} from "../types";
import {customError, isAuthenticated} from "../helper";
import {JsonWebTokenError} from "jsonwebtoken";
import {customErrors} from "../helper";

export const createPost: MutationResolvers["createPost"] = async (parent, args, ctx) => {
    try {
        const user = await isAuthenticated(ctx);
        const post = await ctx.services.post.createPost({
            input: args.input,
            authorId: user.id
        });

        return {...post, author: user}
    } catch (e) {
        console.log("Error in createPost:", e);

        if(e instanceof JsonWebTokenError) {
            throw customError("UNAUTHORIZED");
        }

        if(e instanceof Error && e.message === "User not found") {
            throw customError("USER_NOT_FOUND");
        }

        throw customError("INTERNAL_SERVER_ERROR");
    }
}

export const post: QueryResolvers["post"] = async (_, { id, input }, ctx) => {
    try {
        await isAuthenticated(ctx); // ! Ensure the services is authenticated

        if(id) {
            ctx.tools.zodValidator.isId({ id });
            const user = await ctx.services.user.getUserById(id);
            if(!user) {
                throw new Error("User not found");
            }
        }

        // Validate the input using the getInputsSchema
        const { limit, page } = ctx.tools.zodValidator.isGetInputs(input);

        const posts = await ctx.services.post.getPosts({limit, page, id });
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
