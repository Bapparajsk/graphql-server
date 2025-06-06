import {updatePost} from "@graphql/handlers/post/mutations.handler";

import { Resolvers } from "../types";

export const PostMutation: Resolvers["PostMutation"] = {
    updatePost
};
