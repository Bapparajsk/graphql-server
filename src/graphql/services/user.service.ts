import * as type from "../types";

import prisma, { User } from "@/lib/prisma";

class UserController {

    getUserById(id: number): Promise<User> {
        return prisma.user.findUnique({
            where: { id }
        });
    }

    getUserByEmail(email: string) {
        return prisma.user.findUnique({
            where: { email }
        });
    }

    // ! only for testing purposes
    getAllUsers(): Promise<User[]> {
        return prisma.user.findMany();
    }

    getUsers = ({ id, page, limit }: type.GetInputs & { id: number }): Promise<User[]> => {
        const skip = (page - 1) * limit;
        return prisma.user.findMany({
            where: { id: { not: id,  } },
            skip,
            take: limit,
            orderBy: { id: "asc" },
        });
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
}

export default UserController;
