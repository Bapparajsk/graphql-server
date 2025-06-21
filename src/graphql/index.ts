import { readFileSync, readdirSync } from "fs";
import path from "path";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { Router } from "express";
import { gql } from "graphql-tag";

import { Context } from "./context";
import { isAuthenticated } from "./helper";
import { resolvers } from "./resolver";
import { AuthService, UserService, PostService, CommentService } from "./services";
import Jwt from "./tools/JWT";
import { ZodValidator } from "./tools/zod";

import { rateLimiter } from "@/middleware";

// Create Express router
const router = Router();

// Apply rate limiter middleware
router.use(rateLimiter);

/**
 * Load all `.graphql` schema files from the `./schemas` directory
 * and combine them into a single `typeDefs` document using gql tag.
 */
const schemaDir = path.resolve(__dirname, "./schemas");
const typeDefs = gql(`
    ${readdirSync(schemaDir)
    .filter(file => file.endsWith(".graphql"))
    .map(file => readFileSync(path.join(schemaDir, file), "utf-8"))
    .join("\n")}
`);

/**
 * Initialize and start Apollo GraphQL server
 * and attach it to the Express router.
 */
async function startApolloServer() {
    const server = new ApolloServer({ typeDefs, resolvers });
    await server.start();

    // Attach Apollo middleware to root path
    router.use("/", expressMiddleware(server, {
        context: async ({ req, res }): Promise<Context> => {
            const ctx: Context = {
                services: {
                    auth: new AuthService(),
                    user: new UserService(),
                    post: new PostService(),
                    comment: new CommentService(),
                },
                tools: {
                    jsonWebToken: new Jwt(),
                    zodValidator: new ZodValidator(),
                    isAuthenticated: () => isAuthenticated(ctx),
                },
                request: req,
                response: res,
            };

            return ctx;
        }
    }));
}

// Start the server and log results
startApolloServer()
    .then(() => {
        console.log("✅ Apollo Server is running.");
        console.log("🚀 GraphQL endpoint: /graphql");
    })
    .catch((e) => {
        console.error("❌ Failed to start Apollo Server:", e);
    });

export default router;
