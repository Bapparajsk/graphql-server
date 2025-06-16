import {customError} from "@graphql/helper";

import * as type from "../types";

import {UserResult, UserResultArray} from "./result";


import prisma, { User } from "@/lib/prisma";


class UserController {

    async getUserById(id: number): Promise<UserResult> {
        const user = await prisma.user.findUnique({
            where: { id }
        });

        if (!user) {
            throw customError("USER_NOT_FOUND");
        }

        return new UserResult(user);
    }

    async getUserByEmail(email: string): Promise<UserResult>  {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            throw customError("USER_NOT_FOUND");
        }

        return new UserResult(user);
    }


    getUsers = async ({ id, page, limit }: type.GetInputs & { id: number }): Promise<UserResultArray> => {
        const skip = (page - 1) * limit;
        const users = await prisma.user.findMany({
            where: { id: { not: id,  } },
            skip,
            take: limit,
            orderBy: { id: "asc" },
        });

        return new UserResultArray(users);
    };

    setUserVerified = (id: number): Promise<User> => {
        return this.updateUser(id, { isVerified: true });
    };

    updateUser = (id: number, data: Partial<User>): Promise<User> => {
        return prisma.user.update({
            where: { id },
            data
        });
    };

    // validators
    isValidOtpResetCount = (otpResetCount: number): boolean => {
        if (otpResetCount >= 5) {
            throw customError({
                code: "OTP_RESET_LIMIT",
                message: "OTP reset count must be between 0 and 5",
                status: 400
            });
        }
        return true;
    };
}

export default UserController;
