import {customErrors, ErrorTypes} from "@graphql/helper/customError.helper";

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export const tryCatch = async (fn: Function, eList: ErrorTypes[] = []) => {
    try {
        return await fn();
    } catch (error) {
        console.log(error);
        throw customErrors(error, eList);
    }
};
