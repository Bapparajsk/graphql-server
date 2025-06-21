import {MutationResolvers, PostMutationResolvers} from "@/graphql/types";
import {filterValidFields} from "@/lib/filter";
import {tryCatch} from "@/lib/try-catch";


// Resolver function for the 'createPost' mutation
export const createPost: MutationResolvers["createPost"] = async (_parent, { input }, { services, tools }) => {
    return tryCatch(async () => {
        // Ensure the user is authenticated and retrieve the current user (author)
        const { value: author } = await tools.isAuthenticated();

        // Validate the post creation input using Zod schema
        const isValidInput = tools.zodValidator.isValidCreatePost(input);

        // Create the post using the validated input and current author's ID
        const { transform: post } = await services.post.createPost({
            input: isValidInput,
            authorId: author.id,
        });

        // Return the transformed post object along with the author's info
        return { ...post(), author };
    });
};

// Mutation resolver for accessing a specific post and its context (postId, post data, user)
export const postMutation: MutationResolvers["post"] = async (_parent, { id }, { services, tools }) => {
    return tryCatch(async () => {
        // Ensure the user is authenticated
        const user = await tools.isAuthenticated();

        // Validate the post ID
        const validId = tools.zodValidator.isId(id);

        // Retrieve the post by ID
        const { value: post } = await services.post.getPostById({ postId: validId.id });

        // Return the post ID, post data, and user for nested resolvers like update/delete
        return { postId: post.id, post, user };
    });
};

// Mutation resolver to update a post
export const updatePost: PostMutationResolvers["updatePost"] = async ({ postId, user }, { input }, { services, tools }) => {
    return tryCatch(async () => {
        // Ensure the post belongs to the user (authorization check)
        const { value: isMyPost } = await services.post.isMyPost(user.id, postId);

        // Validate and filter only the fields allowed to be updated
        const data = filterValidFields(tools.zodValidator.isValidUpdatePost(input));

        // Update the post with validated data
        const { value: updatedPost } = await services.post.updatePost({
            input: data,
            postId: isMyPost.id,
        });

        // Return the updated post along with the author's info
        return { ...updatedPost, author: user };
    });
};

// Mutation resolver to delete a post
export const deletePost: PostMutationResolvers["deletePost"] = async ({ postId, user }, _args, { services }) => {
    return tryCatch(async () => {
        // Ensure the post belongs to the user
        const { value: post } = await services.post.isMyPost(user.id, postId);

        // Perform the deletion
        await services.post.deletePost(post.id);

        // Return true to indicate success
        return true;
    });
};
