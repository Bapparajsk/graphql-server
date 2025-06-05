import { Resolvers } from "../types";
import prisma from "../../lib/prisma";
import {customErrors} from "../helper";

export const PostMutation: Resolvers["PostMutation"] = {
    updatePost: async ({ post, user }, { input }, { tools }) => {
        try {

            const isValidInput = tools.zodValidator.isValidUpdatePost(input);

            return await prisma.post.update({
                where: {id: post.id},
                data: {
                    title: input.title,
                    content: input.content,
                },
            });
        } catch (e) {
            throw customErrors(e);
        }
    }
}
