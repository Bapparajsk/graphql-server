import { postMutation, createPost, updatePost, deletePost } from "./mutations.handler";
import { postList, postQuery } from "./queries.handler";

export {
    // Queries
    postList, postQuery,
    // Mutations
    postMutation, createPost,
    updatePost, deletePost,
};
