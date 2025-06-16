import { EmailQueue } from "@/config/bullmq.config";

export const sendOTPInEmail = async ({ email, otp } : { email: string, otp: string }) => {
    await EmailQueue.add("send-email", {
        email,
        otp
    }, {
        attempts: 3, // Retry up to 3 times on failure
        backoff: {
            type: "exponential",
            delay: 1000 // Initial delay of 1 second
        }
    });
};
