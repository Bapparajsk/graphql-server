import {Resolvers} from "../types";
import {Query} from "./querys";
import {Mutation} from "./mutations";
import {PostMutation} from "./postMutation";
import {maskEmail} from "../../lib/transformers";


export const resolvers: Resolvers = {
    Query,
    Mutation,
    PostMutation,
    User: { email: (parent, _, __) => maskEmail(parent.email) },
}
