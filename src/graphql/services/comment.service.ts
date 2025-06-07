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
}

export default CommentService;
