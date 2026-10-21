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
import type { SiteData } from "../src/lib/content";

const PORT = Number(process.env.PORT ?? 3000);
const DIST = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../dist");

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

function json(res: http.ServerResponse, status: number, body: unknown) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(payload);
}

async function readBody(req: http.IncomingMessage, limit = 2_000_000): Promise<string> {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req) {
    size += (chunk as Buffer).length;
    if (size > limit) throw new Error("payload too large");
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks).toString("utf8");
}

async function serveStatic(urlPath: string, res: http.ServerResponse): Promise<void> {
  const clean = path.normalize(decodeURIComponent(urlPath)).replace(/^([.][.][/\\])+/, "");
  let filePath = path.join(DIST, clean);
  if (!filePath.startsWith(DIST)) filePath = path.join(DIST, "index.html");
  try {
    const data = await readFile(filePath);
    res.writeHead(200, { "Content-Type": MIME[path.extname(filePath)] ?? "application/octet-stream" });
    res.end(data);
  } catch {
    // SPA fallback — unknown paths serve the app shell (covers /admin, /insights)
    const data = await readFile(path.join(DIST, "index.html"));
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(data);
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  try {
    if (url.pathname === "/api/health") {
      let db = false;
      try {
        await prisma.$queryRaw`SELECT 1`;
        db = true;
      } catch {
        db = false;
      }
      json(res, 200, { ok: true, db, ts: Date.now() });
      return;
    }

    if (url.pathname === "/api/site" && req.method === "GET") {
      json(res, 200, await getSite());
      return;
    }

    if (url.pathname === "/api/site" && req.method === "PUT") {
      const raw = await readBody(req);
      const data = JSON.parse(raw) as SiteData;
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
        json(res, 400, { error: "invalid SiteData payload" });
        return;
      }
      await putSite(data);
      json(res, 200, { ok: true });
      return;
    }

    if (url.pathname === "/api/inquiries" && req.method === "GET") {
      json(res, 200, await getInquiries());
      return;
    }

    if (url.pathname === "/api/inquiries" && req.method === "POST") {
      const raw = await readBody(req);
      const d = JSON.parse(raw) as Record<string, unknown>;
      if (
        !d ||
        typeof d.name !== "string" ||
        typeof d.email !== "string" ||
        typeof d.message !== "string"
      ) {
        json(res, 400, { error: "invalid inquiry payload" });
        return;
      }
      await createInquiry({
        id: typeof d.id === "string" ? d.id : undefined,
        name: d.name.slice(0, 200),
        email: d.email.slice(0, 200),
        company: String(d.company ?? "").slice(0, 200),
        offering: String(d.offering ?? "").slice(0, 300),
        message: d.message.slice(0, 5000),
      });
      json(res, 201, { ok: true });
      return;
    }

    const inquiryMatch = url.pathname.match(/^\/api\/inquiries\/([A-Za-z0-9_-]+)$/);
    if (inquiryMatch) {
      const id = inquiryMatch[1];
      if (req.method === "PATCH") {
        const b = JSON.parse(await readBody(req)) as { read?: boolean };
        if (typeof b?.read === "boolean") await setInquiryRead(id, b.read);
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
  } catch (err) {
    console.error(`[autonomy] ${req.method} ${url.pathname} failed:`, err);
    json(res, 500, { error: "internal error" });
  }
});

await ensureDefaults().catch((err) => {
  console.warn("[autonomy] could not verify database on startup:", (err as Error).message);
});

server.listen(PORT, () => {
  console.log(`[autonomy] app + API on http://localhost:${PORT}`);
  console.log(`[autonomy] admin dashboard:    http://localhost:${PORT}/admin`);
  console.log(`[autonomy] insights:           http://localhost:${PORT}/insights`);
});
