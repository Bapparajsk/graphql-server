import { Post, User, Comment } from "@/lib/prisma";
import {
    transformPost,
    transformUser,
    transformComment,
    TransformedPost,
    TransformedComment,
    TransformedUser,
} from "@/lib/transformers";

// Add optional author field to Post or Comment
type Author = { author?: User };

export type PostWithAuthor = Post & Author;
export type CommentWithAuthor = Comment & Author;

/** Base class to wrap a single item and apply transformation */
class Result<T, Transformed> {
    constructor(
        private readonly item: T,
        private readonly transformer: (item: T) => Transformed
    ) {}

    raw(): T {
        return this.item;
    }

    get value(): T {
        return this.raw();
    }

    transform(): Transformed {
        return this.transformer(this.item);
    }
}

/** Base class to wrap an array of items and apply transformation */
class ResultArray<T, Transformed> {
    constructor(
        private readonly items: T[],
        private readonly transformer: (item: T) => Transformed
    ) {}

    raw(): T[] {
        return this.items;
    }

    get value(): T[] {
        return this.raw();
    }

    transform(): Transformed[] {
        return this.items.map(this.transformer);
    }
}

/** Post wrapper classes */
class PostResult extends Result<PostWithAuthor, TransformedPost> {
    constructor(item: PostWithAuthor) {
        super(item, transformPost);
    }
}
class PostResultArray extends ResultArray<PostWithAuthor, TransformedPost> {
    constructor(items: PostWithAuthor[]) {
        super(items, transformPost);
    }
}

/** Comment wrapper classes */
class CommentResult extends Result<CommentWithAuthor, TransformedComment> {
    constructor(item: CommentWithAuthor) {
        super(item, transformComment);
    }
}
class CommentResultArray extends ResultArray<CommentWithAuthor, TransformedComment> {
    constructor(items: CommentWithAuthor[]) {
        super(items, transformComment);
    }
}

/** User wrapper classes */
class UserResult extends Result<User, TransformedUser> {
    constructor(item: User) {
        super(item, transformUser);
    }

    get email(): string {
        return this.value.email;
    }
}
class UserResultArray extends ResultArray<User, TransformedUser> {
    constructor(items: User[]) {
        super(items, transformUser);
    }
}

export {
    PostResult, PostResultArray,
    CommentResult, CommentResultArray,
    UserResult, UserResultArray,
};
