import {customErrors} from "@/graphql/helper";
import {MutationResolvers, PostMutationResolvers, QueryResolvers} from "@/graphql/types";
import {filterValidFields} from "@/lib/filter";


export const createPost: MutationResolvers["createPost"] = async (parent, { input }, { services, tools }) => {
    try {
        const author = await tools.isAuthenticated();
        const isValidInput = tools.zodValidator.isValidCreatePost(input);

        const post = await services.post.createPost({ input: isValidInput, authorId: author.id });
        return {...post, author};

    } catch (e) {
        console.log("Error in createPost:", e);
        throw customErrors(e);
    }
};

export const postMutation: MutationResolvers["post"] = async (_, { id }, { services, tools }) => {
    try {
        const user = await tools.isAuthenticated();
        const validId = tools.zodValidator.isId({ id });

        const post = await services.post.getPostById({ postId: validId.id });
        return {postId: post.id, post, user};
    } catch (e) {
        console.log("Error in post mutation:", e);
        throw customErrors(e, [
            { code: "NOT_FOUND", message: "Post not found", status: 404 },
        ]);
    }
};

export const updatePost: PostMutationResolvers["updatePost"] = async ({ postId, user }, { input }, { services ,tools }) => {
    try {
        const post = await services.post.isMyPost(user.id, postId);

        const data = filterValidFields(tools.zodValidator.isValidUpdatePost(input));
        const updatedPost = await services.post.updatePost({ input: data, postId: post.id, });

        return {...updatedPost, author: user};
    } catch (e) {
        console.log("Error in updatePost:", e);
        throw customErrors(e, [
            {
                code: "INPUT_ERROR",
                message: "At least one field (title or content) must be provided for update.",
                status: 400,
            },
            { code: "NOT_FOUND", message: "Post not found", status: 404 },
            { code: "FORBIDDEN", message: "You are not authorized to manipulate this post", status: 403 }
        ]);
    }
};

export const deletePost: PostMutationResolvers["deletePost"] = async ({ postId, user }, args, { services }) => {
    try {
        const post = await services.post.isMyPost(user.id, postId);
        await services.post.deletePost(post.id);
        return true;
    } catch (e) {
        throw customErrors(e,[
            { code: "FORBIDDEN", message: "You are not authorized to manipulate this post", status: 403 }
        ]);
    }
};

