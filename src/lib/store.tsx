import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  DEFAULT_DATA,
  uid,
  type Inquiry,
  type InquiryInput,
  type SiteData,
} from "./content";

export * from "./content";

const KEY = "autonomy-site-v3";
const INQ_KEY = "autonomy-inquiries-v1";

/* Base URL for the API (empty = same origin). Override with VITE_API_URL. */
export const API_BASE = (import.meta.env.VITE_API_URL as string | undefined ?? "")
  .replace(/\/$/, "");

export type Source = "db" | "local" | "loading";

type SiteCtx = {
  data: SiteData;
  save: (next: SiteData) => void;
  resetAll: () => void;
  version: number;
  source: Source;
  lastSaved: number | null;
  inquiries: Inquiry[];
  submitInquiry: (input: InquiryInput) => void;
  setInquiryRead: (id: string, read: boolean) => void;
  removeInquiry: (id: string) => void;
};

const Ctx = createContext<SiteCtx | null>(null);

function fromStorage(): SiteData {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...DEFAULT_DATA, ...JSON.parse(raw) } as SiteData;
  } catch {
    /* corrupted storage — fall back to defaults */
  }
  return DEFAULT_DATA;
}

function persistLocal(d: SiteData) {
  try {
    localStorage.setItem(KEY, JSON.stringify(d));
  } catch {
    /* storage unavailable */
  }
}

function inquiriesFromStorage(): Inquiry[] {
  try {
    const raw = localStorage.getItem(INQ_KEY);
    if (raw) {
      const list = JSON.parse(raw) as Inquiry[];
      if (Array.isArray(list)) return list;
    }
  } catch {
    /* corrupted storage */
  }
  return [];
}

function persistInquiries(list: Inquiry[]) {
  try {
    localStorage.setItem(INQ_KEY, JSON.stringify(list));
  } catch {
    /* storage unavailable */
  }
}

export function SiteProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SiteData>(fromStorage);
  const [source, setSource] = useState<Source>("loading");
  const [lastSaved, setLastSaved] = useState<number | null>(null);
  const [version, setVersion] = useState(0);
  const [inquiries, setInquiries] = useState<Inquiry[]>(inquiriesFromStorage);

  /* Hydrate content from the API (Neon via Prisma) when available. */
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await fetch(`${API_BASE}/api/site`, { cache: "no-store" });
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const json = (await r.json()) as Partial<SiteData>;
        if (!alive) return;
        const merged = { ...DEFAULT_DATA, ...json } as SiteData;
        setData(merged);
        persistLocal(merged);
        setSource("db");
      } catch {
        if (alive) setSource("local");
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  /* Once the DB is confirmed reachable, hydrate inquiries from it. */
  useEffect(() => {
    if (source !== "db") return;
    let alive = true;
    fetch(`${API_BASE}/api/inquiries`, { cache: "no-store" })
      .then((r) => (r.ok ? (r.json() as Promise<Inquiry[]>) : Promise.reject(new Error("bad"))))
      .then((list) => {
        if (alive && Array.isArray(list)) {
          setInquiries(list);
          persistInquiries(list);
        }
      })
      .catch(() => {
        /* keep the local list */
      });
    return () => {
      alive = false;
    };
  }, [source]);

  const pushRemote = useCallback((next: SiteData) => {
    fetch(`${API_BASE}/api/site`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    })
      .then((r) => {
        if (r.ok) {
          setSource("db");
          setLastSaved(Date.now());
        } else {
          throw new Error(`HTTP ${r.status}`);
        }
      })
      .catch(() => setSource("local"));
  }, []);

  const save = useCallback(
    (next: SiteData) => {
      setData(next);
      persistLocal(next);
      setVersion((v) => v + 1);
      pushRemote(next);
    },
    [pushRemote]
  );

  const resetAll = useCallback(() => {
    const fresh = JSON.parse(JSON.stringify(DEFAULT_DATA)) as SiteData;
    setData(fresh);
    persistLocal(fresh);
    setVersion((v) => v + 1);
    pushRemote(fresh);
  }, [pushRemote]);

  /* ------------------------------ inquiries ------------------------------ */

  const submitInquiry = useCallback(
    (input: InquiryInput) => {
      const inq: Inquiry = {
        id: uid(),
        name: input.name,
        email: input.email,
        company: input.company,
        offering: input.offering,
        message: input.message,
        read: false,
        createdAt: Date.now(),
      };
      setInquiries((prev) => {
        const next = [inq, ...prev];
        persistInquiries(next);
        return next;
      });
      fetch(`${API_BASE}/api/inquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inq),
      }).catch(() => {
        /* offline: the local list is the source of truth */
      });
    },
    []
  );

  const setInquiryRead = useCallback((id: string, read: boolean) => {
    setInquiries((prev) => {
      const next = prev.map((i) => (i.id === id ? { ...i, read } : i));
      persistInquiries(next);
      return next;
    });
    fetch(`${API_BASE}/api/inquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read }),
    }).catch(() => {
      /* offline: local state already updated */
    });
  }, []);

  const removeInquiry = useCallback((id: string) => {
    setInquiries((prev) => {
      const next = prev.filter((i) => i.id !== id);
      persistInquiries(next);
      return next;
    });
    fetch(`${API_BASE}/api/inquiries/${id}`, { method: "DELETE" }).catch(() => {
      /* offline: local state already updated */
    });
  }, []);

  return (
    <Ctx.Provider
      value={{
        data,
        save,
        resetAll,
        version,
        source,
        lastSaved,
        inquiries,
        submitInquiry,
        setInquiryRead,
        removeInquiry,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useSite() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSite must be used inside SiteProvider");
  return ctx;
}
