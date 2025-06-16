import {PostWithAuthor, CommentWithAuthor} from "@graphql/services/result";

import { Post, Comment, User } from "@/lib/prisma";

export function maskEmail(email: string): string {
    const [name, domain] = email.split("@");
    if (!name || !domain) return email;
    return name[0] + "*".repeat(5) + "@" + domain;
}

export function convertDateToISO(date: Date | string): string {
    if (typeof date === "string") {
        date = new Date(date);
    } else if (!(date instanceof Date)) {
        throw new Error("Invalid date format");
    }
    return date.toISOString();
}

type Transformed = {
    createdAt: string;
    updatedAt: string;
}

export type TransformedPost = Omit<Post, "createdAt" | "updatedAt"> & Transformed & Author;
export type TransformedComment = Omit<Comment, "createdAt" | "updatedAt"> & Transformed & Author;
export type TransformedUser = Omit<User, "createdAt" | "updatedAt"> & Transformed;

type Author = {
    author?: TransformedUser;
}

export const transformPost = (post: PostWithAuthor): TransformedPost  => ({
    ...post,
    createdAt: convertDateToISO(post.createdAt),
    updatedAt: convertDateToISO(post.updatedAt),
    ...(post.author && { author: transformUser(post.author) }),
});

export const transformComment = (comment: CommentWithAuthor): TransformedComment => ({
    ...comment,
    createdAt: convertDateToISO(comment.createdAt),
    updatedAt: convertDateToISO(comment.updatedAt),
    ...(comment.author && { author: transformUser(comment.author) }),
});

export const transformUser = (user: User): TransformedUser => ({
    ...user,
    createdAt: convertDateToISO(user.createdAt),
    updatedAt: convertDateToISO(user.updatedAt),
    email: maskEmail(user.email),
});
