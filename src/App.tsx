import { useEffect, useRef } from "react";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
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
import { useRoute } from "./lib/router";

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

  /* scroll to top when switching views (not when opening an article in place) */
  useEffect(() => {
    if (prev.current !== route.name) {
      window.scrollTo({ top: 0, behavior: "auto" });
      prev.current = route.name;
    }
  }, [route.name]);

  return (
    <div className="min-h-screen bg-white font-body text-ink antialiased">
      <Nav />
      {route.name === "landing" && <Landing />}
      {route.name === "insights" && (
        <InsightsPage key={route.id ?? "list"} articleId={route.id} />
      )}
      {route.name === "admin" && <AdminDashboard />}
      {route.name !== "admin" && <Footer />}
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
