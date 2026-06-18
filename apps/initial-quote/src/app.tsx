import { useState, useEffect, useCallback } from "react";
import { FilePicker } from "./components/file-picker";
import { QuoteView } from "./components/quote-view";

type Page = "index" | "quote";

function getPageFromHash(): Page {
  return window.location.hash === "#quote" ? "quote" : "index";
}

export function App() {
  const [page, setPage] = useState<Page>(getPageFromHash);

  useEffect(() => {
    const handleHashChange = () => setPage(getPageFromHash());
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const navigateToQuote = useCallback(() => {
    window.location.hash = "#quote";
  }, []);

  const navigateToIndex = useCallback(() => {
    window.location.hash = "";
  }, []);

  if (page === "quote") {
    return <QuoteView onBack={navigateToIndex} />;
  }

  return <FilePicker onNavigateToQuote={navigateToQuote} />;
}
