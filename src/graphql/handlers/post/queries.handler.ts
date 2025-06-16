import {customError, customErrors} from "@graphql/helper";
import {QueryResolvers} from "@graphql/types";


export const postList: QueryResolvers["postList"] = async (_, { userId, input }, { services, tools }) => {
    try {
        await tools.isAuthenticated();

        if(userId) {
            const validId = tools.zodValidator.isId(userId);
            const user = await services.user.getUserById(validId.id);
            if(!user) {
                throw new Error("User not found");
            }
        }

        // Validate the input using the getInputsSchema
        const validInput = tools.zodValidator.isGetInputs(input);

        const postResultArray = await services.post.getPosts({
            input: validInput,
            userId: userId
        });

        const posts = postResultArray.transform();

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

// export

export const postQuery: QueryResolvers["post"] = async (_, { postId }, { services, tools }) => {
    try {
        await tools.isAuthenticated();
        const postResult =  await services.post.getPostById({postId});

        return { post: postResult.transform() };
    } catch (e) {
        throw customErrors(e, [{
            code: "NOT_FOUND",
            message: "Post not found",
            status: 404
        }]);
    }
};

