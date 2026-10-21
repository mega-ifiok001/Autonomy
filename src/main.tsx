import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

// Open the admin route when the site is loaded from the admin subdomain
const ADMIN_HOST = "admin.autonomy.com.ng";

if (
  window.location.hostname === ADMIN_HOST &&
  !window.location.pathname.startsWith("/admin")
) {
  window.history.replaceState(null, "", "/admin");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);