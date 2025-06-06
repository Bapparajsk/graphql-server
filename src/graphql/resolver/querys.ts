import {postAll} from "../handlers/post";
import {user} from "../handlers/user";
import {Resolvers} from "../types";

export const Query: Resolvers["Query"] = {
    user,
    postAll,
};
