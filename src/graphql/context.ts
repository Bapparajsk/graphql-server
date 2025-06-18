import {UserResult} from "@graphql/services/result";
import { Request, Response } from "express";

import {UserService, PostService, AuthService, CommentService} from "./services";
import Jwt from "./tools/JWT";
import {ZodValidator} from "./tools/zod";


export type Context = {
    services : {
        user: UserService,
        post: PostService,
        comment: CommentService
        auth: AuthService
    }
    tools: {
        jsonWebToken: Jwt,
        zodValidator: ZodValidator,
        isAuthenticated: () => Promise<UserResult>;
    };
    request: Request;
    response: Response;
};
