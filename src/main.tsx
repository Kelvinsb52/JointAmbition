
  import { useEffect } from "react";
  import { createRoot } from "react-dom/client";
  import { BrowserRouter, Routes, Route, useLocation } from "react-router";
  import App from "./app/App.tsx";
  import PrivacyPage from "./app/legal/PrivacyPage.tsx";
  import TermsPage from "./app/legal/TermsPage.tsx";
  import CookiesPage from "./app/legal/CookiesPage.tsx";
  import AccessibilityPage from "./app/legal/AccessibilityPage.tsx";
  import "./styles/index.css";
  import "./components/Hummingbird/hummingbird.css";

  function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, [pathname]);

    return null;
  }

  // "/" renders the existing single-page site unchanged; legal routes share the LegalLayout component
  createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/cookies" element={<CookiesPage />} />
        <Route path="/accessibility" element={<AccessibilityPage />} />
      </Routes>
    </BrowserRouter>
  );
  