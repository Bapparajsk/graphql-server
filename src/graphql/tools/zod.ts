import {z, ZodError} from "zod/v4";

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

// Input type
interface InputData {
    id?: number;
    email?: string;
    password?: string;
    name?: string;
    page?: number;
    limit?: number;
    title?: string;
    content?: string;
}

// Validator class
class ZodValidator {

    formatError = formatError;

    isRegister(input: InputData) {
        return authSchema.parse(input);
    }

    isAuth(input: InputData) {
        return authSchema.pick({ email: true, password: true }) .parse(input);
    }

    isId(input: InputData) {
        return authSchema.pick({id: true}).parse(input);
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
}

export {
    ZodValidator,
    formatError,
};
