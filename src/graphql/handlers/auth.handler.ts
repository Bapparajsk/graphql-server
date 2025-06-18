import {MutationResolvers} from "../types";

import {singCookie} from "@/lib/cookies";
import {tryCatch} from "@/lib/try-catch";


export const createUser: MutationResolvers["createUser"] = async (_, { input }, {services, tools, response}) => {
    return tryCatch( async () => {
        // ✅ Validate inputs using Zod schema (e.g. email, password, name)
        const inputData = tools.zodValidator.isRegister(input);

        // 👤 Create the user via the auth service
        const { value: user } = await services.auth.createUser({ input: inputData });

        // 🔏 Generate a JWT token using the user's ID and name
        const token = tools.jsonWebToken.sign({ id: user.id, name: user.name });

        // 🍪 Set the JWT as an HTTP-only cookie (valid for 2 days)
        singCookie(token, response);

        // 🎉 Return the token and user info to the client
        return { token, user };
    });
};

export const signIn: MutationResolvers["signIn"] = async (_, { input }, { services, tools, response }) => {
    return tryCatch(async () => {
        // 📩 Validate user input (email & password) using Zod schema
        const inputData = tools.zodValidator.isAuth(input);

        // 🔍 Attempt to find the user and verify credentials
        const user = await services.auth.singInUser({ input: inputData });

        // 🔏 Generate JWT token with user ID and name
        const token = tools.jsonWebToken.sign({ id: user.id, name: user.name });

        // 🍪 Set the token as an HTTP-only cookie for client session
        singCookie(token, response);

        // 🎉 Return the authenticated user and token
        return { token, user };
    });
};

export const sendOtp: MutationResolvers["sendOtp"] = async (_, { input }, { services, tools }) => {
    return tryCatch(async () => {
        const { identifier, purpose } = input;

        // ✅ Validate the email format and normalize it
        const validEmail = tools.zodValidator.isEmail(identifier);

        // 🔐 Ensure the user is authenticated if the OTP is not for login (e.g., for account changes)
        if (purpose !== "LOGIN") {
            await tools.isAuthenticated();
        }

        const [, { value: user }] = await Promise.all([
            // ⏱️ Throttle OTP resends to prevent spamming (1-minute cooldown)
            services.auth.isValidThrottle({ identifier: validEmail, purpose }),

            // 🔍 Retrieve user by email to check existence and otpResetCount
            services.user.getUserByEmail(validEmail),
        ]);

        // 🚫 Block request if user has exceeded the allowed OTP reset attempts
        services.user.isValidOtpResetCount(user.otpResetCount);

        // 🔢 Generate a new 6-digit OTP and metadata (expiry and throttle limit)
        const otpDetails = services.auth.generateOtp();

        // 📦 Perform OTP-related operations concurrently:
        await Promise.all([
            // 1️⃣ Save OTP and expiration info in Redis
            services.auth.saveOtp({ identifier: validEmail, purpose, otpDetails }),

            // 2️⃣ Send OTP to user via preferred channel (e.g., email)
            services.auth.sendOtp({ identifier: validEmail, otp: otpDetails.otp }),

            // 3️⃣ Update the user's OTP reset attempt count
            services.user.updateUser(user.id, { otpResetCount: user.otpResetCount + 1 }),
        ]);

        // ✅ Return success response
        return {
            success: true,
            message: "OTP sent successfully"
        };
    });
};

export const verifyOtp: MutationResolvers["verifyOtp"] = async (_, { input }, { services, tools }) => {
    return tryCatch(async () => {
        // 🔐 Ensure the user is authenticated before verifying the OTP
        const { value: user} = await tools.isAuthenticated();

        // 📨 Extract input values: OTP, identifier (email), and purpose
        const { otp, identifier, purpose } = input;

        // ✅ Verify the OTP with the provided identifier and purpose
        await services.auth.verifyOtp({ identifier, otp, purpose });

        // 🟢 Mark the user as verified in the database
        await services.user.setUserVerified(user.id);

        // ✅ Return success response
        return {
            success: true,
            message: "OTP verified successfully"
        };
    });
};
