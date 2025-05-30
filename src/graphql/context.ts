import { Request, Response } from "express";
import UserController from '../user';
import Jwt from "../lib/JWT";

export type Context = {
    Controller: {
        userController: UserController;
        jsonWebToken: Jwt;
        express: { res: Response },
        token: string;
    };
};
