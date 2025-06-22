import { readFile } from "fs/promises";
import path from "path";

import {createWorker, queue_names} from "@/config/bullmq.config";
import transporter from "@/config/nodemailer.config";
import {SendOtpType} from "@/types/graphql/auth.service";

createWorker(queue_names.EMAIL, async (job) => {
    const { otp, identifier: email, purpose, name } = job.data as SendOtpType;

    const greeting = purpose === "REGISTER" ? `Welcome ${name}` : `Hello ${name}`;
    const file = purpose === "REGISTER" ? "otp" : "login";
    const subject = purpose === "REGISTER" ? "Welcome to Our Service" : "Your OTP for Verification";

    const filePath = path.resolve(__dirname, `../../template/${file}.html`);
    const htmlTemplate = await readFile(filePath, "utf-8");

    const htmlContent = htmlTemplate
        .replace("{{otp}}", otp)
        .replace("{{greeting}}", greeting);

    const data = await transporter.sendMail({
        from: process.env.TRANSPORTER_USER || "your email",
        to: email,
        subject,
        html: htmlContent,
    });
    console.log("Email sent successfully:", data.accepted);
});
