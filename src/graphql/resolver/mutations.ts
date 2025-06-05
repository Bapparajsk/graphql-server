import { Resolvers } from "../types";
import {createUser, signIn} from "../handlers/auth.handler";
import {createPost, postMutation} from "../handlers/post";

export const Mutation: Resolvers["Mutation"] = {
    // Authentication and Authorization
    createUser, signIn,
    // Posts
    createPost,
    post: postMutation
}
