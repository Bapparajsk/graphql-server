import * as type from "../types";

import { CommentResult } from "./result";

import prisma from "@/lib/prisma";

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

        if (!comment) throw new Error("COMMENT_NOT_FOUND");

        return new CommentResult(comment);
    };

    /**
     * Fetch paginated comments for a given post
     */
    getComments = async ({
                             postId,
                             input,
                         }: type.PostQueryCommentsArgs & { postId: number }): Promise<CommentResult> => {
        const skip = (input.page - 1) * input.limit;

        const comments = await prisma.comment.findMany({
            where: { postId },
            skip,
            take: input.limit,
            orderBy: { createdAt: "desc" },
            include: { author: true },
        });

        return new CommentResult(comments);
    };

    /**
     * Create a new comment on a post by a user
     */
    addComment = async ({
                            postId,
                            user,
                            comment,
                        }: {
        postId: number;
        user: type.User;
        comment: string;
    }): Promise<CommentResult> => {
        const newComment = await prisma.comment.create({
            data: {
                comment,
                postId,
                authorId: user.id,
            },
        });

        return new CommentResult(newComment);
    };

    /**
     * Update an existing comment's content
     */
    updateComment = async ({
                               commentId,
                               comment,
                           }: {
        commentId: number;
        comment: string;
    }): Promise<CommentResult> => {
        const updatedComment = await prisma.comment.update({
            where: { id: commentId },
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
