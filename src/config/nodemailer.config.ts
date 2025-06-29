import { createTransport } from "nodemailer";

const transporter = createTransport({
    host: process.env.TRANSPORTER_HOST || "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.TRANSPORTER_USER || "your email",
        pass: process.env.TRANSPORTER_PASS || "your password",
    },
});

export default transporter;
