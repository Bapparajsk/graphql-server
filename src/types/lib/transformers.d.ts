// Importing the original Prisma types for Post, Comment, and User
import { Post, Comment, User } from "@/lib/prisma";

/**
 * A shared type used to replace the default `createdAt` and `updatedAt` fields
 * with ISO string formats for consistency in API responses.
 */
export type Transformed = {
    createdAt: string;
    updatedAt: string;
}

/**
 * A reusable type that represents the `author` field, optionally present
 * on both posts and comments. This uses the transformed version of User.
 */
export type Author = {
    author?: TransformedUser;
}

/**
* A type that represents the fields in Post and Comment that are transformed
* to string format. This is used to ensure consistency across different types.
*/
type TransformedField = "createdAt" | "updatedAt";

/**
 * A Post type where the `createdAt` and `updatedAt` fields are converted to strings,
 * and the optional `author` field is included using the TransformedUser format.
 */
export type TransformedPost =
    Omit<Post, TransformedField> & Transformed & Author;

/**
 * A Comment type with transformed timestamps and optional `author` details.
 */
export type TransformedComment =
    Omit<Comment, TransformedField> & Transformed & Author;

/**
 * A User type with stringified timestamps.
 */
export type TransformedUser =
    Omit<User, TransformedField> & Transformed;
