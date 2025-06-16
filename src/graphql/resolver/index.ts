import {comments} from "@graphql/handlers/comment";

import {Resolvers} from "../types";

import {Mutation} from "./mutations";
import {PostMutation} from "./postMutation";
import {Query} from "./querys";

import {maskEmail} from "@/lib/transformers";

export const resolvers: Resolvers = {
    Query,
    Mutation,
    PostMutation,
    PostQuery: { comments }
};
