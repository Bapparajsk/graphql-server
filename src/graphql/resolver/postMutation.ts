import {addComment, updateComment, deleteComment} from "@graphql/handlers/comment";
import {updatePost, deletePost} from "@graphql/handlers/post";

import { Resolvers } from "../types";

export const PostMutation: Resolvers["PostMutation"] = {
    updatePost,
    deletePost,
    addComment,
    updateComment,
    deleteComment
};
