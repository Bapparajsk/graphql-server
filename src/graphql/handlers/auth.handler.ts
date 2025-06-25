import {customError} from "@graphql/helper";
import {UserResult} from "@graphql/services/result";

import {MutationResolvers} from "../types";

import {singCookie} from "@/lib/cookies";
import {tryCatch} from "@/lib/try-catch";


export const createUser: MutationResolvers["createUser"] = async (_, { input }, {services, tools, response}) => {
    return tryCatch( async () => {
        // ✅ Validate inputs using Zod schema (e.g. email, password, name)
        const inputData = tools.zodValidator.isRegister(input);

        // 👤 Create the user via the auth service
        const userResult = await services.auth.createUser({ input: inputData });

        // 🧑‍💻 Extract the user from the result
        const user = userResult.transform();

        // 🔏 Generate a JWT token using the user's ID and name
        const token = tools.jsonWebToken.sign({ id: user.id, name: user.name });

        // 🍪 Set the JWT as an HTTP-only cookie (valid for 2 days)
        singCookie(token, response);

        // 🔑 Generate a new OTP for the user (6-digit code)
        const otpDetails = services.auth.generateOtp();

        // ♻️ Reuse shared values
        const purpose = "EMAIL_VERIFICATION";
        const identifier = userResult.email;
        const name = user.name;

        // 📦 Perform multiple operations concurrently:
        await Promise.all([
            services.auth.isValidThrottle({ identifier, purpose }),

            // 1️⃣ Save the OTP and its metadata in Redis
            services.auth.saveOtp({ identifier, purpose, otpDetails }),

            // 2️⃣ Send the OTP to the user's email
            services.auth.sendOtp({ identifier, otp: otpDetails.otp, name, purpose }),

            // 3️⃣ Update the user's OTP reset attempt count (initially set to 1)
            services.user.updateUser(user.id, {otpResetCount: 1 })
        ]);

        // 🎉 Return the token and user info to the client
        return { token, user, message: "User created successfully. Please verify your email with the OTP sent.", success: true };
    });
};

export const signIn: MutationResolvers["signIn"] = async (_, { input }, { services, tools }) => {
    return tryCatch(async () => {
        // 📩 Validate user input (email & password) using Zod schema
        const inputData = tools.zodValidator.isAuth(input);

        // 🔍 Attempt to find the user and verify credentials
        const user = await services.auth.singInUser({ input: inputData });

        if(!services.auth.isValidOtpResetCount(user.otpResetCount)) {
            throw customError("OTP_RESET_LIMIT");
        }

        // 🚫 Block request if user has exceeded the allowed OTP reset attempts
        services.auth.isValidOtpResetCount(user.otpResetCount);

        // 🔑 Generate a new OTP for the user (6-digit code)
        const otpDetails = services.auth.generateOtp();

        // ♻️ Reuse shared values
        const purpose = "LOGIN";
        const identifier = user.email;
        const name = user.name;

        // 📦 Perform multiple operations concurrently:
        await Promise.all([
            services.auth.isValidThrottle({ identifier, purpose }),

            // 1️⃣ Save the OTP and its metadata in Redis
            services.auth.saveOtp({ identifier, purpose, otpDetails }),

            // 2️⃣ Send the OTP to the user's email
            services.auth.sendOtp({ identifier, otp: otpDetails.otp, name, purpose }),

            // 3️⃣ Update the user's OTP reset attempt count (initially set to 1)
            services.user.updateUser(user.id, { otpResetCount: user.otpResetCount + 1 })
        ]);

        // 🎉 Return the token and user info to the client
        return { success: true, message: "Sign-in successful. Please verify your email with the OTP sent.", };
    });
};

export const sendOtp: MutationResolvers["sendOtp"] = async (_, { input }, { services, tools }) => {
    return tryCatch(async () => {
        const { identifier, purpose } = input;

        // ✅ Validate the email format and normalize it
        const validEmail = tools.zodValidator.isEmail(identifier);
        const validPurpose = tools.zodValidator.isValidPurpose(purpose);

        let userResult: UserResult | null;
        // 🔐 Ensure the user is authenticated if the OTP is not for login (e.g., for account changes)
        if (validPurpose !== "LOGIN") {
            userResult = await tools.isAuthenticated();

            if (userResult.value.email !== validEmail) {
                throw customError({
                    code: "UNAUTHORIZED",
                    message: "You are not authorized to perform this action with the provided email.",
                    status: 403
                });
            }

        } else {
            // LOGIN: Fetch user from DB
            userResult = await services.user.getUserByEmail(validEmail);
        }

        // 🧑‍💻 Extract the user from the result
        const user = userResult.value;

        // ⏱️ Throttle OTP resends to prevent spamming (1-minute cooldown)
        await services.auth.isValidThrottle({ identifier: validEmail, purpose: validPurpose });

        // 🚫 Block request if user has exceeded the allowed OTP reset attempts
        services.user.isValidOtpResetCount(user.otpResetCount);

        // 🔢 Generate a new 6-digit OTP and metadata (expiry and throttle limit)
        const otpDetails = services.auth.generateOtp();

        // 📦 Perform OTP-related operations concurrently:
        await Promise.all([
            // 1️⃣ Save OTP and expiration info in Redis
            services.auth.saveOtp({ identifier: validEmail, purpose: validPurpose, otpDetails }),

            // 2️⃣ Send OTP to user via preferred channel (e.g., email)
            services.auth.sendOtp({ identifier: validEmail, otp: otpDetails.otp, name: user.name }),

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

export const verifyOtp: MutationResolvers["verifyOtp"] = async (_, { input }, { services, tools, response }) => {
    return tryCatch(async () => {
        // 📨 Extract input values: OTP, identifier (email), and purpose
        const {otp, identifier, purpose} = tools.zodValidator.isValidOtp(input);

        let userResult: UserResult | null;
        // 🔐 Ensure the user is authenticated if the OTP is not for login (e.g., for account changes)
        if (purpose !== "LOGIN") {
            userResult = await tools.isAuthenticated();

            if (userResult.value.email !== identifier) {
                throw customError({
                    code: "UNAUTHORIZED",
                    message: "You are not authorized to perform this action with the provided email.",
                    status: 403
                });
            }

        } else {
            // LOGIN: Fetch user from DB
            userResult = await services.user.getUserByEmail(identifier);
        }

        // 🧑‍💻 Extract the user from the result
        const user = userResult.transform();

        // ✅ Verify the OTP with the provided identifier and purpose
        await services.auth.verifyOtp({ identifier, otp, purpose });

        if(purpose === "EMAIL_VERIFICATION" && !user.isVerified) {
            // 🟢 Mark the user as verified in the database
            await services.user.setUserVerified(user.id);
        }

        let token: string | undefined = undefined;

        if(purpose === "LOGIN") {
            // 🔑 Generate a JWT token for the user if the purpose is LOGIN
            token = tools.jsonWebToken.sign({ id: user.id, name: user.name });

            // 🍪 Set the JWT as an HTTP-only cookie (valid for 2 days)
            singCookie(token, response);
        }

        // ✅ Return success response
        return {
            success: true,
            message: "OTP verified successfully",
            user: purpose === "LOGIN" ? user : undefined,
            token: token
        };
    });
};
