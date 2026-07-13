import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

declare global {
  var prisma: PrismaClient | undefined;
}

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("Database_URl is not defined");
}

const adapter = new PrismaPg({
  connectionString: databaseUrl,
});

export const prisma =
  global.prisma ??
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "info", "warn", "error"]
        : ["error"],
  });
if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
