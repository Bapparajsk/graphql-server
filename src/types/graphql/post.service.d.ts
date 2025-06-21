import {
    MutationCreatePostArgs,
    PostMutationUpdatePostArgs,
    QueryPostListArgs
} from "@graphql/types";

/**
 * Represents a post's unique identifier.
 */
export type PostId = {
    postId: number;
};

/**
 * Input type for creating a post.
 * Combines the GraphQL input args with the author's ID.
 */
export type CreatePostInput = MutationCreatePostArgs & {
    authorId: number;
};

/**
 * Input type for fetching a list of posts.
 * Optionally allows filtering by a specific post ID.
 */
export type GetPostInput = QueryPostListArgs & {
    id?: number;
};

/**
 * Input type for fetching a post by ID.
 * Optionally includes a flag to indicate whether to verify the author's ownership.
 */
export type getPostById = PostId & {
    author?: boolean;
};

/**
 * Input type for updating a post.
 * Combines update arguments with the post ID to identify which post to modify.
 */
export type UpdatePostInput = PostMutationUpdatePostArgs & PostId;
