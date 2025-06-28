import {z, ZodError} from "zod/v4";

import {authSchema, getInputsSchema, postSchema, purposeEnum, userUpdateSchema} from "./object.zod";

import {InputData, UserUpdateInput} from "@/types/graphql/zod";

const formatError = (error: ZodError<unknown>) =>
    error.issues.map((issue) => issue.message).join(", ");

// Validator class
class ZodValidator {

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
            purpose: purposeEnum
        }).parse(input);
    }

    isValidPurpose(purpose: string) {
        return purposeEnum.parse(purpose);
    }

    isValidUserUpdate(input: UserUpdateInput) {
        return userUpdateSchema.refine(
            (data) =>
                data.name !== undefined || data.bio !== undefined || data.profilePic !== undefined ||
                data.backgroundPic !== undefined || data.oldPassword !== undefined || data.newPassword !== undefined ,
            "At least one field must be provided for update.")
            .parse(input);
    }
}

export {
    ZodValidator,
    formatError,
};
