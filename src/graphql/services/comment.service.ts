import * as type from "../types";

import prisma from "@/lib/prisma";
import {transformComment} from "@/lib/transformers";

class CommentService {
    getComment = async (commentId: number) => {
        const comment = await prisma.comment.findUnique({
            where: { id: commentId },
            // include: { author: true },
        });

        if (!comment) {
            throw new Error("COMMENT_NOT_FOUND");
        }

        return comment;
    };

    getComments = async ({ postId , input }: type.PostQueryCommentsArgs & { postId: number }): Promise<type.Comment[]> => {
        const skip = (input.page - 1) * input.limit;
        const comments = await prisma.comment.findMany({
            where: { postId },
            skip,
            take: input.limit,
            orderBy: { createdAt: "desc" },
            include: { author: true },
        });

        return comments.map(comment => transformComment(comment, comment.author));
    };

    addComment = async ({ postId, user, comment }: { postId: number, user: type.User, comment: string }): Promise<type.Comment> => {
        const com = await prisma.comment.create({
            data: {
                comment,
                postId,
                authorId: user.id,
            },
        });

        return transformComment(com, user);
    };

    updateComment = async ({ user, commentId, comment }: {postId: number, user: type.User, commentId: number, comment: string }): Promise<type.Comment> => {
        const com = await prisma.comment.update({
            where: { id: commentId },
            data: { comment },
        });

        return transformComment(com, user);
    };

    deleteComment = async (commentId: number) => {
        await prisma.comment.delete({
            where: { id: commentId },
        });
    };
}

export default CommentService;
