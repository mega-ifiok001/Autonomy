import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

// Runtime connection: use the *pooled* Neon connection string (port 6543).
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn(
    "[autonomy] DATABASE_URL is not set — API endpoints will 500. " +
      "Copy .env.example to .env and add your Neon connection string."
  );
}

const adapter = new PrismaPg({ connectionString: connectionString ?? "postgresql://unset" });

export const prisma = new PrismaClient({ adapter });
