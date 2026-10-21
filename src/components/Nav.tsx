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

// Height of the floating navbar + its top gap, so sections aren't hidden under it
const NAV_OFFSET = 96;

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function scrollToId(id: string): boolean {
  const element = document.getElementById(id);
  if (!element) return false;

  const top = element.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;

  window.scrollTo({
    top: Math.max(top, 0),
    behavior: prefersReducedMotion() ? "auto" : "smooth",
  });
  return true;
}

function navigateHomeThen(id: string) {
  window.history.pushState(null, "", "/");
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.setTimeout(() => scrollToId(id), 160);
}

function goAnchor(e: MouseEvent<HTMLAnchorElement>, href: string, delay = 0) {
  e.preventDefault();
  const id = href.slice(1);

  window.setTimeout(() => {
    if (!scrollToId(id)) navigateHomeThen(id);
  }, delay);
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

  const desktopLinkClass = cn(
    "link-grow whitespace-nowrap text-[13px] font-medium transition-colors duration-200",
    linkColor
  );

  const drawerLinkClass =
    "flex min-h-12 items-center rounded-xl px-4 py-3 font-display text-base font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-brand-600";

  const renderLink = (link: NavLink) =>
    link.kind === "path" ? (
      <RouteLink
        to={link.to}
        onClick={() => setOpen(false)}
        className={desktopLinkClass}
      >
        {link.label}
      </RouteLink>
    ) : (
      <a
        href={link.to}
        onClick={(e) => goAnchor(e, link.to)}
        className={desktopLinkClass}
      >
        {link.label}
      </a>
    );

  const drawerTransition = (index: number) => ({
    style: { transitionDelay: open ? `${index * 45}ms` : "0ms" },
    className: cn(
      "transition-[opacity,transform] duration-300 motion-reduce:transition-none",
      open ? "translate-x-0 opacity-100" : "translate-x-5 opacity-0"
    ),
  });

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
          <div className="flex h-[60px] min-w-0 items-center gap-2 px-3 sm:h-[68px] sm:gap-4 sm:px-5 lg:px-6">
            {/* Left column: logo */}
            <div className="flex min-w-0 flex-1 items-center">
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
            </div>

            {/* Center column: desktop links (truly centered) */}
            <ul className="hidden items-center gap-5 lg:flex xl:gap-7">
              {LINKS.map((link) => (
                <li key={link.label}>{renderLink(link)}</li>
              ))}
            </ul>

            {/* Right column: CTA (lg+) and menu toggle (below lg) */}
            <div className="flex min-w-0 flex-1 items-center justify-end">
              <a
                href="#contact"
                onClick={(e) => goAnchor(e, "#contact")}
                className="hidden shrink-0 rounded-full bg-brand-500 px-4 py-2.5 text-[12px] font-semibold text-white shadow-[0_8px_20px_-8px_rgba(47,102,242,0.7)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-600 lg:inline-flex"
              >
                Partner With Us
              </a>

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
          </div>
        </nav>
      </header>

      {/* Mobile overlay: clipped wrapper so the off-screen drawer can't cause horizontal overflow */}
      <div
        className={cn(
          "fixed inset-0 z-[60] overflow-hidden transition-[visibility] duration-300 lg:hidden",
          open ? "visible" : "pointer-events-none invisible"
        )}
      >
        {/* Backdrop */}
        <button
          type="button"
          aria-label="Close navigation menu"
          tabIndex={open ? 0 : -1}
          onClick={() => setOpen(false)}
          className={cn(
            "absolute inset-0 cursor-default bg-navy-950/45 backdrop-blur-[2px] transition-opacity duration-300",
            open ? "opacity-100" : "opacity-0"
          )}
        />

        {/* Right-side sliding drawer */}
        <aside
          id="mobile-navigation"
          aria-label="Mobile navigation"
          aria-hidden={!open}
          className={cn(
            "absolute right-0 top-0 flex h-full w-[min(85vw,360px)] flex-col overflow-y-auto overscroll-contain bg-white transition-transform duration-300 ease-out motion-reduce:transition-none",
            open
              ? "translate-x-0 shadow-[-20px_0_60px_-20px_rgba(8,21,48,0.25)]"
              : "translate-x-full"
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
          <nav
            aria-label="Mobile navigation links"
            className="flex-1 px-4 py-6"
          >
            <p className="mb-4 px-4 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
              Explore
            </p>

            <ul className="space-y-1">
              {LINKS.map((link, index) => (
                <li key={link.label} {...drawerTransition(index)}>
                  {link.kind === "path" ? (
                    <RouteLink
                      to={link.to}
                      tabIndex={open ? 0 : -1}
                      onClick={() => setOpen(false)}
                      className={drawerLinkClass}
                    >
                      {link.label}
                    </RouteLink>
                  ) : (
                    <a
                      href={link.to}
                      tabIndex={open ? 0 : -1}
                      onClick={(e) => {
                        setOpen(false);
                        goAnchor(e, link.to, 60);
                      }}
                      className={drawerLinkClass}
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}

              <li {...drawerTransition(LINKS.length)}>
                <RouteLink
                  to="/admin"
                  tabIndex={open ? 0 : -1}
                  onClick={() => setOpen(false)}
                  className={cn(drawerLinkClass, "font-medium text-slate-500")}
                >
                  Admin console
                </RouteLink>
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
                goAnchor(e, "#contact", 60);
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
      </div>
    </>
  );
}