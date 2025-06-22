import { EmailQueue } from "@/config/bullmq.config";
import {SendOtpType} from "@/types/graphql/auth.service";

export const sendOTPInEmail = async (data : SendOtpType) => {
    await EmailQueue.add("send-email", data, {
        attempts: 3, // Retry up to 3 times on failure
        backoff: {
            type: "exponential",
            delay: 1000 // Initial delay of 1 second
        }
    });
};
