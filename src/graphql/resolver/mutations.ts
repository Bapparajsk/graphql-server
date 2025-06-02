import { Resolvers } from "../types";
import {createUser, signIn} from "../handlers/auth.handler";
import {createPost} from "../handlers/post.handlers";

export const Mutation: Resolvers["Mutation"] = {
    createUser, signIn,
    createPost,
}
