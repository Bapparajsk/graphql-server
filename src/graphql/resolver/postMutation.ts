import {customErrors} from "../helper";
import { Resolvers } from "../types";

import prisma from "@/lib/prisma";

export const PostMutation: Resolvers["PostMutation"] = {
    updatePost: async ({ post }, { input }, { tools }) => {
        try {
            const isValidInput = tools.zodValidator.isValidUpdatePost(input);

            return await prisma.post.update({
                where: {id: post.id},
                data: {
                    title: isValidInput.title,
                    content: isValidInput.content,
                },
            });
        } catch (e) {
            throw customErrors(e);
        }
    }
};
