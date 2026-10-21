import "dotenv/config";
import { defineConfig } from "prisma/config";

// Prisma CLI (migrations / db push) reads this file.
// Use the *direct* (non-pooled) Neon connection string for migrations.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
  },
});
