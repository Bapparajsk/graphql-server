import { z } from "zod/v4";

// Reusable URL schema
export const urlSchema = z.url({ message: "Invalid URL format" });

// Reusable password validation
const passwordSchema = z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/,
        { message: "Password must contain at least one uppercase letter, one lowercase letter, and one number" }
    );

// Auth schema for registering or creating a user
export const authSchema = z.object({
    id: z.number().int({ message: "ID must be an integer" }),
    name: z.string().min(3, { message: "Name must be at least 3 characters long" }),
    email: z.email({ message: "Invalid email format" }),
    password: passwordSchema,
});

// Input schema for pagination
export const getInputsSchema = z.object({
    page: z.number().min(1, { message: "Page must be at least 1" }).default(1),
    limit: z.number().min(1, { message: "Limit must be at least 1" }).max(10, { message: "Limit must be at most 10" }).default(10),
});

// Post creation schema
export const postSchema = z.object({
    title: z.string().min(3, { message: "Title is required" }),
    content: z.string().url({ message: "Content must be a valid URL" }),
});

// User profile update schema
export const userUpdateSchema = z.object({
    name: z.string().min(3, { message: "Name must be at least 3 characters long" }).optional(),
    bio: z.string().max(500, { message: "Bio must be at most 500 characters long" }).optional(),
    profilePic: urlSchema.optional(),
    backgroundPic: urlSchema.optional(),
    oldPassword: z.string().min(6, { message: "Old password must be at least 6 characters long" }).optional(),
    newPassword: passwordSchema.optional(),
});

// Enum for auth-related actions
export const purposeEnum = z.enum(["LOGIN", "EMAIL_VERIFICATION"]);
