import {PurposeEnum} from "@/types/graphql/auth.service";

const subjects = {
    EMAIL_VERIFICATION: "Welcome to Our Service",
    LOGIN: "Your OTP for Verification",
};

const titles = {
    EMAIL_VERIFICATION: "Verify Your Email",
    LOGIN: "Login Verification",
};

const descriptions = {
    EMAIL_VERIFICATION: "Please verify your email address to complete the registration process.",
    LOGIN: "Use the following OTP to log in to your account.",
};

const footers = {
    EMAIL_VERIFICATION: "Thank you for joining us!",
    LOGIN: "If you did not request this, please ignore this email.",
};

export const getMailConfig = (purpose: PurposeEnum) => {
    const greetingName = (name: string) => {
        return purpose === "EMAIL_VERIFICATION" ? `Welcome ${name}` : `Hello ${name}`;
    };

    return {
        subject: subjects[purpose],
        title: titles[purpose],
        description: descriptions[purpose],
        footer: footers[purpose],
        greetingName,
    };
};
