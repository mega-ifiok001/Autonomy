
import {
  type AnchorHTMLAttributes,
  type MouseEvent,
  useEffect,
  useState,
} from "react";

export type Route =
  | { name: "landing" }
  | { name: "insights"; id?: string }
  | { name: "admin" }
  | { name: "admin-login" };

/*
 * Parse the current location.
 * Supports real paths (/admin, /admin/login, /insights/:id)
 * and legacy hash routes (#/admin, #/admin/login, #/insights/:id).
 */
export function parseLocation(): Route {
  let path = window.location.pathname;
  const hash = window.location.hash;

  if (hash.startsWith("#/")) {
    path = hash.slice(1);
  }

  // Match the login route before the general admin route.
  if (path === "/admin/login" || path === "/admin/login/") {
    return { name: "admin-login" };
  }

  if (path === "/admin" || path === "/admin/") {
    return { name: "admin" };
  }

  const match = path.match(
    /^\/insights(?:\/([A-Za-z0-9_-]+))?\/?$/
  );

  if (match) {
    return { name: "insights", id: match[1] };
  }

  return { name: "landing" };
}

export function navigate(to: string, replace = false) {
  if (replace) {
    window.history.replaceState(null, "", to);
  } else {
    window.history.pushState(null, "", to);
  }

  window.dispatchEvent(new PopStateEvent("popstate"));
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parseLocation());

  useEffect(() => {
    const handleLocationChange = () => {
      setRoute(parseLocation());
    };

    window.addEventListener("popstate", handleLocationChange);
    window.addEventListener("hashchange", handleLocationChange);

    return () => {
      window.removeEventListener("popstate", handleLocationChange);
      window.removeEventListener("hashchange", handleLocationChange);
    };
  }, []);

  return route;
}

type RouteLinkProps = {
  to: string;
  children?: React.ReactNode;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

/*
 * Anchor that uses history navigation.
 */
export function RouteLink({
  to,
  children,
  onClick,
  ...rest
}: RouteLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);

    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();
    navigate(to);
  };

  return (
    <a href={to} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}
