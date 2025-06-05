import { PrismaClientKnownRequestError } from "../../../generated/prisma/runtime/library";
import {customErrors, customError} from "../helper";
import {MutationResolvers} from "../types";

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
