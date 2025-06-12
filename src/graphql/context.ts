import { Request, Response } from "express";

import {UserService, PostService, AuthService, CommentService} from "./services";
import Jwt from "./tools/JWT";
import {ZodValidator} from "./tools/zod";

import {User} from "@/lib/prisma";

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
        isAuthenticated: () => Promise<User>;
    };
    request: Request;
    response: Response;
};
