import {Resolvers} from "../types";
import { Query } from "./querys";
import { Mutation } from "./mutations";
import {maskEmail} from "../../lib/transformers";


export const resolvers: Resolvers = {
    Query,
    Mutation,
    UserMutation: {
        update: (parent, args, context) => {
            // services.Controller.userController.updateUser(args);
            return "okay"; // Placeholder return value, adjust as needed
        }
    },
    User: { email: (parent, _, __) => maskEmail(parent.email) }

}
