import {z, ZodError} from "zod/v4";
import {InputData} from "@/types/graphql/zod";

const authSchema = z.object({
    id: z.number().int("ID must be an integer"),
    name: z.string().min(3, "Name is required"),
    email: z.email("Invalid email format"),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters long")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/,
            "Password must contain at least one uppercase letter, one lowercase letter, and one number"
        ),
});

const getInputsSchema = z.object({
    page: z.number().min(1, "Page must be at least 1").default(1),
    limit: z.number().min(1, "Limit must be at least 1").max(10, "Limit must be at most 10").default(10),
});

export const postSchema = z.object({
    title: z.string().min(3, "Title is required"),
    content: z.url("Content must be a valid URL"),
});

const formatError = (error: ZodError<unknown>) =>
    error.issues.map((issue) => issue.message).join(", ");

// Validator class
class ZodValidator {

    formatError = formatError;

    isRegister(input: InputData) {
        return authSchema.pick({ name: true, email: true, password: true }).parse(input);
    }

    isAuth(input: InputData) {
        return authSchema.pick({ email: true, password: true }) .parse(input);
    }

    isEmail(email: string) {
        return z.email("Invalid email format").parse(email);
    }

    isId(id: number) {
        return authSchema.pick({id: true}).parse({id});
    }

    isGetInputs(input: InputData) {
        return getInputsSchema.parse(input);
    }

    isValidCreatePost(input: InputData) {
        return postSchema.parse(input);
    }

    isValidUpdatePost(input: InputData) {
        return postSchema.partial().refine(
            (data) => data.title !== undefined || data.content !== undefined,
            { message: "At least one field (title or content) must be provided." }
        ).parse(input);
    }

    isValidComment(comment: string) {
        return z.object({
            comment: z.string().min(1, "Comment content is required")
        }).parse({comment});
    }

    isValidOtp(input: InputData) {
        return z.object({
            otp: z.string().length(6, "OTP must be exactly 6 digits"),
            identifier: z.email("Invalid email format"),
            purpose: z.enum(["LOGIN" , "REGISTER"]),
        }).parse(input);
    }

    isValidPurpose(purpose: string) {
        return z.enum(["LOGIN", "REGISTER"]).parse(purpose);
    }
}

export {
    ZodValidator,
    formatError,
};
