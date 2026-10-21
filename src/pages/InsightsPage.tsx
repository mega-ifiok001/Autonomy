import { useMemo, useState } from "react";
import { Reveal } from "../lib/motion";
import { navigate, RouteLink } from "../lib/router";
import { INSIGHT_CATEGORIES, useSite } from "../lib/store";
import { ArrowRight, ArrowUpRight, CheckIcon } from "../components/Icons";
import { cn } from "../utils/cn";

/* ------------------------------ article helpers ---------------------------- */

function renderBody(body: string) {
  return body
    .split(/\n{2,}/)
    .filter(Boolean)
    .map((block, i) => {
      if (block.startsWith("## ")) {
        return (
          <h2
            key={i}
            className="mt-10 font-display text-[22px] font-bold tracking-tight text-ink"
          >
            {block.slice(3)}
          </h2>
        );
      }
      return (
        <p key={i} className="mt-5 text-[16px] leading-[1.85] text-slate-600">
          {block}
        </p>
      );
    });
}

function downloadFile(name: string, content: string) {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

const COHORT_CHECKLIST = `# The Cohort Sprint Checklist
### One page. Fourteen checkpoints. Ninety days.

## Before day one
1. The outcome is written as a number — seats sold, pipeline opened, plan live.
2. The buyer map is done: 10–20 named institutions most likely to buy the outcome.
3. The first conversation is a design consultation, not a sales pitch.
4. A pilot scope is defined: fixed size, fixed timeline, pre-agreed success criteria.
5. The definition of success is in writing, on both sides' calendars.
6. The economic buyer is identified — separate from the sponsor.
7. Documentation is procurement-ready: contract, data handling, references in writing.

## Days 1–30
8. Weekly one-pager shipped: the number, the decision made, the decision dodged, the next action with one name on it.
9. First institutional pilot conversation held and logged.
10. The single biggest unknown from the last 30 days is named and scheduled.

## Days 31–60
11. Pilot signed, or the reason is written down and the map updated.
12. Referral engine check: at least one existing client willing to be named in a room.
13. Kill criteria reviewed — if the line is crossed, resources move, in writing.

## Days 61–90
14. Sprint review: the number versus the commitment, the partnership ledger updated, and the next stage decided before the window closes.

— Autonomy · Growth & Strategic Partnerships`;

const ACQUISITION_GUIDE = `# Client Acquisition — One Page
### The buyer map, for tech training houses and similar outcome sellers.

## 1. Who actually buys
- The sponsor: felt the gap, asks for the fix, has no budget. Win their trust.
- The economic buyer: controls the line. Cares about cost per outcome and risk.
- Procurement: tests documentation, insurance, data handling, references.
- The end users: if they resent the program, nothing else matters.

## 2. What they buy
Outcomes, not seats. "Forty of your analysts, production-ready in sixteen
weeks, with the evidence to show it." The cohort is the delivery mechanism.

## 3. Where to find them
- Institutions already buying adjacent upskilling (banks, telcos, fintechs, government programs).
- Partners inside those industries who see hiring demand before the job boards move.
- Existing clients as references — a named reference is a channel.

## 4. The first move
A design consultation, not a sales call: "We're building X for buyers like
you — would you run it as a pilot at a defined scope?" Pre-sell the outcome
you can be measured against. Put the measurement in writing.

## 5. The cadence
A monthly one-page status to the economic buyer, even when nothing has
changed. Institutional buyers plan in quarters; silence for six weeks
hands the slot to whoever didn't.

— Autonomy · Growth & Strategic Partnerships`;

/* --------------------------------- the page -------------------------------- */

export default function InsightsPage({ articleId }: { articleId?: string }) {
  const { data } = useSite();
  const [filter, setFilter] = useState("All");
  const [openId, setOpenId] = useState<string | null>(articleId ?? null);
  const [subscribed, setSubscribed] = useState(false);

  const featured = data.insights.find((i) => i.featured);
  const list = useMemo(() => {
    const rest = data.insights.filter((i) => i.id !== featured?.id);
    return filter === "All" ? rest : rest.filter((i) => i.category === filter);
  }, [data.insights, featured, filter]);

  const open = data.insights.find((i) => i.id === openId);

  /* ------------------------------- article view ----------------------------- */
  if (open) {
    return (
      <div className="bg-white pt-[72px]">
        <article className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-20">
          <button
            type="button"
            onClick={() => {
              navigate("/insights");
              setOpenId(null);
              window.scrollTo({ top: 0, behavior: "auto" });
            }}
            className="inline-flex items-center gap-2 text-[13.5px] font-bold text-slate-400 transition-colors hover:text-brand-600"
          >
            <ArrowRight className="h-3.5 w-3.5 rotate-180" /> All insights
          </button>

          <Reveal>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-brand-50 px-3.5 py-1.5 text-[11.5px] font-bold text-brand-700">
                {open.category}
              </span>
              <span className="text-[12px] font-semibold tracking-[0.14em] text-slate-400 uppercase">
                {open.date} · {open.read}
              </span>
            </div>
            <h1 className="mt-6 font-display text-[34px] font-extrabold leading-[1.1] tracking-tight text-ink sm:text-[44px]">
              {open.title}
            </h1>
          </Reveal>

          <Reveal delay={120} variant="scale" className="mt-10 overflow-hidden rounded-2xl">
            <img src={open.img} alt="" className="h-72 w-full object-cover sm:h-96" />
          </Reveal>

          <Reveal delay={160}>
            <div className="mt-10">{renderBody(open.body)}</div>
            <div className="mt-14 flex items-center gap-4 border-t border-cloud pt-8">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-navy-950 font-display text-sm font-extrabold text-brand-400">
                A
              </div>
              <div>
                <p className="font-display text-[14px] font-bold text-ink">The Autonomy Desk</p>
                <p className="text-[12.5px] text-slate-500">
                  Written in public, before the case studies — so the claims stand to be tested.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={200} className="mt-12">
            <div className="rounded-2xl bg-mist p-7">
              <p className="font-display text-[15px] font-bold text-ink">Related reading</p>
              <div className="mt-4 space-y-4">
                {data.insights
                  .filter((i) => i.id !== open.id)
                  .slice(0, 2)
                  .map((i) => (
                    <button
                      key={i.id}
                      type="button"
                      onClick={() => {
                        navigate(`/insights/${i.id}`);
                        setOpenId(i.id);
                        window.scrollTo({ top: 0, behavior: "auto" });
                      }}
                      className="group flex w-full items-center justify-between gap-4 text-left"
                    >
                      <span className="text-[14px] font-semibold text-slate-600 transition-colors group-hover:text-brand-700">
                        {i.title}
                      </span>
                      <ArrowUpRight className="h-4 w-4 shrink-0 text-brand-500 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </button>
                  ))}
              </div>
            </div>
          </Reveal>
        </article>
      </div>
    );
  }

  /* ------------------------------- listing view ----------------------------- */
  return (
    <div className="bg-white pt-[72px]">
      {/* header */}
      <section className="border-b border-cloud bg-mist/60 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal>
            <p className="text-[11px] font-bold tracking-[0.3em] text-brand-600">INSIGHTS</p>
            <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-ink sm:text-[52px]">
              The notes we'd want to read.
            </h1>
            <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-slate-500">
              Opinion, playbooks and market notes from the desk — written to
              prove we know the space, before the case studies exist. When the
              first real numbers land, they'll appear here as case notes.
            </p>
          </Reveal>
        </div>
      </section>

      {/* featured */}
      {featured && (
        <section className="mx-auto max-w-7xl px-5 pt-14 sm:px-8 sm:pt-16">
          <Reveal>
            <RouteLink
              to={`/insights/${featured.id}`}
              className="group grid overflow-hidden rounded-2xl border border-cloud bg-white shadow-[0_24px_60px_-34px_rgba(8,21,48,0.4)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_40px_80px_-34px_rgba(8,21,48,0.5)] lg:grid-cols-[7fr_5fr]"
            >
              <div className="relative overflow-hidden">
                <img
                  src={featured.img}
                  alt=""
                  className="h-64 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06] lg:h-full"
                />
              </div>
              <div className="flex flex-col justify-center p-8 sm:p-10">
                <span className="inline-flex w-fit items-center gap-2 rounded-full bg-brand-500 px-3.5 py-1.5 text-[11px] font-bold tracking-[0.14em] text-white uppercase">
                  Featured · {featured.category}
                </span>
                <h2 className="mt-5 font-display text-[26px] font-extrabold leading-tight tracking-tight text-ink transition-colors duration-300 group-hover:text-brand-700 sm:text-[32px]">
                  {featured.title}
                </h2>
                <p className="mt-4 text-[15px] leading-relaxed text-slate-500">{featured.excerpt}</p>
                <p className="mt-6 flex items-center gap-2 text-[13.5px] font-bold text-brand-600">
                  Read the full piece
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                </p>
              </div>
            </RouteLink>
          </Reveal>
        </section>
      )}

      {/* filters + grid */}
      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16">
        <div className="flex flex-wrap items-center gap-2.5">
          {["All", ...INSIGHT_CATEGORIES].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setFilter(c)}
              className={cn(
                "rounded-full px-4.5 py-2 text-[13px] font-semibold transition-all duration-300",
                filter === c
                  ? "bg-navy-950 text-white shadow-[0_10px_24px_-10px_rgba(5,13,30,0.6)]"
                  : "border border-cloud bg-white text-slate-500 hover:border-brand-300 hover:text-brand-700"
              )}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {list.map((a, i) => (
            <Reveal key={a.id} delay={i * 90} as="article" className="h-full">
              <RouteLink
                to={`/insights/${a.id}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_18px_44px_-30px_rgba(8,21,48,0.3)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_36px_70px_-30px_rgba(8,21,48,0.4)]"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={a.img}
                    alt=""
                    className="h-52 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3.5 py-1.5 text-[11px] font-bold tracking-wide text-brand-700 shadow-sm">
                    {a.category}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <p className="text-[11.5px] font-semibold tracking-[0.14em] text-slate-400 uppercase">
                    {a.date} · {a.read}
                  </p>
                  <h3 className="mt-3 font-display text-[19px] font-bold leading-snug text-ink transition-colors duration-300 group-hover:text-brand-700">
                    {a.title}
                  </h3>
                  <p className="mt-3 flex-1 text-[14px] leading-relaxed text-slate-500">{a.excerpt}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-[13px] font-bold text-brand-600">
                    Read the piece
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1.5" />
                  </span>
                </div>
              </RouteLink>
            </Reveal>
          ))}
          {list.length === 0 && (
            <p className="col-span-full rounded-2xl border border-dashed border-cloud bg-mist/60 p-10 text-center text-[14.5px] text-slate-500">
              No notes in this category yet — new pieces are written in public as the work runs.
            </p>
          )}
        </div>
      </section>

      {/* resources */}
      <section className="border-t border-cloud bg-mist py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal>
            <p className="text-[11px] font-bold tracking-[0.3em] text-brand-600">RESOURCES</p>
            <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-[40px]">
              One-pagers you can use this week.
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            <Reveal delay={0}>
              <div className="group flex h-full flex-col rounded-2xl border border-cloud bg-white p-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(8,21,48,0.35)]">
                <span className="font-display text-sm font-extrabold tracking-[0.2em] text-brand-500">01</span>
                <h3 className="mt-4 font-display text-[21px] font-bold text-ink">Cohort Sprint Checklist</h3>
                <p className="mt-3 flex-1 text-[14px] leading-relaxed text-slate-500">
                  Fourteen checkpoints across ninety days — from the buyer map
                  to the sprint review. One page, printable, no fluff.
                </p>
                <button
                  type="button"
                  onClick={() => downloadFile("autonomy-cohort-sprint-checklist.md", COHORT_CHECKLIST)}
                  className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-brand-500 px-6 py-3 text-[13.5px] font-semibold text-white shadow-[0_14px_30px_-12px_rgba(47,102,242,0.8)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-600"
                >
                  Download the checklist
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </Reveal>

            <Reveal delay={110}>
              <div className="group flex h-full flex-col rounded-2xl border border-cloud bg-white p-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(8,21,48,0.35)]">
                <span className="font-display text-sm font-extrabold tracking-[0.2em] text-brand-500">02</span>
                <h3 className="mt-4 font-display text-[21px] font-bold text-ink">Client Acquisition Guide</h3>
                <p className="mt-3 flex-1 text-[14px] leading-relaxed text-slate-500">
                  The buyer map in one page: who actually buys, what they buy,
                  where to find them, and the first move that isn't a pitch.
                </p>
                <button
                  type="button"
                  onClick={() => downloadFile("autonomy-client-acquisition-guide.md", ACQUISITION_GUIDE)}
                  className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-brand-500 px-6 py-3 text-[13.5px] font-semibold text-white shadow-[0_14px_30px_-12px_rgba(47,102,242,0.8)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-600"
                >
                  Download the guide
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </Reveal>

            <Reveal delay={220}>
              <div className="relative flex h-full flex-col overflow-hidden rounded-2xl bg-navy-950 p-8 text-white">
                <div className="absolute inset-0 bg-[radial-gradient(100%_100%_at_0%_0%,#143067_0%,#050d1e_70%)]" />
                <div className="noise-layer" />
                <div className="relative flex h-full flex-col">
                  <span className="font-display text-sm font-extrabold tracking-[0.2em] text-brand-400">03</span>
                  <h3 className="mt-4 font-display text-[21px] font-bold">New notes, first.</h3>
                  <p className="mt-3 text-[14px] leading-relaxed text-brand-100/75">
                    One email when a new piece ships. No sequence, no spam,
                    unsubscribe in one click.
                  </p>
                  {subscribed ? (
                    <div className="mt-7 flex items-center gap-3 rounded-xl border border-brand-400/40 bg-brand-500/10 px-5 py-4">
                      <CheckIcon className="h-5 w-5 text-brand-400" />
                      <p className="text-[13.5px] font-semibold text-brand-100">
                        You're in. The next note is yours.
                      </p>
                    </div>
                  ) : (
                    <form
                      className="mt-7"
                      onSubmit={(e) => {
                        e.preventDefault();
                        setSubscribed(true);
                      }}
                    >
                      <div className="flex overflow-hidden rounded-full border border-white/20 bg-white/5 focus-within:border-brand-400">
                        <input
                          required
                          type="email"
                          placeholder="you@company.com"
                          aria-label="Email address"
                          className="w-full bg-transparent px-5 py-3.5 text-[14px] text-white placeholder:text-brand-200/40 outline-none"
                        />
                        <button
                          type="submit"
                          className="shrink-0 bg-brand-500 px-6 text-[13.5px] font-semibold text-white transition-colors hover:bg-brand-400"
                        >
                          Join
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
