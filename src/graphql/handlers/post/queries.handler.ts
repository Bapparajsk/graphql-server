import {customError, customErrors} from "@graphql/helper";
import {QueryResolvers} from "@graphql/types";

export const postAll: QueryResolvers["postAll"] = async (_, { userId, input }, { services, tools }) => {
    try {
        await tools.isAuthenticated();

        if(userId) {
            const validId = tools.zodValidator.isId({ id: userId });
            const user = await services.user.getUserById(validId.id);
            if(!user) {
                throw new Error("User not found");
            }
        }

        // Validate the input using the getInputsSchema
        const validInput = tools.zodValidator.isGetInputs(input);

        const posts = await services.post.getPosts({
            input: validInput,
            userId: userId
        });
        const hasNextPage = posts.length === input.limit;

        return { posts, hashNext: hasNextPage };
    } catch (e) {
        console.error("Error in getPosts query:", e);

        if(e instanceof Error && e.message === "User not found") {
            throw customError("USER_NOT_FOUND");
        }

        throw customErrors(e);
    }
};

export const post: QueryResolvers["post"] = async (_, { postId }, { services, tools }) => {
    try {
        await tools.isAuthenticated();
        const post =  await services.post.getPostById({postId});

        return { post };
    } catch (e) {
        throw customErrors(e, [{
            code: "NOT_FOUND",
            message: "Post not found",
            status: 404
        }]);
    }
};

// export const comment: GetPostResponseResolvers["comments"] = async ({post}, { input }, { services, tools }) => {
//     try {
//         await tools.isAuthenticated();
//         const validId = tools.zodValidator.isId({ id: post.id });
//         const validInput = tools.zodValidator.isGetInputs(input);
//
//         // const comments = await services.post.getCommentById({
//         //     input: validInput,
//         //     postId: validId.id
//         // });
//
//         return comments || [];
//     } catch (e) {
//         throw customErrors(e);
//     }
// };
