import {PostResult} from "@graphql/services/result";

import * as type from "../types";

import prisma from "@/lib/prisma";

class PostService {

    createPost = async ({ input, authorId }: type.MutationCreatePostArgs & { authorId : number } ): Promise<PostResult> => {
        const { title, content } = input;

        const post = await  prisma.post.create({
            data: {
                title,
                content,
                authorId
            }
        });

        return new PostResult(post);
    };

    getPosts = async ({ input, userId }: type.QueryPostListArgs & { id?: number }): Promise<PostResult> => {
        const skip = (input.page - 1) * input.limit;
        const posts = await prisma.post.findMany({
            where: userId ? { authorId: userId } : undefined,
            skip,
            take: input.limit,
            orderBy: { createdAt: "desc" },
            include: { author: true, },
        });

        return new PostResult(posts);
    };

    getPostById = async ({ postId, author = false } : { postId: number; author?: boolean}): Promise<PostResult> => {
        const post = await prisma.post.findUnique({
            where: { id: postId },
            include: { author },
        });

        if (!post) {
            throw new Error("NOT_FOUND");
        }

        return new PostResult(post);
    };

    isMyPost = async (userId: number, postId: number): Promise<PostResult> => {
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

        return new PostResult(post);
    };

    updatePost = async ({ input, postId } : type.PostMutationUpdatePostArgs & { postId: number } ): Promise<PostResult> => {
        const post = await prisma.post.update({where: {id: postId}, data: input,});
        return new PostResult(post);
    };

    deletePost = async (postId: number): Promise<PostResult> => {
        const post = await prisma.post.delete({where: {id: postId},});
        return new PostResult(post);
    };

}

export default PostService;
