import { type MouseEvent, useEffect, useState } from "react";
import { cn } from "../utils/cn";
import { RouteLink } from "../lib/router";
import { useSite } from "../lib/store";
import { LogoMark, MenuIcon } from "./Icons";
import logo from "../../public/logo.png";

type NavLink = { label: string; kind: "path" | "anchor"; to: string };

const LINKS: NavLink[] = [
  { label: "Home", kind: "path", to: "/" },
  { label: "What We Do", kind: "anchor", to: "#services" },
  { label: "About", kind: "anchor", to: "#about" },
  { label: "Insights", kind: "path", to: "/insights" },
  { label: "Contact", kind: "anchor", to: "#contact" },
];

function goAnchor(e: MouseEvent<HTMLAnchorElement>, href: string) {
  e.preventDefault();
  const id = href.slice(1);
  const smooth =
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? ("smooth" as const)
      : ("auto" as const);
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: smooth, block: "start" });
  } else {
    // not on the landing page — go home, then scroll once it renders
    navigateHomeThen(id);
  }
}

function navigateHomeThen(id: string) {
  window.history.pushState(null, "", "/");
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.setTimeout(() => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, 160);
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { inquiries } = useSite();
  const unread = inquiries.filter((i) => !i.read).length;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const renderLink = (l: NavLink, extra?: string) =>
    l.kind === "path" ? (
      <RouteLink
        key={l.label}
        to={l.to}
        onClick={() => setOpen(false)}
        className={cn("link-grow text-[13.5px] font-medium text-slate-500 transition-colors hover:text-ink", extra)}
      >
        {l.label}
      </RouteLink>
    ) : (
      <a
        key={l.label}
        href={l.to}
        onClick={(e) => {
          setOpen(false);
          goAnchor(e, l.to);
        }}
        className={cn("link-grow text-[13.5px] font-medium text-slate-500 transition-colors hover:text-ink", extra)}
      >
        {l.label}
      </a>
    );

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[box-shadow,background-color,backdrop-filter] duration-300",
        scrolled
          ? "bg-white/95 shadow-[0_10px_40px_-18px_rgba(8,21,48,0.35)] backdrop-blur-md"
          : "bg-white"
      )}
    >
      <nav className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">
        <RouteLink to="/" className="group flex items-center gap-2.5" aria-label="Autonomy home">
          <img src={logo} width={150} alt="Autonomy" />
        </RouteLink>

        <ul className="hidden items-center gap-8 lg:flex">
          {LINKS.map((l) => (
            <li key={l.label}>{renderLink(l)}</li>
          ))}
        </ul>

        <div className="flex items-center gap-2.5">
         
          <a
            href="#contact"
            onClick={(e) => goAnchor(e, "#contact")}
            className="hidden rounded-full bg-brand-500 px-6 py-2.5 text-[13.5px] font-semibold text-white shadow-[0_10px_24px_-10px_rgba(47,102,242,0.8)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-600 hover:shadow-[0_16px_30px_-10px_rgba(47,102,242,0.9)] sm:inline-block"
          >
            Partner With Us
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-mist lg:hidden"
          >
            <MenuIcon open={open} className="h-5.5 w-5.5" />
          </button>
        </div>
      </nav>

      {/* Mobile panel */}
      <div
        className={cn(
          "overflow-hidden bg-white transition-[max-height,opacity] duration-400 lg:hidden",
          open ? "max-h-[460px] border-t border-cloud opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <ul className="space-y-1 px-5 py-4">
          {LINKS.map((l) => (
            <li key={l.label}>
              {l.kind === "path" ? (
                <RouteLink
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-3 font-display text-[15px] font-semibold text-ink transition-colors hover:bg-mist"
                >
                  {l.label}
                </RouteLink>
              ) : (
                <a
                  href={l.to}
                  onClick={(e) => {
                    setOpen(false);
                    goAnchor(e, l.to);
                  }}
                  className="block rounded-xl px-4 py-3 font-display text-[15px] font-semibold text-ink transition-colors hover:bg-mist"
                >
                  {l.label}
                </a>
              )}
            </li>
          ))}
          <li>
            <RouteLink
              to="/admin"
              onClick={() => setOpen(false)}
              className="block rounded-xl px-4 py-3 font-display text-[15px] font-semibold text-slate-400 transition-colors hover:bg-mist hover:text-brand-600"
            >
              Admin console
            </RouteLink>
          </li>
          <li className="pt-2">
            <a
              href="#contact"
              onClick={(e) => {
                setOpen(false);
                goAnchor(e, "#contact");
              }}
              className="block rounded-full bg-brand-500 px-4 py-3 text-center font-display text-[15px] font-semibold text-white"
            >
              Partner With Us
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
