import { type ReactNode, useEffect, useState } from "react";
import { cn } from "../utils/cn";
import { API_BASE, useSite } from "../lib/store";
import { RouteLink } from "../lib/router";
import { LogoMark, MailIcon } from "../components/Icons";
import {
  TabAbout,
  TabAudience,
  TabContacts,
  TabHero,
  TabInsights,
  TabPartners,
  TabProcess,
  TabServices,
  TabTestimonials,
} from "./admin/tabs";

type SectionKey =
  | "overview"
  | "hero"
  | "contacts"
  | "inquiries"
  | "services"
  | "partners"
  | "about"
  | "process"
  | "audience"
  | "insights"
  | "testimonials";

const SECTIONS: { key: SectionKey; label: string; icon: ReactNode }[] = [
  {
    key: "overview",
    label: "Overview",
    icon: (
      <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" />
    ),
  },
  {
    key: "hero",
    label: "Hero",
    icon: <path d="M4 5h16M4 12h10M4 19h16" />,
  },
  {
    key: "contacts",
    label: "Contacts",
    icon: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m4 7 8 6 8-6" />
      </>
    ),
  },
  {
    key: "inquiries",
    label: "Inquiries",
    icon: (
      <path d="M4 13h4.5l1.5 2.5h4L15.5 13H20M4 13V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v5M4 13v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
    ),
  },
  {
    key: "services",
    label: "Core Services",
    icon: <path d="M12 3 3 8l9 5 9-5-9-5ZM3 13l9 5 9-5" />,
  },
  {
    key: "partners",
    label: "Partners & Numbers",
    icon: (
      <>
        <circle cx="7" cy="8" r="3" />
        <circle cx="17" cy="8" r="3" />
        <path d="M3 19c0-2.8 1.8-5 4-5s4 2.2 4 5M13 19c0-2.8 1.8-5 4-5s4 2.2 4 5" />
      </>
    ),
  },
  {
    key: "about",
    label: "About",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v5M12 8h.01" />
      </>
    ),
  },
  {
    key: "process",
    label: "How It Works",
    icon: <path d="M4 6h16M4 12h10M4 18h16M20 12l-3-3m3 3-3 3" />,
  },
  {
    key: "audience",
    label: "Audience & Models",
    icon: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <circle cx="12" cy="12" r="3" />
        <path d="M12 3.5v3M12 17.5v3M3.5 12h3M17.5 12h3" />
      </>
    ),
  },
  {
    key: "insights",
    label: "Insights",
    icon: (
      <>
        <path d="M9 18h6M10 21h4" />
        <path d="M12 3a6.5 6.5 0 0 0-3.7 11.9c.8.6 1.2 1.4 1.2 2.1h5c0-.7.4-1.5 1.2-2.1A6.5 6.5 0 0 0 12 3Z" />
      </>
    ),
  },
  {
    key: "testimonials",
    label: "Testimonials",
    icon: (
      <path d="M5 16c-1.2 0-2-.9-2-2.2C3 10 5.5 6.8 9 6v3.2c-1.4.6-2.4 1.7-2.6 3H9V16H5Zm10 0c-1.2 0-2-.9-2-2.2 0-3.8 2.5-7 6-7.8v3.2c-1.4.6-2.4 1.7-2.6 3H19V16h-4Z" />
    ),
  },
];

function SIcon({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

/* --------------------------------- overview -------------------------------- */

type Health = { ok: boolean; db: boolean; ms: number | null } | null;

function CheckRow({ ok, label, go, section }: { ok: boolean; label: string; go: (s: SectionKey) => void; section: SectionKey }) {
  return (
    <div className="flex items-center justify-between gap-3 py-3">
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-full text-[12px] font-bold",
            ok ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
          )}
        >
          {ok ? "✓" : "!"}
        </span>
        <span className={cn("text-[13.5px] font-medium", ok ? "text-slate-600" : "text-amber-700")}>{label}</span>
      </div>
      {!ok && (
        <button type="button" onClick={() => go(section)} className="text-[12.5px] font-bold text-brand-600 hover:text-brand-700">
          Fix →
        </button>
      )}
    </div>
  );
}

