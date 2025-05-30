import { Resolvers } from "../types";
import {users} from "../../controller/user.controller";

export const Query: Resolvers["Query"] = {
    users
}
