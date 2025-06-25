import {postList,  postQuery} from "../handlers/post";
import {user, me} from "../handlers/user";
import {Resolvers} from "../types";

export const Query: Resolvers["Query"] = {
    // * Resolver for the 'user' query
    user, me,
    // * Resolver for the 'postList' query
    postList,
    post: postQuery,
};
