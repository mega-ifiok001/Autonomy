# Autonomy — Growth & Strategic Partnerships

Marketing site + admin dashboard for Autonomy. React + Vite + Tailwind v4 on the
front, a Node HTTP API with **Prisma 7** and **Neon (Postgres)** behind it.

## Routes

| Route      | What                                    |
| ---------- | --------------------------------------- |
| `/`        | Landing page (hero, services, models, insights highlights, contact) |
| `/insights`| Insights library (featured piece, categories, resources) |
| `/insights/:id` | Full article view                  |
| `/admin`   | Admin dashboard (all site content is editable) |

Deep links work directly when the app is served by the included server (SPA
fallback). On purely static hosts, navigation still works client-side; the
legacy `#/admin` / `#/insights` hash URLs are also honored.

## Stack

- **Frontend** — React 19, Vite 7, Tailwind CSS v4 (single-file build)
- **API** — `node:http` (no framework) in `server/`
- **ORM** — Prisma 7 (`prisma-client` generator, driver adapter `@prisma/adapter-pg`)
- **Database** — Neon Postgres
- **Fallback** — when the API is unreachable the app runs in *local mode*:
  content hydrates from localStorage and edits persist there, so the static
  build always works standalone.

## Setup

```bash
npm install

# 1. Configure the database
cp .env.example .env        # paste your Neon connection strings

# 2. Generate the Prisma client
npm run prisma:generate

# 3. Create the schema (and seed default content on an empty DB)
npm run db:push             # or: npm run db:migrate
npm run db:seed             # optional — put the default copy into the DB

# 4. Build + run (serves the app AND the API)
npm run build
npm run start:server        # http://localhost:3000
```

- Site: `http://localhost:3000`
- Insights: `http://localhost:3000/insights`
- Admin dashboard: `http://localhost:3000/admin`

## API

| Method | Path                   | Description                                        |
| ------ | ---------------------- | -------------------------------------------------- |
| GET    | `/api/health`          | `{ ok, db, ts }` — db reports whether Prisma can reach Neon |
| GET    | `/api/site`            | Full site content (the `SiteData` shape)           |
| PUT    | `/api/site`            | Replace the whole content set (what the admin saves) |
| GET    | `/api/inquiries`       | Contact-form submissions, newest first             |
| POST   | `/api/inquiries`       | Submit an inquiry (what the contact form posts)    |
| PATCH  | `/api/inquiries/:id`   | `{ "read": true|false }` — mark read / unread      |
| DELETE | `/api/inquiries/:id`   | Remove an inquiry                                  |

The admin console saves the entire `SiteData` payload; the server applies it
in one transaction, enforces invariants (one featured insight, one active
testimonial) and preserves `createdAt`/`updatedAt` on insights and testimonials.

## Project layout

```
prisma/schema.prisma    data model (Hero, Service, Insight, Testimonial, …)
prisma.config.ts        Prisma 7 CLI config (direct connection for migrations)
server/db.ts            PrismaClient + PrismaPg driver adapter (pooled URL)
server/api.ts           SiteData ⇄ database mapping, putSite/ensureDefaults
server/start.ts         HTTP server: /api/* + static dist/ with SPA fallback
server/seed.ts          Seeds the database with the default content
generated/prisma/       generated Prisma client (committed by the generator)
src/lib/content.ts      types + default copy (shared by frontend and server)
src/lib/store.tsx       React store: API hydration → localStorage fallback
src/lib/router.tsx      history router (/, /insights/:id, /admin)
src/pages/AdminDashboard.tsx  dashboard shell + overview
src/pages/admin/        form widgets + per-section editor tabs
src/pages/InsightsPage.tsx    insights library + article + resources
```

## Notes

- The stats band, partner marquee, services, steps, audience, models, about,
  insights and testimonials are all editable from the dashboard.
- “Restore defaults” (sidebar, two-click confirm) resets the database to the
  copy in `src/lib/content.ts`.
- `VITE_API_URL` can point the frontend at a different API origin if the API
  is hosted separately.
