
import "dotenv/config";
import http from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { prisma } from "./db";
import {
  createInquiry,
  deleteInquiry,
  ensureDefaults,
  getInquiries,
  getSite,
  putSite,
  setInquiryRead,
} from "./api";
import {
  getAdminFromRequest,
  loginAdmin,
  logoutAdmin,
} from "./auth";
import type { SiteData } from "../src/lib/content";

const PORT = Number(process.env.PORT ?? 3000);

const PUBLIC_URL = (
  process.env.PUBLIC_URL ?? `http://localhost:${PORT}`
).replace(/\/+$/, "");

const ALLOWED_ORIGINS = (
  process.env.ALLOWED_ORIGINS ??
  (process.env.NODE_ENV === "production"
    ? ""
    : "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000")
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const DIST = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../dist"
);

const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".json": "application/json; charset=utf-8",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
};

function json(
  res: http.ServerResponse,
  status: number,
  body: unknown
) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });

  res.end(JSON.stringify(body));
}

async function readBody(
  req: http.IncomingMessage,
  limit = 2_000_000
): Promise<string> {
  const chunks: Buffer[] = [];
  let size = 0;

  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk)
      ? chunk
      : Buffer.from(chunk);

    size += buffer.length;

    if (size > limit) {
      throw new Error("payload too large");
    }

    chunks.push(buffer);
  }

  return Buffer.concat(chunks).toString("utf8");
}

async function serveStatic(
  urlPath: string,
  res: http.ServerResponse
): Promise<void> {
  let decodedPath: string;

  try {
    decodedPath = decodeURIComponent(urlPath);
  } catch {
    json(res, 400, { error: "invalid URL path" });
    return;
  }

  const clean = path
    .normalize(decodedPath)
    .replace(/^([.][.]([/\\]|$))+/, "")
    .replace(/^[/\\]+/, "");

  const filePath = path.resolve(DIST, clean);

  if (
    filePath !== DIST &&
    !filePath.startsWith(DIST + path.sep)
  ) {
    json(res, 403, { error: "forbidden" });
    return;
  }

  try {
    const data = await readFile(filePath);

    res.writeHead(200, {
      "Content-Type":
        MIME[path.extname(filePath)] ??
        "application/octet-stream",
    });

    res.end(data);
  } catch {
    // SPA fallback for routes such as /admin and /insights.
    const data = await readFile(
      path.join(DIST, "index.html")
    );

    res.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-cache",
    });

    res.end(data);
  }
}

async function isAdminAuthenticated(
  req: http.IncomingMessage
): Promise<boolean> {
  const admin = await getAdminFromRequest(req);
  return Boolean(admin);
}

