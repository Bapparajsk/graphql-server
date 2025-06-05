import {MutationResolvers} from "@/graphql/types";
import {customErrors} from "@/graphql/helper";


export const createPost: MutationResolvers["createPost"] = async (parent, { input }, { services, tools }) => {
    try {
        const author = await tools.isAuthenticated();
        const isValidInput = tools.zodValidator.isValidCreatePost(input)

        const post = await services.post.createPost({ input: isValidInput, authorId: author.id });
        return {...post, author};

    } catch (e) {
        console.log("Error in createPost:", e);
        throw customErrors(e);
    }
}

export const postMutation: MutationResolvers["post"] = async (_, {id}, { services, tools }) => {
    try {
        const user = await tools.isAuthenticated();
        const post = await services.post.isMyPost(user.id, id);

        return {id, post, user};
    } catch (e) {
        console.log("Error in post mutation:", e);
        throw customErrors(e, [
            { code: "NOT_FOUND", message: "Post not found", status: 404 },
            { code: "FORBIDDEN", message: "You are not authorized to manipulate this post", status: 403 }
        ]);
    }
}
