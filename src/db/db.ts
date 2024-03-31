import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
    return new PrismaClient();
};

declare global {
    var dbGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const db = globalThis.dbGlobal ?? prismaClientSingleton();

export default db;

if (process.env.NODE_ENV !== "production") globalThis.dbGlobal = db;
