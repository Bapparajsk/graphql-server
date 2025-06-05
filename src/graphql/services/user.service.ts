import * as type from "../types";
import prisma from '../../lib/prisma';

class UserController {

    getUserById(id: number): Promise<type.User | null> {
        return prisma.user.findUnique({
            where: { id }
        });
    }

    // ! only for testing purposes
    getAllUsers(): Promise<type.User[]> {
        return prisma.user.findMany();
    }

    getUsers = ({ id, page, limit }: type.GetInputs & { id: number }): Promise<type.User[]> => {
        const skip = (page - 1) * limit;
        return prisma.user.findMany({
            where: { id: { not: id,  } },
            skip,
            take: limit,
            orderBy: { id: 'asc' },
        });
    }

}

export default UserController;
