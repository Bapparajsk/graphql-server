import {createUser, signIn, sendOtp, verifyOtp} from "../handlers/auth.handler";
import {createPost, postMutation} from "../handlers/post";
import { Resolvers } from "../types";

import {sendOTPInEmail} from "@/lib/bullmq/producer";

export const Mutation: Resolvers["Mutation"] = {
    // Authentication and Authorization
    createUser, signIn, sendOtp, verifyOtp,
    // Posts
    createPost,
    post: postMutation,
    testMutation: async (_, { email, otp }, {}) => {
        await sendOTPInEmail({ email, otp });
        return "Test mutation successful!";
    }
};
