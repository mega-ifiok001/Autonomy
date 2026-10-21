import "dotenv/config";
import { prisma } from "./db";
import { putSite } from "./api";
import { DEFAULT_DATA } from "../src/lib/content";

async function run() {
  await putSite(JSON.parse(JSON.stringify(DEFAULT_DATA)));
  console.log("[autonomy] database seeded with default content.");
  await prisma.$disconnect();
}

run().catch(async (err) => {
  console.error("[autonomy] seed failed:", err);
  await prisma.$disconnect();
  process.exit(1);
});
