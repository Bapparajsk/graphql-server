// Importing custom types that include author information along with Post and Comment
import { PostWithAuthor, CommentWithAuthor } from "@graphql/services/result";

// Importing original User type from Prisma and transformed types for output formatting
import { User } from "@/lib/prisma";
import { TransformedPost, TransformedComment, TransformedUser } from "@/types/lib/transformers";

/**
 * Masks the given email for privacy.
 * Example: john.doe@example.com -> j*****@example.com
 * @param email - The email address to mask
 * @returns A masked version of the email
 */
export function maskEmail(email: string): string {
    const [name, domain] = email.split("@");
    if (!name || !domain) return email;
    return name[0] + "*".repeat(5) + "@" + domain;
}

/**
 * Converts a Date object or date string to an ISO string.
 * @param date - Date or date string
 * @returns ISO 8601 formatted string
 */
export function convertDateToISO(date: Date | string): string {
    if (typeof date === "string") {
        date = new Date(date);
    } else if (!(date instanceof Date)) {
        throw new Error("Invalid date format");
    }
    return date.toISOString();
}

/**
 * Transforms a post object into a TransformedPost format.
 * - Converts `createdAt` and `updatedAt` to ISO strings
 * - Includes transformed `author` if available
 * @param post - Post object with optional author
 * @returns Transformed post object
 */
export const transformPost = (post: PostWithAuthor): TransformedPost => ({
    ...post,
    createdAt: convertDateToISO(post.createdAt),
    updatedAt: convertDateToISO(post.updatedAt),
    ...(post.author && { author: transformUser(post.author) }),
});

/**
 * Transforms a comment object into a TransformedComment format.
 * - Converts `createdAt` and `updatedAt` to ISO strings
 * - Includes transformed `author` if available
 * @param comment - Comment object with optional author
 * @returns Transformed comment object
 */
export const transformComment = (comment: CommentWithAuthor): TransformedComment => ({
    ...comment,
    createdAt: convertDateToISO(comment.createdAt),
    updatedAt: convertDateToISO(comment.updatedAt),
    ...(comment.author && { author: transformUser(comment.author) }),
});

/**
 * Transforms a user object into a TransformedUser format.
 * - Converts `createdAt` and `updatedAt` to ISO strings
 * - Masks the user's email for privacy
 * @param user - User object from the database
 * @returns Transformed user object
 */
export const transformUser = (user: User): TransformedUser => ({
    ...user,
    createdAt: convertDateToISO(user.createdAt),
    updatedAt: convertDateToISO(user.updatedAt),
    email: maskEmail(user.email),
});
