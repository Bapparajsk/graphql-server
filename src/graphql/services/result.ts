import { Post, User, Comment } from "@/lib/prisma";
import { transformPost, transformUser, transformComment } from "@/lib/transformers";

// Used to add optional author to Post or Comment types
type Author = {
    author?: User;
};

export type PostWithAuthor = Post & Author;
export type CommentWithAuthor = Comment & Author;

/**
 * Handles transformation and access for single or multiple PostWithAuthor items
 */
class PostResult {
    constructor(private readonly item: PostWithAuthor | PostWithAuthor[]) {}

    // Returns raw post(s)
    get raw() {
        return this.item;
    }

    // Returns transformed post(s)
    transform() {
        return Array.isArray(this.item)
            ? this.item.map(transformPost)
            : transformPost(this.item);
    }
}

/**
 * Handles transformation and access for single or multiple CommentWithAuthor items
 */
class CommentResult {
    constructor(private readonly item: CommentWithAuthor | CommentWithAuthor[]) {}

    // Returns raw comment(s)
    get raw() {
        return this.item;
    }

    // Returns transformed comment(s)
    transform() {
        return Array.isArray(this.item)
            ? this.item.map(transformComment)
            : transformComment(this.item);
    }
}

/**
 * Handles transformation and access for single or multiple User items
 */
class UserResult {
    constructor(private readonly item: User | User[]) {}

    // Returns raw user(s)
    get raw() {
        return this.item;
    }

    // Returns transformed user(s)
    transform() {
        return Array.isArray(this.item)
            ? this.item.map(transformUser)
            : transformUser(this.item);
    }
}

export {
    PostResult,
    CommentResult,
    UserResult
};
