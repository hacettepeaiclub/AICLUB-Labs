import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "./app/ThemeProvider";
import { LanguageProvider } from "./i18n";
import { migrateRenamedSlugs } from "./labs/renamed";
import "./styles/globals.css";

// Before anything reads storage: progress saved under an old lab address
// moves to the new one.
migrateRenamedSlugs();

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element #root not found");

createRoot(rootElement).render(
  <StrictMode>
    <ThemeProvider>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </ThemeProvider>
  </StrictMode>,
);
