import {QueryResolvers} from "@graphql/types";

import {tryCatch} from "@/lib/try-catch";

// Resolver function for the 'user' query
export const user: QueryResolvers["user"] = async (parent, { input }, { services, tools }) => {
    return tryCatch(async () => {
        // Ensure the user is authenticated and get the current user object
        const user = await tools.isAuthenticated();

        // Validate and extract 'limit' and 'page' values from input using Zod schema
        const { limit, page } = tools.zodValidator.isGetInputs(input);

        // Fetch paginated users based on the current user's ID
        const userResultArray = await services.user.getUsers({
            limit,
            page,
            id: user.id,
        });

        // Transform raw user data into client-safe structure (e.g., remove sensitive info)
        const users = userResultArray.transform();

        // Determine if there’s a next page based on the number of returned users
        const hasNextPage = users.length === input.limit;

        // Return the transformed users and pagination info
        return { users, hashNext: hasNextPage };
    });
};

