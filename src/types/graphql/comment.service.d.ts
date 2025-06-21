import { PostQueryCommentsArgs } from "@graphql/types";

/**
 * Represents a post's identifier.
 */
export type PostId = {
    postId: number;
};

/**
 * Represents a comment's identifier.
 */
export type CommentType = {
    commentId: number;
};

/**
 * Used to fetch comments for a specific post with additional GraphQL query arguments (e.g., pagination).
 */
export type GetCommentsType = PostQueryCommentsArgs & PostId;

/**
 * Represents the data needed to add a comment to a post.
 * Includes the post ID, comment ID (e.g., for replies), and the ID of the user adding the comment.
 */
export type AddCommentType = PostId & CommentType & {
    userId: number;
};

/**
 * Represents the data needed to update a comment.
 * Includes the comment ID and an optional flag indicating if the current user is the author.
 */
export type UpdateCommentType = CommentType & {
    commentId: number;
    isAuthor?: boolean; // Optional, can be used to restrict edit permissions
};
