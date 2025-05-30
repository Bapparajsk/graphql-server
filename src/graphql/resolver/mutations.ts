import { Resolvers } from "../types";
import {createUser, signIn} from "../../controller/auth.controller";

export const Mutation: Resolvers["Mutation"] = {
    createUser, signIn,
    user: (parent, args, context) => {
        console.log("UserMutation called with args:", args);
        console.log("UserMutation context:", parent);
        // context.Controller.userController.updateUser(args);
        return {id: args.id };
    }
}
