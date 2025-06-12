import { readFileSync, readdirSync } from "fs";
import path from "path";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { Router } from "express";
import { gql } from "graphql-tag";

import {Context} from "./context";
import {isAuthenticated} from "./helper";
import {resolvers} from "./resolver";
import {PostService, AuthService, UserService, CommentService} from "./services";
import Jwt from "./tools/JWT";
import {ZodValidator} from "./tools/zod";

import {rateLimiter} from "@/middleware";


const router = Router();

router.use(rateLimiter);

const schemaDir = path.resolve(__dirname, "./schemas");
const typeDefs = gql(`
    ${readdirSync(schemaDir)
    .filter(file => file.endsWith(".graphql"))
    .map(file => readFileSync(path.join(schemaDir, file), "utf-8"))
    .join("\n")}
`);

async function startApolloServer() {
    const server = new ApolloServer({ typeDefs, resolvers });
    await server.start();

    router.use("/" ,expressMiddleware(server, {

        context: async ({ req, res }) => {
            const ctx = {
                services: {
                    auth: new AuthService(),
                    user: new UserService(),
                    post: new PostService(),
                    comment: new CommentService()
                },
                tools: {
                    jsonWebToken: new Jwt(),
                    zodValidator: new ZodValidator(),
                    isAuthenticated: () => isAuthenticated(ctx as Context), // ✅ closure
                } ,
                request: req,
                response: res,
            } as Partial<Context>;

            return ctx as Context;
        },
    }));
}

startApolloServer().then(() => {
    console.log("Apollo Server is running and ready to accept requests.");
    console.log("GraphQL endpoint is available at /graphql");
}).catch((e) => {
    console.error("Error starting Apollo Server:", e);
});

export default router;
