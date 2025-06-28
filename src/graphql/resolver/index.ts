import {comments} from "@graphql/handlers/comment";

import {Resolvers} from "../types";

import {Mutation} from "./mutations";
import {PostMutation} from "./postMutation";
import {Query} from "./querys";

import {filterValidFields} from "@/lib/filter";

export const resolvers: Resolvers = {
    Query,
    Mutation,
    PostMutation,
    PostQuery: { comments },
    UserMutation: {
        update: async ({ id }, { input }, { services, tools }) => {

            const validData = filterValidFields(tools.zodValidator.isValidUserUpdate(input));
            await services.user.updateUser(id, validData);

            return {
                message: "User updated successfully!",
                success: true
            };
        }
    }
};
