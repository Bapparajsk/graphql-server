import crypto from "node:crypto";
import * as type from "../types";
import prisma from '../../lib/prisma';
import {MutationSignInArgs} from "../types";

interface HashPassword {
    salt: string;
    hash: string;
}

class UserController {

    private readonly pbkdf2SyncConfig = { iterations: 1000, keylen: 64, digest: "sha512" };

    getUserById(id: number): Promise<type.User | null> {
        return prisma.user.findUnique({
            where: { id }
        });
    }

    #hashPassword(password: string): HashPassword {
        const salt = crypto.randomBytes(16).toString('hex'); // generate random salt
        const hash = crypto
            .pbkdf2Sync(password, salt, this.pbkdf2SyncConfig.iterations, this.pbkdf2SyncConfig.keylen, this.pbkdf2SyncConfig.digest)
            .toString('hex');
        return { salt, hash };
    }

    #verifyPassword(password: string, salt: string, hash: string): boolean {
        const hashToVerify = crypto
            .pbkdf2Sync(password, salt, this.pbkdf2SyncConfig.iterations, this.pbkdf2SyncConfig.keylen, this.pbkdf2SyncConfig.digest)
            .toString('hex');
        return hashToVerify === hash;
    }

    createUser({ input }: type.MutationCreateUserArgs) {
        const { salt, hash } = this.#hashPassword(input.password);
        return prisma.user.create({
            data: {
                email: input.email,
                name: input.name,
                password: hash, // Store the hashed password
                salt // Store the salt for future password verification
            }
        });
    }

    async singInUser({ input }: Partial<MutationSignInArgs>) {
        const data = await prisma.user.findUnique({
            where: {  email: input.email },
            // select: { salt: true, password: true }
        });

        if (!data) {
            throw new Error("Invalid email or password");
        }

        // Verify the password
        const isPasswordValid = this.#verifyPassword(input.password, data.salt, data.password);
        if (!isPasswordValid) {
            throw new Error("Invalid email or password");
        }
        // If the password is valid, return the services data
        return {
            id: data.id,
            email: data.email,
            name: data.name
        };
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
