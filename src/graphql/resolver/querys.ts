import {Resolvers} from "../types";
import {user} from "../handlers/user.handlers";
import {post} from "../handlers/post.handlers";

export const Query: Resolvers["Query"] = {
    user,
    post
}
