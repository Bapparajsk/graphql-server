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
 * A Post type where the `createdAt` and `updatedAt` fields are converted to strings,
 * and the optional `author` field is included using the TransformedUser format.
 */
export type TransformedPost =
    Omit<Post, "createdAt" | "updatedAt"> & Transformed & Author;

/**
 * A Comment type with transformed timestamps and optional `author` details.
 */
export type TransformedComment =
    Omit<Comment, "createdAt" | "updatedAt"> & Transformed & Author;

/**
 * A User type with stringified timestamps.
 */
export type TransformedUser =
    Omit<User, "createdAt" | "updatedAt"> & Transformed;
