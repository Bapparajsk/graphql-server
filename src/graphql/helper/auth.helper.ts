import {customError} from "@graphql/helper/customError.helper";
import {UserResult} from "@graphql/services/result";

import { Context } from "../context";

export async function isAuthenticated  (context: Context): Promise<UserResult>{
    const { services, tools, request } = context;

    // const token = req.cookies?.authToken || "";
    // ! Note: this for only development, in production you should use cookies for authentication
    const token = request.headers.authorization?.replace("Bearer ", "") || "";

    if (!token) {
        throw customError("UNAUTHORIZED");
    }

    const decoded = tools.jsonWebToken.verify(token);
    if (!decoded) {
        throw customError("UNAUTHORIZED");
    }

    const user = await services.user.getUserById(decoded.id);
    if (!user) {
        throw customError("UNAUTHORIZED");
    }
    return user;
}
