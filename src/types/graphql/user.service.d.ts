// Importing a base type named GetInputs from the GraphQL types module
import { GetInputs } from "@graphql/types";

/**
 * Extends the base GetInputs type to include an additional `id` field.
 * This is used for fetching a specific user by their numeric ID.
 */
export type GetUserInput = GetInputs & {
    id: number; // Unique identifier for the user to be retrieved
};
