import {meMutation} from "@graphql/handlers/user";

import {createUser, signIn, sendOtp, verifyOtp} from "../handlers/auth.handler";
import {createPost, postMutation} from "../handlers/post";
import { Resolvers } from "../types";

import {sendOTPInEmail} from "@/lib/bullmq/producer";

export const Mutation: Resolvers["Mutation"] = {
    // Authentication and Authorization
    createUser, signIn, sendOtp, verifyOtp,
    // User Management
    me: meMutation,
    // Posts
    createPost,
    post: postMutation,
    testMutation: async (_, { email, otp, name, purpose }) => {
        await sendOTPInEmail({ identifier: email, otp, name, purpose });
        return "Test mutation successful!";
    }
};
