import {Resolvers} from "../types";
import { Query } from "./querys";
import { Mutation } from "./mutations";


export const resolvers: Resolvers = {
    Query,
    Mutation,
    UserMutation: {
        update: (parent, args, context) => {
            console.log("UserMutation.update called with args:", args);
            console.log("UserMutation.update context:", context.Controller.jsonWebToken);
            // context.Controller.userController.updateUser(args);
            return "okay"; // Placeholder return value, adjust as needed
        }
    }
}
