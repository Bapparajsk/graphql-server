import { PostQueryResolvers } from "@/graphql/types";
import { tryCatch } from "@/lib/try-catch";

// Resolver to fetch paginated comments for a specific post
export const comments: PostQueryResolvers["comments"] = async ({ post }, { input }, { services, tools }) => {
    return tryCatch(async () => {
        // Validate pagination input (limit, page, etc.)
        const valiInput = tools.zodValidator.isGetInputs(input);

        // Fetch comments related to the specific post with pagination
        const commentResultArray = await services.comment.getComments({
            postId: post.id,
            input: valiInput
        });

        // Transform raw comment data to match GraphQL response shape
        const commentsList = commentResultArray.transform();

        // Determine if there's a next page
        const hashNext = commentsList.length === valiInput.limit;

        // Return comments and pagination flag
        return { comments: commentsList, hashNext };
    });
};
