
import {
  createHash,
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";
import type {
  IncomingMessage,
  ServerResponse,
} from "node:http";
import { prisma } from "./db";

const scrypt = promisify(scryptCallback);
const COOKIE_NAME = "autonomy_admin_session";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export async function hashPassword(
  password: string
): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const hash = (await scrypt(password, salt, 64)) as Buffer;

  return `scrypt$${salt}$${hash.toString("hex")}`;
}

export async function verifyPassword(
  password: string,
  stored: string
): Promise<boolean> {
  const [scheme, salt, hash] = stored.split("$");

  if (
    scheme !== "scrypt" ||
    !salt ||
    !hash ||
    !/^[a-f0-9]{128}$/i.test(hash)
  ) {
    return false;
  }

  const expected = Buffer.from(hash, "hex");
  const actual = (await scrypt(
    password,
    salt,
    expected.length
  )) as Buffer;

  return (
    actual.length === expected.length &&
    timingSafeEqual(actual, expected)
  );
}

function readCookie(
  req: IncomingMessage,
  name: string
): string | null {
  const cookieHeader = req.headers.cookie;

  if (!cookieHeader) return null;

  for (const cookie of cookieHeader.split(";")) {
    const separator = cookie.indexOf("=");

    if (separator === -1) continue;

    const key = cookie.slice(0, separator).trim();
    const value = cookie.slice(separator + 1).trim();

    if (key === name) return value || null;
  }

  return null;
}

export async function loginAdmin(
  email: string,
  password: string,
  res: ServerResponse
): Promise<{ id: string; email: string } | null> {
  const normalizedEmail = email.trim().toLowerCase();

  const admin = await prisma.adminUser.findUnique({
    where: { email: normalizedEmail },
  });

  if (
    !admin ||
    !(await verifyPassword(password, admin.passwordHash))
  ) {
    return null;
  }

  const token = randomBytes(32).toString("hex");
  const tokenHash = createHash("sha256")
    .update(token)
    .digest("hex");

  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  await prisma.adminSession.create({
    data: {
      tokenHash,
      adminId: admin.id,
      expiresAt,
    },
  });

  const secure =
    process.env.NODE_ENV === "production" ? "; Secure" : "";

  res.setHeader(
    "Set-Cookie",
    `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${Math.floor(
      SESSION_TTL_MS / 1000
    )}${secure}`
  );

  return { id: admin.id, email: admin.email };
}

export async function getAdminFromRequest(
  req: IncomingMessage
): Promise<{ id: string; email: string } | null> {
  const token = readCookie(req, COOKIE_NAME);

  if (!token) return null;

  const tokenHash = createHash("sha256")
    .update(token)
    .digest("hex");

  const session = await prisma.adminSession.findUnique({
    where: { tokenHash },
    include: { admin: true },
  });

  if (!session) return null;

  if (session.expiresAt.getTime() <= Date.now()) {
    await prisma.adminSession.deleteMany({
      where: { tokenHash },
    });

    return null;
  }

  return {
    id: session.admin.id,
    email: session.admin.email,
  };
}

export async function logoutAdmin(
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  const token = readCookie(req, COOKIE_NAME);

  if (token) {
    const tokenHash = createHash("sha256")
      .update(token)
      .digest("hex");

    await prisma.adminSession.deleteMany({
      where: { tokenHash },
    });
  }

  const secure =
    process.env.NODE_ENV === "production" ? "; Secure" : "";

  res.setHeader(
    "Set-Cookie",
    `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`
  );
}
