import { QueryResolvers } from "@graphql/types";

import { tryCatch } from "@/lib/try-catch";

// Resolver for fetching a paginated list of posts
export const postList: QueryResolvers["postList"] = async (_, { userId, input }, { services, tools }) => {
    return tryCatch(async () => {
        // Ensure the user is authenticated
        await tools.isAuthenticated();

        // If a userId is provided, validate it and check if the user exists
        if (userId) {
            const validId = tools.zodValidator.isId(userId);
            const user = await services.user.getUserById(validId.id);

            // If the user doesn't exist, throw an error
            if (!user) {
                throw new Error("User not found");
            }
        }

        // Validate the pagination input (limit, page)
        const validInput = tools.zodValidator.isGetInputs(input);

        // Fetch the list of posts using the validated input and optional userId
        const postResultArray = await services.post.getPosts({
            input: validInput,
            userId: userId
        });

        // Transform raw post data (e.g., formatting dates or hiding sensitive fields)
        const posts = postResultArray.transform();

        // Determine if there's a next page based on number of results returned
        const hasNextPage = posts.length === input.limit;

        // Return posts and pagination flag
        return { posts, hashNext: hasNextPage }; // Note: consider renaming 'hashNext' → 'hasNext'
    });
};

// Resolver for fetching a single post by its ID
export const postQuery: QueryResolvers["post"] = async (_, { postId }, { services, tools }) => {
    return tryCatch(async () => {
        // Ensure the user is authenticated
        await tools.isAuthenticated();

        // Fetch the post by its ID
        const postResult = await services.post.getPostById({ postId });

        // Transform and return the post
        return { post: postResult.transform() };
    });
};
