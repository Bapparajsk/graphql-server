// Import custom error helper for consistent error handling
import { customError } from "@graphql/helper";

// Import result wrappers for single and multiple user responses
import { UserResult, UserResultArray } from "./result";

import prisma, { User } from "@/lib/prisma"; // Import Prisma instance and User type
import { GetUserInput } from "@/types/graphql/user.service"; // Import input type for user queries


/**
 * Controller class responsible for user-related operations.
 */
class UserController {

    /**
     * Fetch a single user by their numeric ID.
     * Throws a custom error if user is not found.
     */
    async getUserById(id: number): Promise<UserResult> {
        const user = await prisma.user.findUnique({
            where: { id },
        });

        if (!user) {
            throw customError("USER_NOT_FOUND");
        }

        return new UserResult(user);
    }

    /**
     * Fetch a single user by their email address.
     * Throws a custom error if user is not found.
     */
    async getUserByEmail(email: string): Promise<UserResult> {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw customError("USER_NOT_FOUND");
        }

        return new UserResult(user);
    }

    /**
     * Fetch a paginated list of users excluding a specific user ID.
     * Supports basic pagination using `page` and `limit`.
     */
    getUsers = async ({ id, page, limit }: GetUserInput): Promise<UserResultArray> => {
        const skip = (page - 1) * limit;

        const users = await prisma.user.findMany({
            // where: { id: { not: id } }, // exclude current user
            skip,
            take: limit,
            orderBy: { id: "asc" },
        });

        return new UserResultArray(users);
    };

    /**
     * Mark a user as verified by updating `isVerified` to true.
     */
    setUserVerified = (id: number): Promise<User> => {
        return this.updateUser(id, { isVerified: true });
    };

    /**
     * Update any user fields using a partial user object.
     */
    updateUser = (id: number, data: Partial<User>): Promise<User> => {
        return prisma.user.update({
            where: { id },
            data,
        });
    };

    /**
     * Validate if OTP reset count is within allowed limits.
     * Throws an error if reset count exceeds 4 (max 5 allowed per day).
     */
    isValidOtpResetCount = (otpResetCount: number): boolean => {
        if (otpResetCount >= 5) {
            throw customError({
                code: "OTP_RESET_LIMIT",
                message: "OTP reset count must be between 0 and 5",
                status: 400,
            });
        }
        return true;
    };
}

export default UserController;
