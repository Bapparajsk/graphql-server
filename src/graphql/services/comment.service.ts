import {customError} from "@graphql/helper";

import {CommentResult, CommentResultArray} from "./result";

import prisma from "@/lib/prisma";
import {AddCommentType, GetCommentsType, UpdateCommentType} from "@/types/graphql/comment.service";

/**
 * Service class to handle comment-related database operations
 */
class CommentService {
    /**
     * Fetch a single comment by ID with its author
     */
    getComment = async (commentId: number): Promise<CommentResult> => {
        const comment = await prisma.comment.findUnique({
            where: { id: commentId },
            include: { author: true },
        });

        if (!comment) {
            throw customError({
                code: "COMMENT_NOT_FOUND",
                message: "Comment not found",
                status: 404,
            });
        }

        return new CommentResult(comment);
    };

    /**
     * Fetch paginated comments for a given post
     */
    getComments = async ({ postId, input, }: GetCommentsType): Promise<CommentResultArray> => {
        const skip = (input.page - 1) * input.limit;

        const comments = await prisma.comment.findMany({
            where: { postId },
            skip,
            take: input.limit,
            orderBy: { createdAt: "desc" },
            include: { author: true },
        });

        return new CommentResultArray(comments);
    };

    /**
     * Create a new comment on a post by a user
     */
    addComment = async ({ postId, userId, comment, }: AddCommentType): Promise<CommentResult> => {
        const newComment = await prisma.comment.create({
            data: {
                comment,
                postId,
                authorId: userId,
            },
        });

        return new CommentResult(newComment);
    };

    /**
     * Update an existing comment's content
     */
    updateComment = async ({ commentId, comment, isAuthor = false, }: UpdateCommentType): Promise<CommentResult> => {
        const updatedComment = await prisma.comment.update({
            where: { id: commentId },
            include: { author: isAuthor },
            data: { comment },
        });

        return new CommentResult(updatedComment);
    };

    /**
     * Delete a comment by ID
     */
    deleteComment = async (commentId: number): Promise<CommentResult> => {
        const deletedComment = await prisma.comment.delete({
            where: { id: commentId },
        });

        return new CommentResult(deletedComment);
    };
}

export default CommentService;
