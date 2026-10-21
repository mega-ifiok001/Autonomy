import { type ComponentType } from "react";
import { Reveal, useCountUp, useInView } from "../lib/motion";
import { RouteLink } from "../lib/router";
import {
  type IconKey,
  PARTNER_STYLES,
  useSite,
} from "../lib/store";
import {
  ArrowRight,
  ArrowUpRight,
  FlagIcon,
  GrowthIcon,
  PartnershipsIcon,
  QuoteMark,
  ReticleIcon,
} from "./Icons";

const ICONS: Record<IconKey, ComponentType<{ className?: string }>> = {
  reticle: ReticleIcon,
  nodes: PartnershipsIcon,
  flag: FlagIcon,
  trend: GrowthIcon,
};

/* ------------------------------ core services ------------------------------ */

export function Services() {
  const { data } = useSite();
  return (
    <section id="services" className="scroll-mt-20 bg-white py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <p className="text-[11px] font-bold tracking-[0.3em] text-brand-600">
            WHAT WE DO
          </p>
          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-[40px]">
            One operating system, four disciplines.
          </h2>
        </Reveal>

        <div
          className={`mt-14 grid gap-y-12 sm:grid-cols-2 ${
            data.services.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-2"
          }`}
        >
          {data.services.map((s, i) => {
            const Icon = ICONS[s.icon] ?? ReticleIcon;
            return (
              <Reveal
                key={s.id}
                delay={i * 110}
                className="group relative border-t border-cloud pt-8 lg:border-t-0 lg:pt-0 lg:[&:not(:first-child)]:border-l lg:[&:not(:first-child)]:border-cloud lg:[&:not(:first-child)]:pl-9"
              >
                <span className="absolute inset-x-0 top-0 hidden h-0.5 origin-left scale-x-0 bg-brand-500 transition-transform duration-500 ease-out group-hover:scale-x-100 lg:block" />
                <Icon className="h-9 w-9 pt-4 text-brand-500 transition-all duration-500 group-hover:-translate-y-1 group-hover:text-brand-600" />
                <h3 className="mt-6 font-display text-lg font-bold text-ink">{s.title}</h3>
                <p className="mt-3 text-[14.5px] leading-relaxed text-slate-500">{s.copy}</p>
                {s.detail && (
                  <p className="mt-5 text-[11px] font-semibold tracking-[0.14em] text-slate-400 uppercase opacity-0 transition-all duration-500 [transform:translateY(4px)] group-hover:opacity-100 group-hover:[transform:translateY(0)]">
                    {s.detail}
                  </p>
                )}
                <a
                  href="#contact"
                  className="mt-5 inline-flex items-center gap-2 text-[13px] font-semibold text-brand-600 opacity-0 transition-all duration-500 [transform:translateY(4px)] group-hover:opacity-100 group-hover:[transform:translateY(0)]"
                  aria-label={`Book a growth conversation about ${s.title}`}
                >
                  Book a growth conversation <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- partner band ------------------------------ */

export function PartnerBand() {
  const { data } = useSite();
  if (data.partners.length === 0) return null;
  const row = (key: string, hidden = false) => (
    <div key={key} className="flex shrink-0 items-center" aria-hidden={hidden}>
      {data.partners.map((p) => (
        <span
          key={p.id}
          className={`mx-10 whitespace-nowrap text-lg text-slate-400 transition-colors duration-300 hover:text-brand-600 sm:mx-14 ${
            PARTNER_STYLES[p.style % PARTNER_STYLES.length]?.cls ??
            PARTNER_STYLES[0].cls
          }`}
        >
          {p.name}
        </span>
      ))}
    </div>
  );

  return (
    <section className="border-y border-cloud bg-white py-10">
      <p className="text-center text-[11px] font-bold tracking-[0.3em] text-slate-400">
        IN PARTNERSHIP WITH
      </p>
      <div className="marquee relative mt-7 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <div className="marquee-track">
          {row("a")}
          {row("b", true)}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- stats band ------------------------------- */

function Stat({
  stat,
  start,
  delay,
}: {
  stat: { id: string; prefix: string; value: number; suffix: string; decimals: number; label: string };
  start: boolean;
  delay: number;
}) {
  const value = useCountUp(stat.value, start, 1900 + delay);
  return (
    <Reveal delay={delay} className="relative px-2 py-8 text-center sm:py-10 lg:px-10">
      <p className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
        {stat.prefix}
        {stat.decimals ? value.toFixed(stat.decimals) : Math.round(value)}
        <span className="text-brand-400">{stat.suffix}</span>
      </p>
      <p className="mt-3 text-[12px] font-semibold tracking-[0.22em] text-brand-200/70 uppercase">
        {stat.label}
      </p>
    </Reveal>
  );
}

export function StatsBand() {
  const { data } = useSite();
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.3 });
  if (data.stats.length === 0) return null;
  return (
    <section className="relative overflow-hidden bg-navy-950">
      <div className="absolute inset-0 bg-[radial-gradient(90%_140%_at_50%_0%,#0d2148_0%,#050d1e_70%)]" />
      <div className="noise-layer" />
      <div
        ref={ref}
        className={`relative mx-auto grid max-w-7xl grid-cols-2 px-5 sm:px-8 lg:divide-x lg:divide-white/10 ${
          data.stats.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-2"
        }`}
      >
        {data.stats.map((s, i) => (
          <Stat key={s.id} stat={s} start={inView} delay={i * 120} />
        ))}
      </div>
    </section>
  );
}

/* --------------------------------- process --------------------------------- */

export function Process() {
  const { data } = useSite();
  return (
    <section id="how" className="scroll-mt-20 bg-mist py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-16 px-5 sm:px-8 lg:grid-cols-[5fr_7fr] lg:gap-24">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <Reveal>
            <p className="text-[11px] font-bold tracking-[0.3em] text-brand-600">
              HOW IT WORKS
            </p>
            <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-[44px] sm:leading-[1.05]">
              Four steps.
              <br />
              One operating rhythm.
            </h2>
            <p className="mt-6 max-w-md text-[15.5px] leading-relaxed text-slate-500">
              The same cadence whether the work is a sold cohort, an opened
              partnership, or a plan finally running in production.
            </p>
            <a
              href="#contact"
              className="group mt-9 inline-flex items-center gap-2.5 font-display text-[15px] font-bold text-brand-600 transition-colors hover:text-brand-700"
            >
              Book a growth conversation
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500 text-white transition-transform duration-300 group-hover:translate-x-1.5">
                <ArrowRight className="h-4 w-4" />
              </span>
            </a>
          </Reveal>
        </div>

        <div>
          {data.steps.map((s, i) => (
            <Reveal key={s.id} delay={i * 80} className="border-t border-cloud first:border-t-0">
              <div
                className={`group -mx-4 px-4 pb-9 transition-all duration-500 hover:bg-white hover:shadow-[0_24px_60px_-32px_rgba(8,21,48,0.25)] ${
                  i === 0 ? "pt-1" : "pt-9"
                }`}
              >
                <div className="flex items-start gap-6 sm:gap-10">
                  <span className="font-display text-4xl font-extrabold tracking-tight text-slate-300 transition-colors duration-500 group-hover:text-brand-500 sm:text-5xl">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-bold text-ink sm:text-2xl">{s.title}</h3>
                    <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-slate-500">{s.copy}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- who we serve ------------------------------ */

export function Audience() {
  const { data } = useSite();
  return (
    <section id="audience" className="scroll-mt-20 bg-white py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <p className="text-[11px] font-bold tracking-[0.3em] text-brand-600">WHO WE SERVE</p>
          <h2 className="mt-4 max-w-2xl font-display text-3xl font-extrabold tracking-tight text-ink sm:text-[40px]">
            Built around the teams we know best.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {data.audience.map((a, i) => (
            <Reveal
              key={a.id}
              delay={i * 110}
              className={
                i === 0
                  ? "relative overflow-hidden rounded-2xl bg-navy-950 p-8 text-white"
                  : "relative rounded-2xl border border-cloud p-8"
              }
            >
              {i === 0 && (
                <>
                  <div className="absolute inset-0 bg-[radial-gradient(100%_100%_at_0%_0%,#143067_0%,#050d1e_70%)]" />
                  <div className="noise-layer" />
                </>
              )}
              <div className="relative">
                {a.badge && (
                  <span
                    className={`inline-block rounded-full px-3.5 py-1.5 text-[11px] font-bold tracking-[0.14em] uppercase ${
                      i === 0 ? "bg-brand-500 text-white" : "bg-mist text-slate-500"
                    }`}
                  >
                    {a.badge}
                  </span>
                )}
                <h3
                  className={`mt-5 font-display text-[22px] font-bold ${
                    i === 0 ? "text-white" : "text-ink"
                  }`}
                >
                  {a.title}
                </h3>
                <p
                  className={`mt-3 text-[14.5px] leading-relaxed ${
                    i === 0 ? "text-brand-100/80" : "text-slate-500"
                  }`}
                >
                  {a.copy}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- engagement models --------------------------- */

export function Models() {
  const { data } = useSite();
  const { models } = data;
  return (
    <section id="models" className="scroll-mt-20 bg-mist py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <p className="text-[11px] font-bold tracking-[0.3em] text-brand-600">ENGAGEMENT MODELS</p>
          <h2 className="mt-4 max-w-2xl font-display text-3xl font-extrabold tracking-tight text-ink sm:text-[40px]">
            Two ways to start.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          {[models.a, models.b].map((m, i) => (
            <Reveal key={m.id} delay={i * 120}>
              <div className="group h-full rounded-2xl border border-cloud bg-white p-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(8,21,48,0.35)] sm:p-10">
                <div className="flex items-center justify-between">
                  <span className="font-display text-sm font-extrabold tracking-[0.2em] text-brand-500">
                    MODEL {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-400 transition-transform duration-500 group-hover:scale-150" />
                </div>
                <h3 className="mt-5 font-display text-[26px] font-extrabold text-ink">{m.title}</h3>
                <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-slate-500">{m.copy}</p>
                <a
                  href="#contact"
                  className="mt-7 inline-flex items-center gap-2 text-[13.5px] font-bold text-brand-600 transition-colors hover:text-brand-700"
                >
                  Start with {m.title.toLowerCase()}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200} className="mt-8">
          <div className="flex flex-col gap-4 rounded-2xl border border-dashed border-brand-300 bg-brand-50 px-8 py-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[15px] font-medium leading-relaxed text-navy-800">
              {models.note}
            </p>
            <a
              href="#contact"
              className="inline-flex shrink-0 items-center gap-2 font-display text-[14px] font-bold text-brand-700 transition-colors hover:text-brand-600"
            >
              Ask about economics <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ----------------------------------- about --------------------------------- */

export function About() {
  const { data } = useSite();
  const a = data.about;
  return (
    <section id="about" className="scroll-mt-20 bg-white py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20">
        <Reveal variant="left" className="relative">
          <div className="overflow-hidden rounded-2xl">
            <img
              src={a.img}
              alt="Autonomy partners working through a whiteboard strategy session"
              className="aspect-[4/3] w-full object-cover transition-transform duration-[3000ms] ease-out hover:scale-[1.06]"
            />
          </div>
          <div className="absolute -bottom-7 -right-3 max-w-[260px] rounded-xl bg-navy-950 p-6 shadow-[0_30px_60px_-20px_rgba(5,13,30,0.6)] sm:-right-8">
            <p className="font-display text-2xl font-extrabold text-brand-400">{a.statValue}</p>
            <p className="mt-2 text-[13px] leading-snug text-brand-100/80">{a.statText}</p>
          </div>
        </Reveal>

        <Reveal variant="right" delay={120}>
          <p className="text-[11px] font-bold tracking-[0.3em] text-brand-600">{a.eyebrow}</p>
          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-[42px] sm:leading-[1.08]">
            {a.heading}
          </h2>
          <p className="mt-6 text-[15.5px] leading-relaxed text-slate-500">{a.p1}</p>
          <p className="mt-4 text-[15.5px] leading-relaxed text-slate-500">{a.p2}</p>
          <div className="mt-8">
            {a.principles.map((p) => (
              <div
                key={p.id}
                className="group border-t border-cloud py-6 transition-colors duration-300 last:border-b hover:bg-mist/60"
              >
                <div className="flex items-baseline gap-5 px-1 sm:px-3">
                  <span className="font-display text-sm font-extrabold text-brand-500">{p.n}</span>
                  <div>
                    <h3 className="font-display text-[17px] font-bold text-ink">{p.title}</h3>
                    <p className="mt-2 text-[14px] leading-relaxed text-slate-500">{p.copy}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* -------------------------- insights (landing strip) ----------------------- */

export function InsightsLanding() {
  const { data } = useSite();
  const picks = data.insights.filter((i) => i.highlight);
  const shown = (picks.length ? picks : data.insights).slice(0, 3);
  if (shown.length === 0) return null;

  return (
    <section id="insights" className="scroll-mt-20 bg-mist py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <p className="text-[11px] font-bold tracking-[0.3em] text-brand-600">FROM THE DESK</p>
            <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-[40px]">
              Opinion, before the case studies.
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <RouteLink
              to="/insights"
              className="group inline-flex items-center gap-2 font-display text-[14.5px] font-bold text-brand-600 transition-colors hover:text-brand-700"
            >
              All insights
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </RouteLink>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {shown.map((a, i) => (
            <Reveal key={a.id} delay={i * 120} as="article" className="h-full">
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
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- quote band ------------------------------ */

export function QuoteBand() {
  const { data } = useSite();
  const t = data.testimonials.find((x) => x.active) ?? data.testimonials[0];
  if (!t) return null;
  return (
    <section className="relative overflow-hidden bg-navy-950 py-24 sm:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(80%_120%_at_15%_10%,#122c5e_0%,#050d1e_65%)]" />
      <div className="noise-layer" />
      <div className="relative mx-auto max-w-5xl px-5 sm:px-8">
        <Reveal>
          <QuoteMark className="h-9 w-12 text-brand-500" />
          <blockquote className="mt-8 font-display text-[26px] font-bold leading-[1.3] tracking-tight text-white sm:text-[34px]">
            “{t.quote}”
          </blockquote>
          <div className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-5">
            <div>
              <p className="font-display text-[15px] font-bold text-white">{t.name}</p>
              <p className="mt-1 text-[13px] text-brand-200/70">{t.role}</p>
            </div>
            {t.metrics.length > 0 && (
              <>
                <div className="hidden h-10 w-px bg-white/15 sm:block" />
                <div className="flex gap-10">
                  {t.metrics.slice(0, 2).map((m) => (
                    <div key={m.label}>
                      <p className="font-display text-2xl font-extrabold text-brand-400">{m.value}</p>
                      <p className="mt-1 text-[11px] font-semibold tracking-[0.18em] text-brand-200/60 uppercase">
                        {m.label}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
