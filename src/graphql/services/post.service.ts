import * as type from "../types";

import prisma from "@/lib/prisma";


class PostService {
    createPost = ({ input, authorId }: type.MutationCreatePostArgs & { authorId : number } ): Promise<type.Post> => {
        const { title, content } = input;

        return prisma.post.create({
            data: {
                title,
                content,
                authorId
            }
        });
    };

    getPosts = ({ id, limit, page }: type.GetInputs & { id?: number }): Promise<type.Post[]> => {
        const skip = (page - 1) * limit;
        if( !id ) {
            return prisma.post.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
                include: { author: true }
            });
        }

        return prisma.post.findMany({
            where: { authorId: id },
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
            include: { author: true }
        });
    };

    getPostById = (id: number): Promise<type.Post | null> => {
        return prisma.post.findUnique({
            where: { id },
        });
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

        return post;
    };

    // Updates post
    updatePost = async ({ input, postId } : type.PostMutationUpdatePostArgs & { postId: number } ): Promise<type.Post> => {
        return prisma.post.update({
            where: {id: postId},
            data: input,
        });
    };
}

export default PostService;
