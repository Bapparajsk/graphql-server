import {customErrors} from "@/graphql/helper";
import {MutationResolvers, PostMutationResolvers} from "@/graphql/types";
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

export const postMutation: MutationResolvers["post"] = async (_, {id}, { tools }) => {
    try {
        const user = await tools.isAuthenticated();
        return {id, user};
    } catch (e) {
        console.log("Error in post mutation:", e);
        throw customErrors(e);
    }
};

export const updatePost: PostMutationResolvers["updatePost"] = async ({ id, user }, { input }, { services ,tools }) => {
    try {
        const post = await services.post.isMyPost(user.id, id);

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

export const deletePost: PostMutationResolvers["deletePost"] = async ({ id, user }, args, { services }) => {
    try {
        const post = await services.post.isMyPost(user.id, id);
        await services.post.deletePost(post.id);
        return true;
    } catch (e) {
        throw customErrors(e,[
            { code: "FORBIDDEN", message: "You are not authorized to manipulate this post", status: 403 }
        ]);
    }
};

export const addComment: PostMutationResolvers["addComment"] = async ({ id, user }, { comment }, { services, tools }) => {
    try {
        const validComment = tools.zodValidator.isValidComment(comment);
        return await services.post.addComment({
            postId: id,
            user,
            comment: validComment.comment
        });
    } catch (e) {
        console.log("Error in addComment:", e);
        throw customErrors(e);
    }
};
