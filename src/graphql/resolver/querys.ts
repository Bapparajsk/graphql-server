import {postList,  postQuery} from "../handlers/post";
import {user, meQuery} from "../handlers/user";
import {Resolvers} from "../types";

export const Query: Resolvers["Query"] = {
    // * Resolver for the 'user' query
    user, me: meQuery,
    // * Resolver for the 'postList' query
    postList,
    post: postQuery,
};
