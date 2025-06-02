import * as type from "../types";
import prisma from '../../lib/prisma';

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
    }

    getPosts = ({ id, limit, page }: type.GetInputs & { id?: number }): Promise<type.Post[]> => {
        const skip = (page - 1) * limit;
        if( !id ) {
            return prisma.post.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: { author: true }
            });
        }

        return prisma.post.findMany({
            where: { authorId: id },
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: { author: true }
        });
    }
}

export default PostService;
