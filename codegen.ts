import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
    schema: "src/graphql/schemas/**/*.graphql",
    generates: {
        "./src/graphql/types.ts": {
            plugins: ["typescript", "typescript-resolvers"],
            config: {
                contextType: "./context#Context",
            },
        },
    },
};

export default config;
