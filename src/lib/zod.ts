import { z } from "zod/v4";

const authSchema = z.object({
    email: z.email(),
    password: z
        .string()
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/, "Password must contain at least one uppercase letter, one lowercase letter, and one number" )
        .min(6, "Password must be at least 6 characters long"),
});

const registerSchema = z.object({
    name: z.string().min(3, "Name is required"),
    ...authSchema.shape,
});

export {
    z,
    // authentication and registration schemas
    authSchema, registerSchema
}
