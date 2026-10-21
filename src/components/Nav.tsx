import { type MouseEvent, useEffect, useState } from "react";
import { cn } from "../utils/cn";
import { RouteLink } from "../lib/router";
import { MenuIcon } from "./Icons";
import logo from "../../public/logo.png";

type NavLink = {
  label: string;
  kind: "path" | "anchor";
  to: string;
};

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
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const behavior: ScrollBehavior = reducedMotion ? "auto" : "smooth";
  const element = document.getElementById(id);

  if (element) {
    element.scrollIntoView({ behavior, block: "start" });
  } else {
    navigateHomeThen(id);
  }
}

function navigateHomeThen(id: string) {
  window.history.pushState(null, "", "/");
  window.dispatchEvent(new PopStateEvent("popstate"));

  window.setTimeout(() => {
    document.getElementById(id)?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
        .matches
        ? "auto"
        : "smooth",
      block: "start",
    });
  }, 160);
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const closeOnEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);

    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  useEffect(() => {
    const closeOnDesktop = () => {
      if (window.innerWidth >= 1024) setOpen(false);
    };

    window.addEventListener("resize", closeOnDesktop);

    return () => window.removeEventListener("resize", closeOnDesktop);
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const linkColor =
    scrolled || open
      ? "text-slate-600 hover:text-ink"
      : "text-white/85 hover:text-white";

  const renderLink = (link: NavLink) =>
    link.kind === "path" ? (
      <RouteLink
        key={link.label}
        to={link.to}
        onClick={() => setOpen(false)}
        className={cn(
          "link-grow whitespace-nowrap text-[13px] font-medium transition-colors duration-200",
          linkColor
        )}
      >
        {link.label}
      </RouteLink>
    ) : (
      <a
        key={link.label}
        href={link.to}
        onClick={(e) => {
          setOpen(false);
          goAnchor(e, link.to);
        }}
        className={cn(
          "link-grow whitespace-nowrap text-[13px] font-medium transition-colors duration-200",
          linkColor
        )}
      >
        {link.label}
      </a>
    );

  return (
    <>
      {/* Floating navbar */}
      <header className="fixed inset-x-0 top-0 z-50 w-full px-3 pt-3 sm:px-5 sm:pt-5">
        <nav
          className={cn(
            "relative mx-auto w-full min-w-0 max-w-6xl rounded-2xl border transition-[background-color,border-color,box-shadow] duration-300 sm:rounded-full",
            scrolled || open
              ? "border-slate-200/70 bg-white/95 shadow-[0_12px_40px_-16px_rgba(8,21,48,0.28)] backdrop-blur-xl"
              : "border-white/15 bg-navy-950/35 shadow-[0_12px_40px_-20px_rgba(0,0,0,0.45)] backdrop-blur-xl"
          )}
        >
          <div className="flex h-[60px] min-w-0 items-center justify-between gap-2 px-3 sm:h-[68px] sm:gap-4 sm:px-5 lg:px-6">
            <RouteLink
              to="/"
              onClick={() => setOpen(false)}
              className="flex min-w-0 shrink items-center"
              aria-label="Autonomy home"
            >
              <img
                src={logo}
                width={135}
                alt="Autonomy"
                className={cn(
                  "h-auto w-[100px] max-w-full object-contain transition-all duration-300 min-[380px]:w-[112px] sm:w-[135px]",
                  !scrolled && !open && "brightness-0 invert"
                )}
              />
            </RouteLink>

            {/* Desktop links */}
            <ul className="hidden min-w-0 items-center gap-4 lg:flex xl:gap-6">
              {LINKS.map((link) => (
                <li key={link.label}>{renderLink(link)}</li>
              ))}
            </ul>

            {/* Desktop CTA */}
            <a
              href="#contact"
              onClick={(e) => goAnchor(e, "#contact")}
              className="hidden shrink-0 rounded-full bg-brand-500 px-4 py-2.5 text-[12px] font-semibold text-white shadow-[0_8px_20px_-8px_rgba(47,102,242,0.7)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-600 xl:inline-flex"
            >
              Partner With Us
            </a>

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-navigation"
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors lg:hidden",
                scrolled || open
                  ? "text-ink hover:bg-mist"
                  : "text-white hover:bg-white/10"
              )}
            >
              <MenuIcon open={open} className="h-5 w-5" />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile backdrop */}
      <button
        type="button"
        aria-label="Close navigation menu"
        tabIndex={open ? 0 : -1}
        onClick={() => setOpen(false)}
        className={cn(
          "fixed inset-0 z-[60] cursor-default bg-navy-950/45 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden",
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        )}
      />

      {/* Right-side sliding drawer */}
      <aside
        id="mobile-navigation"
        aria-label="Mobile navigation"
        aria-hidden={!open}
        className={cn(
          "fixed right-0 top-0 z-[70] flex h-[100dvh] w-[min(85vw,360px)] flex-col overflow-y-auto overscroll-contain bg-white shadow-[-20px_0_60px_-20px_rgba(8,21,48,0.25)] transition-transform duration-300 ease-out motion-reduce:transition-none lg:hidden",
          open ? "translate-x-0" : "pointer-events-none translate-x-full"
        )}
      >
        {/* Drawer header */}
        <div className="flex min-h-[76px] items-center justify-between border-b border-slate-200 px-5 py-3">
          <RouteLink
            to="/"
            onClick={() => setOpen(false)}
            aria-label="Autonomy home"
            tabIndex={open ? 0 : -1}
          >
            <img
              src={logo}
              width={125}
              alt="Autonomy"
              className="h-auto w-[125px] max-w-full object-contain"
            />
          </RouteLink>

          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            tabIndex={open ? 0 : -1}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate-700 transition-colors hover:bg-slate-100"
          >
            <span className="text-2xl leading-none" aria-hidden="true">
              &times;
            </span>
          </button>
        </div>

        {/* Navigation links */}
        <nav aria-label="Mobile navigation links" className="flex-1 px-4 py-6">
          <p className="mb-4 px-4 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
            Explore
          </p>

          <ul className="space-y-1">
            {LINKS.map((link, index) => (
              <li
                key={link.label}
                style={{
                  transitionDelay: open ? `${index * 45}ms` : "0ms",
                }}
                className={cn(
                  "transition-[opacity,transform] duration-300 motion-reduce:transition-none",
                  open
                    ? "translate-x-0 opacity-100"
                    : "translate-x-5 opacity-0"
                )}
              >
                {link.kind === "path" ? (
                  <RouteLink
                    to={link.to}
                    tabIndex={open ? 0 : -1}
                    onClick={() => setOpen(false)}
                    className="flex min-h-12 items-center rounded-xl px-4 py-3 font-display text-base font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-brand-600"
                  >
                    {link.label}
                  </RouteLink>
                ) : (
                  <a
                    href={link.to}
                    tabIndex={open ? 0 : -1}
                    onClick={(e) => {
                      setOpen(false);
                      goAnchor(e, link.to);
                    }}
                    className="flex min-h-12 items-center rounded-xl px-4 py-3 font-display text-base font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-brand-600"
                  >
                    {link.label}
                  </a>
                )}
              </li>
            ))}

            <li
              style={{
                transitionDelay: open ? `${LINKS.length * 45}ms` : "0ms",
              }}
              className={cn(
                "transition-[opacity,transform] duration-300 motion-reduce:transition-none",
                open
                  ? "translate-x-0 opacity-100"
                  : "translate-x-5 opacity-0"
              )}
            >
              {/* <RouteLink
                to="/admin"
                tabIndex={open ? 0 : -1}
                onClick={() => setOpen(false)}
                className="flex min-h-12 items-center rounded-xl px-4 py-3 font-display text-base font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-brand-600"
              >
                Admin console
              </RouteLink> */}
            </li>
          </ul>
        </nav>

        {/* Bottom CTA */}
        <div className="border-t border-slate-200 px-5 pb-8 pt-5">
          <a
            href="#contact"
            tabIndex={open ? 0 : -1}
            onClick={(e) => {
              setOpen(false);
              goAnchor(e, "#contact");
            }}
            className="flex min-h-12 w-full items-center justify-center rounded-full bg-brand-500 px-5 py-3.5 text-center text-sm font-semibold text-white shadow-[0_10px_24px_-10px_rgba(47,102,242,0.7)] transition-colors hover:bg-brand-600"
          >
            Partner With Us
          </a>
          <p className="mt-4 text-center text-xs text-slate-400">
            Building better possibilities.
          </p>
        </div>
      </aside>
    </>
  );
}