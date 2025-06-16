import { createWorker, queue_names } from "@/config/bullmq.config";

createWorker(queue_names.EMAIL, async (job) => {
    const { email, otp } = job.data;

    // Simulate sending an email
    console.log(`Sending OTP ${otp} to email: ${email}`);

    // Here you would integrate with your email service to send the actual email
    // For example, using nodemailer or any other email service provider

    // Simulate a successful job completion
    return Promise.resolve();
});
