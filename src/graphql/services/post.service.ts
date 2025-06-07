import * as type from "../types";

import prisma from "@/lib/prisma";
import {transformPost} from "@/lib/transformers";

class PostService {
    createPost = async ({ input, authorId }: type.MutationCreatePostArgs & { authorId : number } ): Promise<type.Post> => {
        const { title, content } = input;

        const post = await prisma.post.create({
            data: {
                title,
                content,
                authorId
            }
        });

        return transformPost(post);
    };

    getPosts = async ({ input, userId }: type.QueryPostAllArgs & { id?: number }): Promise<type.Post[]> => {
        const skip = (input.page - 1) * input.limit;
        const posts = await prisma.post.findMany({
            where: userId ? { authorId: userId } : undefined,
            skip,
            take: input.limit,
            orderBy: { createdAt: "desc" },
            include: { author: true, },
        });

        return posts.map(transformPost);
    };

    getPostById = async ({ postId, author = false } : { postId: number; author?: boolean}): Promise<type.Post> => {
        const post = await prisma.post.findUnique({
            where: { id: postId },
            include: { author },
        });

        if (!post) {
            throw new Error("NOT_FOUND");
        }

        return transformPost(post);
    };

    isMyPost = async (userId: number, postId: number): Promise<type.Post> => {
        const post = await prisma.post.findUnique({
            where: { id: postId },
            // include: { author: true}
        });

        if (!post) {
            throw new Error("NOT_FOUND");
        }

        if (post.authorId !== userId) {
            throw new Error("FORBIDDEN");
        }

        return transformPost(post);
    };

    updatePost = async ({ input, postId } : type.PostMutationUpdatePostArgs & { postId: number } ): Promise<type.Post> => {
        const post = await prisma.post.update({ where: {id: postId}, data: input, });
        return transformPost(post);
    };

    deletePost = async (postId: number): Promise<type.Post> => {
        const post = await  prisma.post.delete({ where: { id: postId }, });
        return transformPost(post);
    };
}

export default PostService;
