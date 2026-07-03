import "dotenv/config";
import { defineConfig } from "prisma/config";
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("Database_URl is not defined");
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: databaseUrl,
  },
});
