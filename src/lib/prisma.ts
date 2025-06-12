import {PrismaClient, User, Post, Comment} from "../../generated/prisma";

const prisma = new PrismaClient();

export {
    User,
    Post,
    Comment
};

export default prisma;
