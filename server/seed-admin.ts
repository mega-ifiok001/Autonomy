
import "dotenv/config";
import { prisma } from "./db";
import { hashPassword } from "./auth";

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "Missing ADMIN_EMAIL or ADMIN_PASSWORD environment variable."
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Please provide a valid admin email address.");
  }

  if (password.length < 12) {
    throw new Error(
      "Your admin password must contain at least 12 characters."
    );
  }

  const passwordHash = await hashPassword(password);

  // Reuse the existing admin account if one exists.
  const existingAdmin = await prisma.adminUser.findFirst({
    orderBy: { createdAt: "asc" },
  });

  if (existingAdmin) {
    await prisma.adminUser.update({
      where: { id: existingAdmin.id },
      data: {
        email,
        passwordHash,
      },
    });

    await prisma.adminSession.deleteMany({
      where: { adminId: existingAdmin.id },
    });

    console.log(`Updated admin account: ${email}`);
    console.log("Existing admin sessions have been revoked.");
  } else {
    await prisma.adminUser.create({
      data: {
        email,
        passwordHash,
      },
    });

    console.log(`Created admin account: ${email}`);
  }
}

main()
  .catch((error) => {
    console.error("Failed to configure admin credentials:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
