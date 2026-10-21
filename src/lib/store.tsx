
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

/* Base URL for the live API. Empty means same origin. */
export const API_BASE = (
  (import.meta.env.VITE_API_URL as string | undefined) ?? ""
).replace(/\/$/, "");

export type Source = "db" | "loading" | "error";

type SiteCtx = {
  data: SiteData;
  save: (next: SiteData) => Promise<void>;
  resetAll: () => Promise<void>;
  version: number;
  source: Source;
  lastSaved: number | null;
  inquiries: Inquiry[];
  submitInquiry: (input: InquiryInput) => Promise<void>;
  setInquiryRead: (id: string, read: boolean) => Promise<void>;
  removeInquiry: (id: string) => Promise<void>;
};

const Ctx = createContext<SiteCtx | null>(null);

/* Shared API request helper. Throws when the server returns an error. */
async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    cache: "no-store",
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export function SiteProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SiteData>(DEFAULT_DATA);
  const [source, setSource] = useState<Source>("loading");
  const [lastSaved, setLastSaved] = useState<number | null>(null);
  const [version, setVersion] = useState(0);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  /* Load live site content from the database. */
  useEffect(() => {
    let alive = true;

    async function loadSite() {
      try {
        const json = await apiRequest<Partial<SiteData>>("/api/site");

        if (!alive) return;

        setData({ ...DEFAULT_DATA, ...json } as SiteData);
        setSource("db");
      } catch (error) {
        if (!alive) return;

        console.error("Failed to load site content:", error);
        setSource("error");
      }
    }

    void loadSite();

    return () => {
      alive = false;
    };
  }, []);

  /* Load inquiries directly from the API once the site API is available. */
  useEffect(() => {
    if (source !== "db") return;

    let alive = true;

    async function loadInquiries() {
      try {
        const list = await apiRequest<Inquiry[]>("/api/inquiries");

        if (alive && Array.isArray(list)) {
          setInquiries(list);
        }
      } catch (error) {
        if (alive) {
          console.error("Failed to load inquiries:", error);
        }
      }
    }

    void loadInquiries();

    return () => {
      alive = false;
    };
  }, [source]);

  /* Save site content to the database before updating the UI. */
  const save = useCallback(async (next: SiteData) => {
    try {
      await apiRequest<void>("/api/site", {
        method: "PUT",
        body: JSON.stringify(next),
      });

      setData(next);
      setVersion((v) => v + 1);
      setLastSaved(Date.now());
      setSource("db");
    } catch (error) {
      setSource("error");
      throw error;
    }
  }, []);

  /* Reset the database-backed site content to its defaults. */
  const resetAll = useCallback(async () => {
    const fresh = JSON.parse(JSON.stringify(DEFAULT_DATA)) as SiteData;

    try {
      await apiRequest<void>("/api/site", {
        method: "PUT",
        body: JSON.stringify(fresh),
      });

      setData(fresh);
      setVersion((v) => v + 1);
      setLastSaved(Date.now());
      setSource("db");
    } catch (error) {
      setSource("error");
      throw error;
    }
  }, []);

  /* ------------------------------ inquiries ------------------------------ */

  const submitInquiry = useCallback(
    async (input: InquiryInput) => {
      const inquiry: Inquiry = {
        id: uid(),
        name: input.name,
        email: input.email,
        company: input.company,
        offering: input.offering,
        message: input.message,
        read: false,
        createdAt: Date.now(),
      };

      await apiRequest<void>("/api/inquiries", {
        method: "POST",
        body: JSON.stringify(inquiry),
      });

      setInquiries((prev) => [inquiry, ...prev]);
    },
    []
  );

  const setInquiryRead = useCallback(
    async (id: string, read: boolean) => {
      await apiRequest<void>(
        `/api/inquiries/${encodeURIComponent(id)}`,
        {
          method: "PATCH",
          body: JSON.stringify({ read }),
        }
      );

      setInquiries((prev) =>
        prev.map((inquiry) =>
          inquiry.id === id ? { ...inquiry, read } : inquiry
        )
      );
    },
    []
  );

  const removeInquiry = useCallback(async (id: string) => {
    await apiRequest<void>(
      `/api/inquiries/${encodeURIComponent(id)}`,
      { method: "DELETE" }
    );

    setInquiries((prev) =>
      prev.filter((inquiry) => inquiry.id !== id)
    );
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

  if (!ctx) {
    throw new Error("useSite must be used inside SiteProvider");
  }

  return ctx;
}
