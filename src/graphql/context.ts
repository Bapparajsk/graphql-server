import { Request, Response } from "express";
import {UserService, PostService, AuthService} from './services';
import Jwt from "./tools/JWT";
import {ZodValidator} from "./tools/zod";
import {User} from "./types";

export type Context = {
    services : {
        user: UserService,
        post: PostService,
        auth: AuthService
    }
    tools: {
        jsonWebToken: Jwt,
        zodValidator: ZodValidator,
        isAuthenticated: () => Promise<User>;
    };
    request: Request;
    response: Response;
};
