import { Context } from "../context";
import {User} from "../types";
import { customError } from "../helper/customError.helper";

export const isAuthenticated = async (context: Context): Promise<User> => {
    const { services, tools, request } = context;

    // const token = req.cookies?.authToken || "";
    // ! Note: this for only development, in production you should use cookies for authentication
    const token = request.headers.authorization?.replace("Bearer ", "") || "";

    if (!token) {
        throw new Error("UNAUTHORIZED");
    }

    const decoded = tools.jsonWebToken.verify(token);
    if (!decoded) {
        throw new Error("UNAUTHORIZED");
    }

    const user = await services.user.getUserById(decoded.id);
    if (!user) {
        throw new Error("UNAUTHORIZED");
    }

    return user;
}
