import { type FormEvent, useState } from "react";
import { Reveal } from "../lib/motion";
import { RouteLink } from "../lib/router";
import { useSite } from "../lib/store";
import {
  ArrowRight,
  CheckIcon,
  LogoMark,
  MailIcon,
  PhoneIcon,
  PinIcon,
} from "./Icons";
import footerLogo from "../../public/footer.png";

export function Contact() {
  const { data, submitInquiry } = useSite();
  const c = data.contacts;
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    submitInquiry({
      name: String(f.get("name") ?? "").trim(),
      email: String(f.get("email") ?? "").trim(),
      company: String(f.get("company") ?? "").trim(),
      offering: String(f.get("offering") ?? "").trim(),
      message: String(f.get("message") ?? "").trim(),
    });
    setSent(true);
  };

  return (
    <section id="contact" className="scroll-mt-20 bg-white py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-[5fr_6fr] lg:gap-20">
        {/* Info panel */}
        <Reveal variant="left" className="relative">
          <div className="relative h-full overflow-hidden rounded-2xl bg-navy-950 p-8 text-white sm:p-10">
            <div className="absolute inset-0 bg-[radial-gradient(90%_110%_at_20%_0%,#143067_0%,#050d1e_70%)]" />
            <div className="noise-layer" />
            <div className="relative flex h-full flex-col">
              <p className="text-[11px] font-bold tracking-[0.3em] text-brand-300">PARTNER WITH US</p>
              <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight sm:text-[38px] sm:leading-[1.08]">
                {c.title}
              </h2>
              <p className="mt-5 max-w-md text-[14.5px] leading-relaxed text-brand-100/75">{c.sub}</p>

              <div className="mt-10 space-y-5">
                <a
                  href={`mailto:${c.email}`}
                  className="group flex items-center gap-4 text-[15px] font-semibold text-white transition-colors hover:text-brand-300"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 transition-colors group-hover:border-brand-400/60">
                    <MailIcon className="h-4.5 w-4.5" />
                  </span>
                  {c.email}
                </a>
                <a
                  href={`tel:${c.phone.replace(/[^+\d]/g, "")}`}
                  className="group flex items-center gap-4 text-[15px] font-semibold text-white transition-colors hover:text-brand-300"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 transition-colors group-hover:border-brand-400/60">
                    <PhoneIcon className="h-4.5 w-4.5" />
                  </span>
                  {c.phone}
                </a>
              </div>

              <div className="mt-10 grid grid-cols-1 gap-5 border-t border-white/10 pt-8 sm:grid-cols-3 sm:gap-3">
                {c.offices.map((o) => (
                  <div key={o.id}>
                    <p className="flex items-center gap-1.5 text-[13px] font-bold text-brand-300">
                      <PinIcon className="h-3.5 w-3.5" /> {o.city}
                    </p>
                    <p className="mt-1.5 text-[12.5px] leading-snug text-brand-100/60">{o.line}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        {/* Form */}
        <Reveal variant="right" delay={120}>
          {sent ? (
            <div className="flex h-full min-h-[420px] flex-col items-center justify-center rounded-2xl border border-cloud bg-mist p-10 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-500 text-white shadow-[0_18px_40px_-14px_rgba(47,102,242,0.8)]">
                <CheckIcon className="h-7 w-7" />
              </span>
              <h3 className="mt-7 font-display text-2xl font-extrabold text-ink">
                Conversation requested.
              </h3>
              <p className="mt-3 max-w-sm text-[14.5px] leading-relaxed text-slate-500">
                We'll come back within two business days with the shape of the
                work and what a first stage would look like.
              </p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="mt-8 text-[13.5px] font-bold text-brand-600 transition-colors hover:text-brand-700"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <label className="block">
                  <span className="text-[12.5px] font-bold tracking-wide text-ink">Full name</span>
                  <input
                    required
                    type="text"
                    name="name"
                    placeholder="Your name"
                    className="mt-2 w-full rounded-xl border border-cloud bg-mist/60 px-4.5 py-3.5 text-[15px] text-ink placeholder:text-slate-400 transition-all duration-300 outline-none focus:border-brand-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(47,102,242,0.12)]"
                  />
                </label>
                <label className="block">
                  <span className="text-[12.5px] font-bold tracking-wide text-ink">Work email</span>
                  <input
                    required
                    type="email"
                    name="email"
                    placeholder="you@company.com"
                    className="mt-2 w-full rounded-xl border border-cloud bg-mist/60 px-4.5 py-3.5 text-[15px] text-ink placeholder:text-slate-400 transition-all duration-300 outline-none focus:border-brand-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(47,102,242,0.12)]"
                  />
                </label>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <label className="block">
                  <span className="text-[12.5px] font-bold tracking-wide text-ink">Company</span>
                  <input
                    required
                    type="text"
                    name="company"
                    placeholder="Training house, SME, or growing team"
                    className="mt-2 w-full rounded-xl border border-cloud bg-mist/60 px-4.5 py-3.5 text-[15px] text-ink placeholder:text-slate-400 transition-all duration-300 outline-none focus:border-brand-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(47,102,242,0.12)]"
                  />
                </label>
                <label className="block">
                  <span className="text-[12.5px] font-bold tracking-wide text-ink">What are you selling</span>
                  <input
                    type="text"
                    name="offering"
                    placeholder="A cohort, a product, a plan"
                    className="mt-2 w-full rounded-xl border border-cloud bg-mist/60 px-4.5 py-3.5 text-[15px] text-ink placeholder:text-slate-400 transition-all duration-300 outline-none focus:border-brand-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(47,102,242,0.12)]"
                  />
                </label>
              </div>
              <label className="block">
                <span className="text-[12.5px] font-bold tracking-wide text-ink">
                  What should the conversation cover?
                </span>
                <textarea
                  required
                  name="message"
                  rows={5}
                  placeholder="Where you are, where you want to be, and what's in the way…"
                  className="mt-2 w-full resize-none rounded-xl border border-cloud bg-mist/60 px-4.5 py-3.5 text-[15px] text-ink placeholder:text-slate-400 transition-all duration-300 outline-none focus:border-brand-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(47,102,242,0.12)]"
                />
              </label>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <button
                  type="submit"
                  className="group inline-flex items-center gap-2.5 rounded-full bg-brand-500 px-8 py-4 text-[15px] font-semibold text-white shadow-[0_18px_40px_-14px_rgba(47,102,242,0.85)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-600"
                >
                  {c.button}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
                <p className="text-[12px] text-slate-400">Confidential by default. No lists, no hand-offs.</p>
              </div>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------------------------- footer --------------------------------- */

const FOOTER_COLS: {
  head: string;
  links: { label: string; href: string; path?: boolean }[];
}[] = [
  {
    head: "Company",
    links: [
      { label: "Home", href: "/", path: true },
      { label: "About", href: "#about" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    head: "What We Do",
    links: [
      { label: "Client Acquisition", href: "#services" },
      { label: "Partnerships", href: "#services" },
      { label: "Plan to Execution", href: "#services" },
      { label: "Growth Tracking", href: "#services" },
    ],
  },
  {
    head: "Explore",
    links: [
      { label: "Insights", href: "/insights", path: true },
      { label: "Engagement models", href: "#models" },
      { label: "Who we serve", href: "#audience" },
      { label: "Book a conversation", href: "#contact" },
    ],
  },
];

export function Footer() {
  const { data } = useSite();
  return (
    <footer className="relative overflow-hidden border-t border-slate-200 bg-white text-slate-600">
  <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
    <div className="grid gap-12 lg:grid-cols-[4fr_8fr]">
      <div>
        <a href="#/" className="flex items-center gap-2.5">
          <img src={footerLogo} width={150} alt="Autonomy" />
        </a>
        <p className="mt-5 max-w-xs text-[14px] leading-relaxed text-slate-600">
          {data.hero.sub}
        </p>
        <p className="mt-6 text-[11px] font-semibold tracking-[0.24em] text-slate-500">
          {data.hero.cities.toUpperCase()}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
        {FOOTER_COLS.map((c) => (
          <div key={c.head}>
            <p className="text-[11px] font-bold tracking-[0.26em] text-slate-900 uppercase">{c.head}</p>
            <ul className="mt-5 space-y-3.5">
              {c.links.map((l) =>
                l.path ? (
                  <li key={l.label}>
                    <RouteLink to={l.href} className="text-[14px] text-slate-600 transition-colors hover:text-brand-600">
                      {l.label}
                    </RouteLink>
                  </li>
                ) : (
                  <li key={l.label}>
                    <a href={l.href} className="text-[14px] text-slate-600 transition-colors hover:text-brand-600">
                      {l.label}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
    <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-slate-200 pt-8 sm:flex-row sm:items-center">
      <p className="text-[12.5px] text-slate-500">© 2026 Autonomy. All rights reserved.</p>
      <div className="flex gap-7 text-[12.5px] text-slate-600">
        <a href="/" className="transition-colors hover:text-brand-600">Privacy</a>
        <a href="/" className="transition-colors hover:text-brand-600">Terms</a>
      </div>
    </div>
  </div>
</footer>
  );
}
