import {
  type CSSProperties,
  type ElementType,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "../utils/cn";

/* ---------------------------------- hooks ---------------------------------- */

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

export function useInView<T extends HTMLElement>(
  options?: IntersectionObserverInit & { once?: boolean }
) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (options?.once !== false) io.disconnect();
        } else if (options?.once === false) {
          setInView(false);
        }
      },
      {
        threshold: options?.threshold ?? 0.15,
        rootMargin: options?.rootMargin ?? "0px 0px -8% 0px",
      }
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return { ref, inView };
}

export function useCountUp(
  target: number,
  start: boolean,
  duration = 1900,
  decimals = 0
) {
  const [value, setValue] = useState(0);
  const reduced = usePrefersReducedMotion();
  useEffect(() => {
    if (!start) return;
    if (reduced) {
      setValue(target);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Number((target * eased).toFixed(decimals)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target, duration, decimals, reduced]);
  return value;
}

/* ------------------------------- components -------------------------------- */

type RevealProps = {
  children: ReactNode;
  variant?: "up" | "left" | "right" | "scale";
  delay?: number;
  className?: string;
  as?: ElementType;
  style?: CSSProperties;
};

export function Reveal({
  children,
  variant = "up",
  delay = 0,
  className,
  as,
  style,
}: RevealProps) {
  const Tag = (as ?? "div") as ElementType;
  const { ref, inView } = useInView<HTMLElement>();
  return (
    <Tag
      ref={ref as never}
      className={cn(
        "rv",
        variant === "left" && "rv-left",
        variant === "right" && "rv-right",
        variant === "scale" && "rv-scale",
        inView && "rv-in",
        className
      )}
      style={{ ...style, transitionDelay: delay ? `${delay}ms` : undefined }}
    >
      {children}
    </Tag>
  );
}

const GLYPHS = "AUTONOMY&/×+—#ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function ScrambleText({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const reduced = usePrefersReducedMotion();
  const [out, setOut] = useState(() => (reduced ? text : ""));
  useEffect(() => {
    if (reduced) {
      setOut(text);
      return;
    }
    let raf = 0;
    let frame = 0;
    const t0 = performance.now() + delay;
    const tick = (t: number) => {
      if (t < t0) {
        raf = requestAnimationFrame(tick);
        return;
      }
      frame += 1;
      const resolved = Math.floor(frame / 2.2);
      if (resolved >= text.length) {
        setOut(text);
        return;
      }
      let s = "";
      for (let i = 0; i < text.length; i += 1) {
        const c = text[i];
        if (c === " ") {
          s += " ";
          continue;
        }
        s +=
          i < resolved
            ? c
            : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      setOut(s);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, delay, reduced]);
  return (
    <span className={className} aria-label={text} role="text">
      {out || "\u00A0"}
    </span>
  );
}
