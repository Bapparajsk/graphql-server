import {createUser, signIn} from "../handlers/auth.handler";
import {createPost, postMutation} from "../handlers/post";
import { Resolvers } from "../types";

export const Mutation: Resolvers["Mutation"] = {
    // Authentication and Authorization
    createUser, signIn,
    // Posts
    createPost,
    post: postMutation
};
