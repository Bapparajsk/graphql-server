import {MutationResolvers} from "@graphql/types";

import {tryCatch} from "@/lib/try-catch";

export const meMutation: MutationResolvers["me"] = async (_parent, _args, { tools }) => {
    return tryCatch(async () => {
        const userResult = await tools.isAuthenticated();
        const me = userResult.transform();
        return { me, id: me.id };
    });
};
