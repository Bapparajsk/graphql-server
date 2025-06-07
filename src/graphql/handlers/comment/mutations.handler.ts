import {customErrors} from "@graphql/helper";
import {PostMutationResolvers} from "@graphql/types";

export const addComment: PostMutationResolvers["addComment"] = async ({ postId, user }, { comment }, { services, tools }) => {
    try {
        const validComment = tools.zodValidator.isValidComment(comment);
        return await services.comment.addComment({
            postId, user,
            comment: validComment.comment
        });
    } catch (e) {
        console.log("Error in addComment:", e);
        throw customErrors(e);
    }
};

export const updateComment: PostMutationResolvers["updateComment"] = async ({ postId, user }, { commentId, comment }, { services, tools }) => {
    try {
        const commentData = await services.comment.getComment(commentId);

        if(commentData.postId !== postId) {
            throw new Error("COMMENT_NOT_BELONG_TO_POST");
        }

        if(commentData.authorId !== user.id) {
            throw new Error("FORBIDDEN");
        }

        const validComment = tools.zodValidator.isValidComment(comment);

        return await services.comment.updateComment({
            comment: validComment.comment,
            postId,
            user,
            commentId: commentData.id
        });
    } catch (e) {
        console.log("Error in updateComment:", e);
        throw customErrors(e, [
            { code: "COMMENT_NOT_FOUND", message: "Comment not found", status: 404 },
            { code: "FORBIDDEN", message: "You are not authorized to update this comment", status: 403 },
            { code: "COMMENT_NOT_BELONG_TO_POST", message: "Comment does not belong to this post", status: 403 },
        ]);
    }
};
