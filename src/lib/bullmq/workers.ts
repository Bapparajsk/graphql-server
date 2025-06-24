import { readFile } from "fs/promises";
import path from "path";

import {createWorker, queue_names} from "@/config/bullmq.config";
import transporter from "@/config/nodemailer.config";
import {getMailConfig} from "@/lib/bullmq/helper";
import {SendOtpType} from "@/types/graphql/auth.service";

createWorker(queue_names.EMAIL, async (job) => {
    const { otp, identifier: email, purpose, name } = job.data as SendOtpType;

    const { subject, title, description, footer, greetingName } = getMailConfig(purpose);

    const filePath = path.resolve(__dirname, "../../template/otp.html");
    const htmlTemplate = await readFile(filePath, "utf-8");

    const htmlContent = htmlTemplate
        .replace("{{title}}", title)
        .replace("{{greeting}}", greetingName(name))
        .replace("{{description}}", description)
        .replace("{{otp}}", otp)
        .replace("{{footer}}", footer);


    const data = await transporter.sendMail({
        from: process.env.TRANSPORTER_USER || "your email",
        to: email,
        subject,
        html: htmlContent,
    });
    console.log("Email sent successfully:", data.accepted);
});
