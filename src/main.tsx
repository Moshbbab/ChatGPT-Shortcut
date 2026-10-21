import React from "react";
import ReactDOM from "react-dom/client";
import { AppContent } from "./App";
import { I18nProvider } from "./utils/i18n";
import "./index.css";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Failed to find root element");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  </React.StrictMode>
);
