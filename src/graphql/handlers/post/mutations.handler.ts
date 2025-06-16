import {MutationResolvers, PostMutationResolvers} from "@/graphql/types";
import {filterValidFields} from "@/lib/filter";
import {tryCatch} from "@/lib/try-catch";


export const createPost: MutationResolvers["createPost"] = async (parent, { input }, { services, tools }) => {
    return tryCatch(async () => {
        const author = await tools.isAuthenticated();
        const isValidInput = tools.zodValidator.isValidCreatePost(input);

        const { transform: post } = await services.post.createPost({ input: isValidInput, authorId: author.id });
        return {...post(), author};
    });
};

export const postMutation: MutationResolvers["post"] = async (parent, { id }, { services, tools }) => {
    return tryCatch(async () => {
        const user = await tools.isAuthenticated();
        const validId = tools.zodValidator.isId(id);

        const { value: post } = await services.post.getPostById({ postId: validId.id });

        return {postId: post.id, post, user};
    });
};

export const updatePost: PostMutationResolvers["updatePost"] = async ({ postId, user }, { input }, { services ,tools }) => {
    return tryCatch(async () => {
        const { value: isMyPost } = await services.post.isMyPost(user.id, postId);
        const data = filterValidFields(tools.zodValidator.isValidUpdatePost(input));

        const { value: updatedPost } = await services.post.updatePost({ input: data, postId: isMyPost.id, });

        return {...updatedPost, author: user};
    });
};

export const deletePost: PostMutationResolvers["deletePost"] = async ({ postId, user }, args, { services }) => {
    return tryCatch(async () => {
        const { value: post } = await services.post.isMyPost(user.id, postId);

        await services.post.deletePost(post.id);
        return true;
    });
};

