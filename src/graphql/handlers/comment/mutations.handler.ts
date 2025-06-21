import { customError, customErrors } from "@graphql/helper";
import { CommentWithAuthor } from "@graphql/services/result";
import { PostMutationResolvers } from "@graphql/types";

import { tryCatch } from "@/lib/try-catch";

interface ValidComment {
    postId: number;
    authorId: number;
}

// Helper function to ensure the comment belongs to the correct post and user
const isValidCommentAndPost = (comment: CommentWithAuthor, expected: ValidComment) => {
    // Check if comment is related to the given post
    if (comment.postId !== expected.postId) {
        throw customErrors({
            code: "COMMENT_NOT_BELONG_TO_POST",
            message: "Comment does not belong to this post",
            status: 403
        });
    }

    // Check if the comment was authored by the current user
    if (comment.authorId !== expected.authorId) {
        throw customError({
            code: "FORBIDDEN",
            message: "You are not authorized to perform this action",
            status: 403
        });
    }

    return true;
};

// Resolver to add a new comment to a post
export const addComment: PostMutationResolvers["addComment"] = async (
    { postId, user },
    { comment },
    { services, tools }
) => {
    return tryCatch(async () => {
        // Validate comment input using Zod
        const validComment = tools.zodValidator.isValidComment(comment);

        // Add the comment with the associated post and user info
        return await services.comment.addComment({
            postId,
            userId: user.id,
            comment: validComment.comment
        });
    });
};

// Resolver to update an existing comment
export const updateComment: PostMutationResolvers["updateComment"] = async (
    { postId, user },
    { commentId, comment },
    { services, tools }
) => {
    return tryCatch(async () => {
        // Retrieve the original comment data
        const { value: commentData } = await services.comment.getComment(commentId);

        // Ensure the comment belongs to the user and matches the post
        isValidCommentAndPost(commentData, { authorId: user.id, postId });

        // Validate updated comment content
        const validComment = tools.zodValidator.isValidComment(comment);

        // Update the comment in the database
        const commentResult = await services.comment.updateComment({
            comment: validComment.comment,
            commentId: commentData.id,
            isAuthor: true // Ensure the user is the author of the comment
        });

        const updatedComment = commentResult.transform();

        // Return the updated comment with author included (required by GraphQL type)
        return { ...updatedComment, author: commentData.author };
    });
};

// Resolver to delete a comment
export const deleteComment: PostMutationResolvers["deleteComment"] = async (
    { postId, user },
    { commentId },
    { services, tools }
) => {
    return tryCatch(async () => {
        // Validate and parse comment ID
        const validCommentId = tools.zodValidator.isId(commentId);

        // Fetch the comment from the database
        const { value: commentData } = await services.comment.getComment(validCommentId.id);

        // Ensure comment belongs to user and is for the correct post
        isValidCommentAndPost(commentData, { authorId: user.id, postId });

        // Delete the comment
        await services.comment.deleteComment(validCommentId.id);
    });
};
