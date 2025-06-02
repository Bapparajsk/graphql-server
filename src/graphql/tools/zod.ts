import {z, ZodError} from "zod/v4";

// Schemas
const idSchema = z.object({
    id: z.number().int("ID must be an integer"),
});

const authSchema = z.object({
    email: z.email("Invalid email format"),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters long")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/,
            "Password must contain at least one uppercase letter, one lowercase letter, and one number"
        ),
});

const registerSchema = z.object({
    name: z.string().min(3, "Name is required"),
    ...authSchema.shape,
});

const getInputsSchema = z.object({
    page: z.number().min(1, "Page must be at least 1").default(1),
    limit: z.number().min(1, "Limit must be at least 1").max(10, "Limit must be at most 10").default(10),
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
}

// Validator class
class ZodValidator {

    formatError = formatError;

    isRegister(input: InputData) {
        return registerSchema.parse(input);
    }

    isAuth(input: InputData) {
        return authSchema.parse(input);
    }

    isId(input: InputData) {
        return idSchema.parse(input);
    }

    isGetInputs(input: InputData) {
        return getInputsSchema.parse(input);
    }

}

export {
    ZodValidator,
    formatError,
}
