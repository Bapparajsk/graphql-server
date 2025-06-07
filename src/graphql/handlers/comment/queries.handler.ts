import {PostQueryResolvers} from "@/graphql/types";

export const comments: PostQueryResolvers["comments"] = async ({ post }, { input }, { services, tools }) => {
    try {
        const valiInput = tools.zodValidator.isGetInputs(input);
        const commentsList = await services.comment.getComments({
            postId: post.id,
            input: valiInput
        }) || [];

        const hashNext = commentsList.length === valiInput.limit;
        return { comments: commentsList, hashNext };
    } catch (e) {
        console.error("Error in comments resolver:", e);
        throw new Error("Failed to fetch comments");
    }
};
