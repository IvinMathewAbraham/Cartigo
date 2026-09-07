import { PrismaClient } from "@prisma/client";

BigInt.prototype.toJSON = function () {
  return this.toString();
};

// Initialize Prisma Client
const prisma = new PrismaClient();

export default prisma;
