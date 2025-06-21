import { customError } from "@graphql/helper";
import { PostResult, PostResultArray } from "@graphql/services/result";

import prisma from "@/lib/prisma";
import {
    CreatePostInput,
    getPostById,
    GetPostInput,
    UpdatePostInput
} from "@/types/graphql/post.service";

class PostService {
    /**
     * 📝 Create a new post with title, content, and author ID.
     */
    createPost = async ({ input, authorId }: CreatePostInput): Promise<PostResult> => {
        const { title, content } = input;

        const post = await prisma.post.create({
            data: {
                title,
                content,
                authorId
            }
        });

        return new PostResult(post);
    };

    /**
     * 📚 Fetch paginated list of posts.
     * Optionally filter by user ID (authorId).
     */
    getPosts = async ({ input, userId }: GetPostInput): Promise<PostResultArray> => {
        const skip = (input.page - 1) * input.limit;

        const posts = await prisma.post.findMany({
            where: userId ? { authorId: userId } : undefined,
            skip,
            take: input.limit,
            orderBy: { createdAt: "desc" },
            include: { author: true },
        });

        return new PostResultArray(posts);
    };

    /**
     * 🔍 Fetch a post by its ID.
     * Optionally include author information.
     */
    getPostById = async ({ postId, author = false }: getPostById): Promise<PostResult> => {
        const post = await prisma.post.findUnique({
            where: { id: postId },
            include: { author },
        });

        if (!post) {
            throw customError({
                code: "NOT_FOUND",
                message: "Post not found",
                status: 404
            });
        }

        return new PostResult(post);
    };

    /**
     * 🔒 Check if the current user is the author of the post.
     * Throws an error if unauthorized or post doesn't exist.
     */
    isMyPost = async (userId: number, postId: number): Promise<PostResult> => {
        const post = await prisma.post.findUnique({
            where: { id: postId },
        });

        if (!post) {
            throw customError({
                code: "NOT_FOUND",
                message: "Post not found",
                status: 404
            });
        }

        if (post.authorId !== userId) {
            throw customError({
                code: "FORBIDDEN",
                message: "You are not authorized to access this post",
                status: 403
            });
        }

        return new PostResult(post);
    };

    /**
     * ✏️ Update a post by ID using the provided input.
     */
    updatePost = async ({ input, postId }: UpdatePostInput): Promise<PostResult> => {
        const post = await prisma.post.update({
            where: { id: postId },
            data: input,
        });

        return new PostResult(post);
    };

    /**
     * ❌ Delete a post by ID.
     */
    deletePost = async (postId: number): Promise<PostResult> => {
        const post = await prisma.post.delete({
            where: { id: postId },
        });

        return new PostResult(post);
    };
}

export default PostService;
