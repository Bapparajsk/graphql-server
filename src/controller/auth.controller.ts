import {MutationResolvers} from "../graphql/types";
import {GraphQLError} from "graphql/error";
import {authSchema, registerSchema, z} from "../lib/zod";
import {singCookie} from "../lib/cookies";
import customError from "../graphql/helper/customError.helper";

export const createUser: MutationResolvers["createUser"] = async (_, inputs, {Controller}) => {
    try {
        // Validate inputs using Zod schema
        const input = registerSchema.parse(inputs);

        // Create user using the userController
        const newUser = await Controller.userController.createUser({ input });

        const token = Controller.jsonWebToken.sign({ id: newUser.id, email: newUser.email });
        // Set the token in the response cookie
        singCookie(token, Controller.express.res); // 2 days
        return newUser;
    } catch (e) {
        if(e instanceof z.ZodError) {
            const error = e.issues.map(issue => issue.message).join(", ");
            console.log(error)
            throw new GraphQLError(`Validation error: ${error}`, {
                extensions: {
                    code: 'BAD_USER_INPUT',
                    details: error,
                    http: {
                        status: 400 // Bad Request
                    }
                }
            });
        }

        console.log("Error in createUser:", e);
        throw new GraphQLError(`Error creating user: ${e instanceof Error ? e.message : "Unknown error"}`, {
            extensions: {
                code: 'INTERNAL_SERVER_ERROR',
                details: e instanceof Error ? e.message : "Unknown error",
                http: {
                    status: 500 // Internal Server Error
                },
            }
        });
    }
}

export const signIn: MutationResolvers["signIn"] = async (_: {}, inputs, {Controller}) => {
    try {
        // * Validate inputs using Zod schema
        const input = authSchema.parse(inputs);

        // * Sign in user using the userController
        const user = await Controller.userController.singInUser({input});
        const token = Controller.jsonWebToken.sign({ id: user.id, email: user.email });

        // * Set the token in the response cookie
        singCookie(token, Controller.express.res);

        // * Return the user data
        return {
            token,
            user
        };
    } catch (e) {
        console.log("Error in singing:", e);
        if(e instanceof z.ZodError) {
            const error = e.issues.map(issue => issue.message).join(", ");
            console.log(error)

            // Handle validation errors
            throw customError("BAD_USER_INPUT");
        }

        throw customError("INTERNAL_SERVER_ERROR");
    }
}
