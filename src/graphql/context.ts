import { Request, Response } from "express";
import {UserContext, PostService} from './services';
import Jwt from "./tools/JWT";
import {ZodValidator} from "./tools/zod";

export type Context = {
    services : {
        user: UserContext,
        post: PostService
    }
    tools: {
        jsonWebToken: Jwt,
        zodValidator: ZodValidator
    };
    request: Request;
    response: Response;
};
