import {customErrors} from "@graphql/helper";
import {PostMutationResolvers} from "@graphql/types";

interface ValidComment {
    postId: number;
    authorId: number;
}

const isValidCommentAndPost = <T extends ValidComment>(comment: T, expected: ValidComment) => {
    if(comment.postId !== expected.postId) {
        throw new Error("COMMENT_NOT_BELONG_TO_POST");
    }

    if(comment.authorId !== expected.authorId) {
        throw new Error("FORBIDDEN");
    }
};

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

        isValidCommentAndPost(commentData, { authorId: user.id, postId });
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

export const deleteComment: PostMutationResolvers["deleteComment"] = async ({ postId, user }, { commentId }, { services, tools }) => {
    try {
        const validCommentId = tools.zodValidator.isId(commentId);

        const commentData = await services.comment.getComment(validCommentId.id);
        isValidCommentAndPost(commentData, { authorId: user.id, postId });

        await services.comment.deleteComment(validCommentId.id);
        return true;
    } catch (e) {
        console.log("Error in deleteComment:", e);
        throw customErrors(e, [
            { code: "COMMENT_NOT_FOUND", message: "Comment not found", status: 404 },
            { code: "FORBIDDEN", message: "You are not authorized to delete this comment", status: 403 },
            { code: "COMMENT_NOT_BELONG_TO_POST", message: "Comment does not belong to this post", status: 403 },
        ]);
    }
};
