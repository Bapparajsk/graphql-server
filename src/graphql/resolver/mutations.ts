import {createUser, signIn, sendOtp, verifyOtp} from "../handlers/auth.handler";
import {createPost, postMutation} from "../handlers/post";
import { Resolvers } from "../types";

export const Mutation: Resolvers["Mutation"] = {
    // Authentication and Authorization
    createUser, signIn, sendOtp, verifyOtp,
    // Posts
    createPost,
    post: postMutation
};
