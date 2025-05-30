import { Context } from "../context";

export const isAuthenticated = async (context: Context) => {
    const { Controller } = context;

    const decoded = Controller.jsonWebToken.verify(Controller.token);
    if (!decoded) {
        throw new Error("UNAUTHORIZED");
    }

    const user = await Controller.userController.getUserById(decoded.id)
    if (!user) {
        throw new Error("UNAUTHORIZED");
    }

    return user;
}