const server = http.createServer(async (req, res) => {
  const host = req.headers.host ?? "localhost";
  const url = new URL(req.url ?? "/", `http://${host}`);
  const origin = req.headers.origin;

  // CORS: credentialed browser requests must use an allowed origin.
  if (origin) {
    if (!ALLOWED_ORIGINS.includes(origin)) {
      json(res, 403, { error: "origin not allowed" });
      return;
    }

    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Vary", "Origin");
  }

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type"
  );

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  try {
    // Health check
    if (
      url.pathname === "/api/health" &&
      req.method === "GET"
    ) {
      let db = false;

      try {
        await prisma.$queryRaw`SELECT 1`;
        db = true;
      } catch {
        db = false;
      }

      json(res, 200, {
        ok: true,
        db,
        ts: Date.now(),
      });

      return;
    }

    // ADMIN LOGIN
    if (
      url.pathname === "/api/admin/login" &&
      req.method === "POST"
    ) {
      const body = JSON.parse(await readBody(req)) as {
        email?: unknown;
        password?: unknown;
      };

      if (
        typeof body.email !== "string" ||
        typeof body.password !== "string" ||
        body.email.length > 254 ||
        body.password.length > 1024
      ) {
        json(res, 400, {
          error: "Please enter a valid email and password.",
        });
        return;
      }

      const admin = await loginAdmin(
        body.email,
        body.password,
        res
      );

      if (!admin) {
        json(res, 401, {
          error: "Invalid email or password.",
        });
        return;
      }

      json(res, 200, {
        authenticated: true,
        email: admin.email,
      });

      return;
    }

    // CHECK ADMIN SESSION
    if (
      url.pathname === "/api/admin/session" &&
      req.method === "GET"
    ) {
      const admin = await getAdminFromRequest(req);

      if (!admin) {
        json(res, 401, { authenticated: false });
        return;
      }

      json(res, 200, {
        authenticated: true,
        email: admin.email,
      });

      return;
    }

    // ADMIN LOGOUT
    if (
      url.pathname === "/api/admin/logout" &&
      req.method === "POST"
    ) {
      await logoutAdmin(req, res);

      json(res, 200, { authenticated: false });
      return;
    }

    // PUBLIC: read website content
    if (
      url.pathname === "/api/site" &&
      req.method === "GET"
    ) {
      json(res, 200, await getSite());
      return;
    }

    // PROTECTED: update website content
    if (
      url.pathname === "/api/site" &&
      req.method === "PUT"
    ) {
      if (!(await isAdminAuthenticated(req))) {
        json(res, 401, { error: "unauthorized" });
        return;
      }

      const data = JSON.parse(
        await readBody(req)
      ) as SiteData;

      const valid =
        data &&
        typeof data === "object" &&
        Array.isArray(data.services) &&
        Array.isArray(data.partners) &&
        Array.isArray(data.stats) &&
        Array.isArray(data.steps) &&
        Array.isArray(data.insights) &&
        Array.isArray(data.testimonials) &&
        data.hero &&
        data.contacts;

      if (!valid) {
        json(res, 400, {
          error: "invalid SiteData payload",
        });
        return;
      }

      await putSite(data);

      json(res, 200, { ok: true });
      return;
    }

    // PROTECTED: list inquiries
    if (
      url.pathname === "/api/inquiries" &&
      req.method === "GET"
    ) {
      if (!(await isAdminAuthenticated(req))) {
        json(res, 401, { error: "unauthorized" });
        return;
      }

      json(res, 200, await getInquiries());
      return;
    }

    // PUBLIC: submit contact inquiry
    if (
      url.pathname === "/api/inquiries" &&
      req.method === "POST"
    ) {
      const data = JSON.parse(
        await readBody(req)
      ) as Record<string, unknown>;

      if (
        !data ||
        typeof data.name !== "string" ||
        typeof data.email !== "string" ||
        typeof data.message !== "string"
      ) {
        json(res, 400, {
          error: "invalid inquiry payload",
        });
        return;
      }

      await createInquiry({
        id:
          typeof data.id === "string"
            ? data.id
            : undefined,
        name: data.name.slice(0, 200),
        email: data.email.slice(0, 200),
        company: String(data.company ?? "").slice(0, 200),
        offering: String(data.offering ?? "").slice(0, 300),
        message: data.message.slice(0, 5000),
      });

      json(res, 201, { ok: true });
      return;
    }

    // PROTECTED: mark or delete a specific inquiry
    const inquiryMatch = url.pathname.match(
      /^\/api\/inquiries\/([A-Za-z0-9_-]+)$/
    );

    if (inquiryMatch) {
      if (!(await isAdminAuthenticated(req))) {
        json(res, 401, { error: "unauthorized" });
        return;
      }

      const id = inquiryMatch[1];

      if (req.method === "PATCH") {
        const body = JSON.parse(
          await readBody(req)
        ) as { read?: boolean };

        if (typeof body?.read !== "boolean") {
          json(res, 400, {
            error: "read must be a boolean",
          });
          return;
        }

        await setInquiryRead(id, body.read);

        json(res, 200, { ok: true });
        return;
      }

      if (req.method === "DELETE") {
        await deleteInquiry(id);

        json(res, 200, { ok: true });
        return;
      }
    }

    if (url.pathname.startsWith("/api/")) {
      json(res, 404, { error: "not found" });
      return;
    }

    if (req.method === "GET" || req.method === "HEAD") {
      await serveStatic(url.pathname, res);
      return;
    }

    json(res, 405, { error: "method not allowed" });
  } catch (error) {
    console.error(
      `[autonomy] ${req.method} ${url.pathname} failed:`,
      error
    );

    if (
      error instanceof Error &&
      error.message === "payload too large"
    ) {
      json(res, 413, { error: "payload too large" });
      return;
    }

    json(res, 500, { error: "internal error" });
  }
});

await ensureDefaults().catch((error) => {
  console.warn(
    "[autonomy] could not verify database on startup:",
    (error as Error).message
  );
});

server.listen(PORT, () => {
  console.log(`[autonomy] listening on port ${PORT}`);
  console.log(`[autonomy] app + API: ${PUBLIC_URL}`);
  console.log(`[autonomy] admin dashboard: ${PUBLIC_URL}/admin`);
  console.log(`[autonomy] insights: ${PUBLIC_URL}/insights`);
});
