import {Resolvers} from "../types";
import {user} from "../handlers/user";
import {post} from "../handlers/post";

export const Query: Resolvers["Query"] = {
    user,
    post
}
