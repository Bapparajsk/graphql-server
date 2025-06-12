import { PrismaClientKnownRequestError } from "../../../generated/prisma/runtime/library";
import {customErrors, customError} from "../helper";
import {MutationResolvers, User} from "../types";

import {singCookie} from "@/lib/cookies";


export const createUser: MutationResolvers["createUser"] = async (_, { input }, {services, tools, response}) => {
    try {
        // Validate inputs using Zod schema
        const inputData = tools.zodValidator.isRegister(input);

        // Create services using the userController
        const user = await services.auth.createUser({ input : inputData });
        const token = tools.jsonWebToken.sign({ id: user.id, name: user.name });

        // Set the token in the response cookie
        singCookie(token, response); // 2 days
        return { token, user };

    } catch (e) {
        console.log("Error in createUser:", e);
        if (e instanceof PrismaClientKnownRequestError) {
            if (e.code === "P2002") {
                // Unique constraint failed
                throw customError("BAD_USER_INPUT", "Email already exists");
            }
        }
        throw customErrors(e);
    }
};

export const signIn: MutationResolvers["signIn"] = async (_, { input }, {services, tools, response}) => {
    try {
        // * Validate inputs using Zod schema
        const inputData = tools.zodValidator.isAuth(input);

        // * Sign in services using the userController
        const user = await services.auth.singInUser({ input: inputData});
        const token = tools.jsonWebToken.sign({ id: user.id, name: user.name });

        // * Set the token in the response cookie
        singCookie(token, response);

        // * Return the services data
        return { token, user };
    } catch (e) {
        console.log("Error in signIn:", e);

        if(e instanceof Error) {
            throw customError("BAD_USER_INPUT", e.message);
        }

        throw customErrors(e);
    }
};

export const sendOtp: MutationResolvers["sendOtp"] = async (_, { input }, { services, tools }) => {
    try {
        const { identifier, purpose } = input;

        // Validate email and normalize
        const validEmail = tools.zodValidator.isEmail(identifier);
        let user: User | null = null;
        // Optional auth check for non-login flows
        if (purpose !== "LOGIN") {
            user = await tools.isAuthenticated();
        }

        // Throttle resend
        const { resendTimeLimit } = await services.auth.getOtpDetails({ identifier: validEmail, purpose });
        if (resendTimeLimit && resendTimeLimit > Date.now()) {
            throw customError({ code: "RESEND_OTP_LIMIT", message: "Please wait before requesting a new OTP", status: 429 });
        }


        user = await services.user.getUserByEmail(validEmail);
        if (!user) {
            throw customError({ code: "USER_NOT_FOUND", message: "User not found", status: 404 });
        }

        // user.

        // Rate limit
        if (user?.otpResetCount >= 5) {
            throw customError({ code: "OTP_RESET_LIMIT", message: "You have reached the maximum OTP reset limit", status: 429 });
        }

        // Generate & send OTP
        const otpDetails = services.auth.generateOtp();
        await services.auth.saveOtp({ identifier: validEmail, purpose, otpDetails });
        await services.auth.sendOtp({ identifier: validEmail, otp: otpDetails.otp });

        // Update user OTP reset count
        await services.user.updateUser(user.id, { otpResetCount: user.otpResetCount + 1 });

        return { success: true, message: "OTP sent successfully" };
    } catch (e) {
        console.error("Error in sendOtp:", e);
        throw customErrors(e, [
            { code: "ERROR_SENDING_OTP", message: "Failed to send OTP", status: 500 },
        ]);
    }
};


export const verifyOtp: MutationResolvers["verifyOtp"] = async (_, { input }, { services, tools }) => {
    try {

        const user = await tools.isAuthenticated();

        const { otp, identifier, purpose } = input;
        const isValid = await services.auth.verifyOtp({ identifier, otp, purpose });

        if(!isValid) {
            throw customError({ code: "INVALID_OTP", message: "Invalid OTP", status: 400 });
        }

        await services.user.setUserVerified(user.id);

        return { success: true, message: "OTP verified successfully" };

    } catch (e) {
        console.log("Error in verifyOtp:", e);
        throw customErrors(e, [
            { code: "OTP_NOT_FOUND", message: "OTP not found", status: 404 },
            { code: "INVALID_OTP", message: "Invalid OTP", status: 400 },
            { code: "OTP_EXPIRED", message: "OTP has expired", status: 400 },
        ]);
    }
};
