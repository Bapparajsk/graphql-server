import {updatePost, deletePost, addComment} from "@graphql/handlers/post";

import { Resolvers } from "../types";

export const PostMutation: Resolvers["PostMutation"] = {
    updatePost,
    deletePost,
    addComment
};
