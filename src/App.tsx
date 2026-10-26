
import { useEffect, useRef, useState } from "react";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import AdminLogin from "./pages/adminLogin";
import {
  About,
  Audience,
  InsightsLanding,
  Models,
  PartnerBand,
  Process,
  QuoteBand,
  Services,
  StatsBand,
} from "./components/Sections";
import { Contact, Footer } from "./components/Contact";
import InsightsPage from "./pages/InsightsPage";
import AdminDashboard from "./pages/AdminDashboard";
import { SiteProvider } from "./lib/store";
import { navigate, useRoute } from "./lib/router";

function Landing() {
  return (
    <main>
      <Hero />
      <Services />
      <PartnerBand />
      <StatsBand />
      <Process />
      <Audience />
      <Models />
      <About />
      <InsightsLanding />
      <QuoteBand />
      <Contact />
    </main>
  );
}

function Shell() {
  const route = useRoute();
  const prev = useRef(route.name);

  const isAdmin = route.name === "admin";
  const isAdminLogin = route.name === "admin-login";
  const isAdminArea = isAdmin || isAdminLogin;

  const [checkingSession, setCheckingSession] = useState(isAdmin);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    if (prev.current !== route.name) {
      window.scrollTo({ top: 0, behavior: "auto" });
      prev.current = route.name;
    }
  }, [route.name]);

  useEffect(() => {
    let cancelled = false;

    async function checkSession() {
      if (!isAdmin) {
        setCheckingSession(false);
        return;
      }

      setCheckingSession(true);

      try {
        const response = await fetch("/api/admin/session", {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
          cache: "no-store",
        });

        if (!response.ok) {
          if (!cancelled) {
            setAuthenticated(false);
            navigate("/admin/login", true);
          }
          return;
        }

        const data = await response.json();

        if (!cancelled) {
          if (data.authenticated === true) {
            setAuthenticated(true);
          } else {
            setAuthenticated(false);
            navigate("/admin/login", true);
          }
        }
      } catch (error) {
        console.error("Unable to verify admin session:", error);

        if (!cancelled) {
          setAuthenticated(false);
          navigate("/admin/login", true);
        }
      } finally {
        if (!cancelled) {
          setCheckingSession(false);
        }
      }
    }

    void checkSession();

    return () => {
      cancelled = true;
    };
  }, [isAdmin]);

  if (isAdmin && (checkingSession || !authenticated)) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f7f4] px-5">
        <div className="text-center">
          <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-orange-200 border-t-[#d9532a]" />
          <p className="text-sm text-gray-500">
            Verifying your admin session...
          </p>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-white font-body text-ink antialiased">
      {!isAdminArea && <Nav />}

      {route.name === "landing" && <Landing />}

      {route.name === "insights" && (
        <InsightsPage
          key={route.id ?? "list"}
          articleId={route.id}
        />
      )}

      {isAdminLogin && <AdminLogin />}

      {isAdmin && authenticated && <AdminDashboard />}

      {!isAdminArea && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <SiteProvider>
      <Shell />
    </SiteProvider>
  );
}
