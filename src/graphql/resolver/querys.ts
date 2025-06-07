import {post} from "@graphql/handlers/post/queries.handler";

import {postAll, } from "../handlers/post";
import {user} from "../handlers/user";
import {Resolvers} from "../types";

export const Query: Resolvers["Query"] = {
    user,
    postAll,
    post
};