function Overview({ go }: { go: (s: SectionKey) => void }) {
  const { data, source, lastSaved, inquiries } = useSite();
  const [health, setHealth] = useState<Health>(null);
  const [checking, setChecking] = useState(false);
  const unreadInq = inquiries.filter((i) => !i.read).length;

  const check = async () => {
    setChecking(true);
    const t0 = performance.now();
    try {
      const r = await fetch(`${API_BASE}/api/health`, { cache: "no-store" });
      const j = (await r.json()) as { ok?: boolean; db?: boolean };
      setHealth({ ok: !!r.ok && !!j.ok, db: !!j.db, ms: Math.round(performance.now() - t0) });
    } catch {
      setHealth({ ok: false, db: false, ms: null });
    }
    setChecking(false);
  };

  useEffect(() => {
    void check();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const featured = data.insights.some((i) => i.featured);
  const highlighted = data.insights.filter((i) => i.highlight).length;

  const tiles = [
    { label: "Inquiries", value: inquiries.length, sub: unreadInq > 0 ? `${unreadInq} unread` : "all caught up", alert: unreadInq > 0 },
    { label: "Insights", value: data.insights.length, sub: `${data.insights.filter((i) => i.featured).length} featured · ${highlighted} highlighted` },
    { label: "Partners", value: data.partners.length, sub: "in the marquee" },
    { label: "Core services", value: data.services.length, sub: "disciplines live" },
    { label: "Testimonials", value: data.testimonials.length, sub: `${data.testimonials.filter((t) => t.active).length} active` },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-[22px] font-extrabold text-ink">Overview</h2>
        <p className="mt-1.5 text-[13.5px] leading-relaxed text-slate-500">
          The state of the site — where content is stored, what's live, and what to touch next.
        </p>
      </div>

      {/* tiles */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        {tiles.map((t) => (
          <button
            key={t.label}
            type="button"
            onClick={() => t.alert && go("inquiries")}
            className={cn(
              "rounded-xl border p-5 text-left transition-all duration-300",
              t.alert
                ? "border-brand-300 bg-brand-50/60 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-24px_rgba(47,102,242,0.6)]"
                : "border-cloud bg-mist/50"
            )}
          >
            <p className={cn("font-display text-[30px] font-extrabold", t.alert ? "text-brand-700" : "text-ink")}>{t.value}</p>
            <p className="mt-1 text-[12px] font-bold tracking-[0.14em] text-slate-500 uppercase">{t.label}</p>
            <p className={cn("mt-1 text-[12px]", t.alert ? "font-semibold text-brand-600" : "text-slate-400")}>
              {t.sub}
            </p>
          </button>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {/* connection */}
        <div className="rounded-xl border border-cloud bg-white p-5">
          <p className="text-[11.5px] font-bold tracking-[0.1em] text-slate-500 uppercase">Data source</p>
          <div className="mt-4 flex items-center gap-3">
            <span
              className={cn(
                "h-2.5 w-2.5 rounded-full",
                source === "db" ? "bg-emerald-500" : source === "local" ? "bg-amber-400" : "animate-pulse bg-slate-300"
              )}
            />
            <div>
              <p className="text-[14.5px] font-bold text-ink">
                {source === "db" ? "Neon (Postgres) via Prisma API" : source === "local" ? "Local browser storage" : "Connecting…"}
              </p>
              <p className="text-[12.5px] text-slate-400">
                {source === "db"
                  ? lastSaved
                    ? `Last saved ${new Date(lastSaved).toLocaleTimeString()}`
                    : "Hydrated from the database"
                  : "API offline — edits persist to this browser only"}
              </p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-cloud pt-4">
            <button
              type="button"
              onClick={() => void check()}
              disabled={checking}
              className="rounded-full bg-navy-950 px-5 py-2.5 text-[12.5px] font-bold text-white transition-all hover:bg-navy-800 disabled:opacity-60"
            >
              {checking ? "Checking…" : "Check connection"}
            </button>
            {health && (
              <p className={cn("text-[12.5px] font-semibold", health.db ? "text-emerald-600" : "text-amber-600")}>
                {health.ok
                  ? health.db
                    ? `API reachable · DB responding${health.ms != null ? ` · ${health.ms}ms` : ""}`
                    : "API reachable · DB not responding"
                  : "API offline — running in local mode"}
              </p>
            )}
          </div>
        </div>

        {/* checklist */}
        <div className="rounded-xl border border-cloud bg-white p-5">
          <p className="text-[11.5px] font-bold tracking-[0.1em] text-slate-500 uppercase">Landing page status</p>
          <div className="mt-2 divide-y divide-cloud">
            <CheckRow
              ok={unreadInq === 0}
              label={unreadInq === 0 ? "No unread inquiries" : `${unreadInq} unread inquir${unreadInq === 1 ? "y" : "ies"}`}
              go={go}
              section="inquiries"
            />
            <CheckRow ok={featured} label="Featured insight set" go={go} section="insights" />
            <CheckRow ok={highlighted >= 1 && highlighted <= 3} label={`Landing highlights: ${highlighted}/3`} go={go} section="insights" />
            <CheckRow ok={data.services.length >= 4} label="At least four core services" go={go} section="services" />
            <CheckRow ok={data.testimonials.some((t) => t.active)} label="Active testimonial set" go={go} section="testimonials" />
            <CheckRow ok={data.contacts.offices.length >= 1} label="At least one office listed" go={go} section="contacts" />
          </div>
        </div>
      </div>

      {/* library snapshot */}
      <div className="rounded-xl border border-cloud bg-white p-5">
        <div className="flex items-center justify-between">
          <p className="text-[11.5px] font-bold tracking-[0.1em] text-slate-500 uppercase">Insights library</p>
          <button type="button" onClick={() => go("insights")} className="text-[12.5px] font-bold text-brand-600 hover:text-brand-700">
            Manage →
          </button>
        </div>
        <div className="mt-3 divide-y divide-cloud">
          {data.insights.slice(0, 5).map((i) => (
            <div key={i.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 py-3">
              <span className="min-w-0 flex-1 truncate text-[13.5px] font-semibold text-ink">{i.title}</span>
              <span className="rounded-full bg-mist px-2.5 py-1 text-[10.5px] font-bold text-slate-500">{i.category}</span>
              {i.featured && <span className="rounded-full bg-brand-500 px-2.5 py-1 text-[10px] font-bold text-white">FEATURED</span>}
              {i.highlight && <span className="rounded-full border border-cloud px-2.5 py-1 text-[10px] font-bold text-slate-500">LANDING</span>}
            </div>
          ))}
          {data.insights.length === 0 && (
            <p className="py-4 text-[13px] text-slate-400">No insights yet — write the first one to establish credibility.</p>
          )}
        </div>
      </div>

      {/* quick actions */}
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={() => go("hero")} className="rounded-full bg-brand-500 px-6 py-3 text-[13.5px] font-semibold text-white shadow-[0_14px_30px_-12px_rgba(47,102,242,0.8)] transition-all hover:-translate-y-0.5 hover:bg-brand-600">
          Edit the hero
        </button>
        <button type="button" onClick={() => go("insights")} className="rounded-full border border-cloud bg-white px-6 py-3 text-[13.5px] font-bold text-ink transition-all hover:border-brand-300 hover:text-brand-700">
          Write an insight
        </button>
        <RouteLink to="/" className="rounded-full border border-cloud bg-white px-6 py-3 text-[13.5px] font-bold text-ink transition-all hover:border-brand-300 hover:text-brand-700">
          View the site
        </RouteLink>
      </div>
    </div>
  );
}

/* --------------------------------- inquiries -------------------------------- */

function InquiriesView() {
  const { inquiries, setInquiryRead, removeInquiry } = useSite();
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const unread = inquiries.filter((i) => !i.read).length;
  const list =
    filter === "all" ? inquiries : inquiries.filter((i) => (filter === "unread" ? !i.read : i.read));

  const chips = [
    { key: "all" as const, label: `All (${inquiries.length})` },
    { key: "unread" as const, label: `Unread (${unread})` },
    { key: "read" as const, label: `Read (${inquiries.length - unread})` },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-[22px] font-extrabold text-ink">Inquiries</h2>
        <p className="mt-1.5 max-w-2xl text-[13.5px] leading-relaxed text-slate-500">
          Submissions from the site's “Book a growth conversation” form, newest
          first. {unread > 0 ? `${unread} awaiting a reply.` : "All caught up."}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {chips.map((c) => (
          <button
            key={c.key}
            type="button"
            onClick={() => setFilter(c.key)}
            className={cn(
              "rounded-full px-4 py-2 text-[12.5px] font-semibold transition-all",
              filter === c.key
                ? "bg-navy-950 text-white"
                : "border border-cloud bg-white text-slate-500 hover:border-brand-300 hover:text-brand-700"
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="rounded-xl border border-dashed border-cloud bg-mist/50 p-10 text-center">
          <p className="font-display text-[15px] font-bold text-ink">
            {filter === "all" ? "No inquiries yet" : `No ${filter} inquiries`}
          </p>
          <p className="mx-auto mt-2 max-w-sm text-[13px] leading-relaxed text-slate-400">
            When someone fills in the contact form on the site, it lands here —
            and on the server when you're connected to Neon.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {list.map((i) => (
            <div
              key={i.id}
              className={cn(
                "rounded-xl border p-5 transition-colors duration-300",
                i.read ? "border-cloud bg-white" : "border-brand-300 bg-brand-50/50"
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-2 font-display text-[15px] font-bold text-ink">
                    {i.name}
                    {!i.read && (
                      <span className="rounded-full bg-brand-500 px-2 py-0.5 text-[9.5px] font-bold tracking-wide text-white">
                        NEW
                      </span>
                    )}
                  </p>
                  {(i.company || i.offering) && (
                    <p className="mt-0.5 truncate text-[12.5px] text-slate-400">
                      {[i.company, i.offering ? `Selling: ${i.offering}` : ""]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  )}
                </div>
                <p className="shrink-0 text-[11.5px] font-semibold text-slate-400">
                  {new Date(i.createdAt).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </div>

              <a
                href={`mailto:${i.email}`}
                className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-bold text-brand-600 transition-colors hover:text-brand-700"
              >
                <MailIcon className="h-3.5 w-3.5" />
                {i.email}
              </a>

              <p className="mt-3 whitespace-pre-line text-[14px] leading-relaxed text-slate-600">
                {i.message}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-cloud pt-4">
                <button
                  type="button"
                  onClick={() => setInquiryRead(i.id, !i.read)}
                  className={cn(
                    "rounded-full px-4 py-2 text-[12px] font-bold transition-all",
                    i.read
                      ? "border border-cloud bg-white text-slate-500 hover:text-brand-700"
                      : "bg-brand-500 text-white shadow-[0_10px_22px_-10px_rgba(47,102,242,0.8)] hover:bg-brand-600"
                  )}
                >
                  {i.read ? "Mark as unread" : "Mark as read"}
                </button>
                <a
                  href={`mailto:${i.email}?subject=${encodeURIComponent(
                    `Re: growth conversation — Autonomy`
                  )}&body=${encodeURIComponent(
                    `Hi ${i.name},\n\nThanks for reaching out about ${i.offering || "your growth plans"}.\n`
                  )}`}
                  className="rounded-full border border-cloud bg-white px-4 py-2 text-[12px] font-bold text-ink transition-all hover:border-brand-300 hover:text-brand-700"
                >
                  Reply by email
                </a>
                <button
                  type="button"
                  onClick={() => (confirmId === i.id ? (removeInquiry(i.id), setConfirmId(null)) : setConfirmId(i.id))}
                  className={cn(
                    "ml-auto rounded-full px-4 py-2 text-[12px] font-bold transition-all",
                    confirmId === i.id
                      ? "bg-red-500 text-white"
                      : "text-slate-400 hover:text-red-500"
                  )}
                >
                  {confirmId === i.id ? "Confirm delete" : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------------------------- shell ---------------------------------- */

export default function AdminDashboard() {
  const { data, save, resetAll, version, source, inquiries } = useSite();
  const [section, setSection] = useState<SectionKey>("overview");
  const [confirming, setConfirming] = useState(false);
  const unread = inquiries.filter((i) => !i.read).length;

  useEffect(() => {
    if (!confirming) return;
    const t = window.setTimeout(() => setConfirming(false), 3500);
    return () => window.clearTimeout(t);
  }, [confirming]);

  const render = () => {
    switch (section) {
      case "hero":
        return <TabHero data={data} onSave={save} />;
      case "contacts":
        return <TabContacts data={data} onSave={save} />;
      case "inquiries":
        return <InquiriesView />;
      case "services":
        return <TabServices data={data} onSave={save} />;
      case "partners":
        return <TabPartners data={data} onSave={save} />;
      case "about":
        return <TabAbout data={data} onSave={save} />;
      case "process":
        return <TabProcess data={data} onSave={save} />;
      case "audience":
        return <TabAudience data={data} onSave={save} />;
      case "insights":
        return <TabInsights data={data} onSave={save} />;
      case "testimonials":
        return <TabTestimonials data={data} onSave={save} />;
      default:
        return <Overview go={setSection} />;
    }
  };

  const activeLabel = SECTIONS.find((s) => s.key === section)?.label ?? "Overview";

  return (
    <div className="min-h-screen bg-mist pt-[72px]">
      <div className="mx-auto flex max-w-[1440px] gap-6 px-4 py-8 sm:px-8">
        {/* sidebar */}
        <aside className="sticky top-[96px] hidden h-[calc(100vh-128px)] w-64 shrink-0 flex-col overflow-hidden rounded-2xl bg-navy-950 lg:flex">
          <div className="noise-layer" />
          <div className="relative flex h-full flex-col">
            <div className="flex items-center gap-2.5 px-5 pb-5 pt-6">
              <LogoMark className="h-6 w-7" />
              <div>
                <p className="font-display text-[13px] font-extrabold tracking-[0.14em] text-white">AUTONOMY</p>
                <p className="text-[10px] font-bold tracking-[0.26em] text-brand-300/70">ADMIN CONSOLE</p>
              </div>
            </div>
            <nav className="flex-1 space-y-0.5 overflow-y-auto px-3">
              {SECTIONS.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setSection(s.key)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-[13.5px] font-semibold transition-all duration-200",
                    section === s.key
                      ? "bg-brand-500 text-white shadow-[0_10px_24px_-10px_rgba(47,102,242,0.9)]"
                      : "text-brand-100/60 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <SIcon>{s.icon}</SIcon>
                  {s.label}
                  {s.key === "inquiries" && unread > 0 && (
                    <span
                      className={cn(
                        "ml-auto rounded-full px-2 py-0.5 text-[10.5px] font-bold",
                        section === "inquiries"
                          ? "bg-white/20 text-white"
                          : "bg-brand-500 text-white"
                      )}
                    >
                      {unread}
                    </span>
                  )}
                </button>
              ))}
            </nav>
            <div className="space-y-3 border-t border-white/10 p-4">
              <div className="flex items-center gap-2.5 rounded-xl bg-white/5 px-3.5 py-3">
                <span
                  className={cn(
                    "h-2 w-2 shrink-0 rounded-full",
                    source === "db" ? "bg-emerald-400" : source === "local" ? "bg-amber-400" : "animate-pulse bg-slate-400"
                  )}
                />
                <div className="min-w-0">
                  <p className="truncate text-[11.5px] font-bold text-white">
                    {source === "db" ? "Neon connected" : source === "local" ? "Local mode" : "Connecting…"}
                  </p>
                  <p className="text-[10.5px] text-brand-200/50">
                    {source === "db" ? "Prisma · Postgres" : "API offline"}
                  </p>
                </div>
              </div>
              <RouteLink
                to="/"
                className="block rounded-xl bg-white/10 px-3.5 py-2.5 text-center text-[12.5px] font-bold text-white transition-colors hover:bg-white/20"
              >
                View the site
              </RouteLink>
              <button
                type="button"
                onClick={() => (confirming ? (resetAll(), setConfirming(false)) : setConfirming(true))}
                className={cn(
                  "w-full rounded-xl border px-3.5 py-2.5 text-[12.5px] font-bold transition-all",
                  confirming
                    ? "border-red-400 bg-red-500 text-white"
                    : "border-white/15 text-brand-200/60 hover:border-red-400/60 hover:text-red-300"
                )}
              >
                {confirming ? "Click again to restore" : "Restore defaults"}
              </button>
            </div>
          </div>
        </aside>

        {/* main column */}
        <div className="min-w-0 flex-1">
          {/* mobile section switcher */}
          <div className="mb-5 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden">
            {SECTIONS.map((s) => (
              <button
                key={s.key}
                type="button"
                onClick={() => setSection(s.key)}
                className={cn(
                  "shrink-0 rounded-full px-4 py-2 text-[12.5px] font-semibold transition-all",
                  section === s.key
                    ? "bg-brand-500 text-white"
                    : "border border-cloud bg-white text-slate-500"
                )}
              >
                {s.label}
                {s.key === "inquiries" && unread > 0 ? ` (${unread})` : ""}
              </button>
            ))}
          </div>

          {/* breadcrumb */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[12px] font-bold tracking-[0.18em] text-slate-400 uppercase">
              Admin <span className="text-slate-300">/</span> <span className="text-brand-600">{activeLabel}</span>
            </p>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold",
                  source === "db"
                    ? "bg-emerald-50 text-emerald-700"
                    : source === "local"
                      ? "bg-amber-50 text-amber-700"
                      : "bg-mist text-slate-500"
                )}
              >
                <span className={cn("h-1.5 w-1.5 rounded-full", source === "db" ? "bg-emerald-500" : source === "local" ? "bg-amber-400" : "animate-pulse bg-slate-300")} />
                {source === "db" ? "Neon" : source === "local" ? "Local" : "Connecting"}
              </span>
              <RouteLink to="/" className="hidden rounded-full bg-navy-950 px-4 py-2 text-[12px] font-bold text-white transition-all hover:bg-navy-800 lg:block">
                View site
              </RouteLink>
            </div>
          </div>

          <div className="rounded-2xl border border-cloud bg-white p-5 sm:p-7">
            <div key={`${section}-${version}`}>{render()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
