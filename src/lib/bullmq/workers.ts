import { readFile } from "fs/promises";
import path from "path";

import {createWorker, queue_names} from "@/config/bullmq.config";
import transporter from "@/config/nodemailer.config";

createWorker(queue_names.EMAIL, async (job) => {
    const { email, otp } = job.data;


    const filePath = path.resolve(__dirname, "../../template/otp.html");
    const htmlTemplate = await readFile(filePath, "utf-8");

    const htmlContent = htmlTemplate.replace("{{otp}}", otp);

    await transporter.sendMail({
        from: process.env.TRANSPORTER_USER || "your email",
        to: email,
        subject: "🔐 Your One-Time Password (OTP) for Verification",
        html: htmlContent,
        // subject: "otp",
        // text: `Your OTP is ${otp}`,
    });
});
