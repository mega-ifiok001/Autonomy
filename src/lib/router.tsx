import { type AnchorHTMLAttributes, type MouseEvent, useEffect, useState } from "react";

export type Route =
  | { name: "landing" }
  | { name: "insights"; id?: string }
  | { name: "admin" };

/* Parse the current location. Supports real paths (/admin, /insights/:id)
   and legacy hash routes (#/admin, #/insights/:id). */
export function parseLocation(): Route {
  let p = window.location.pathname;
  const h = window.location.hash;
  if (h.startsWith("#/")) p = h.slice(1);
  if (p.startsWith("/admin")) return { name: "admin" };
  const m = p.match(/^\/insights(?:\/([A-Za-z0-9_-]+))?\/?$/);
  if (m) return { name: "insights", id: m[1] };
  return { name: "landing" };
}

export function navigate(to: string, replace = false) {
  if (replace) window.history.replaceState(null, "", to);
  else window.history.pushState(null, "", to);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parseLocation());
  useEffect(() => {
    const fn = () => setRoute(parseLocation());
    window.addEventListener("popstate", fn);
    window.addEventListener("hashchange", fn);
    return () => {
      window.removeEventListener("popstate", fn);
      window.removeEventListener("hashchange", fn);
    };
  }, []);
  return route;
}

type RouteLinkProps = {
  to: string;
  children?: React.ReactNode;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

/* Anchor that uses history navigation (works even on hosts without SPA fallback). */
export function RouteLink({ to, children, onClick, ...rest }: RouteLinkProps) {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    navigate(to);
  };
  return (
    <a href={to} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}
