import { useCallback, useEffect, useState } from "react";

import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { ConvexHttpClient } from "convex/browser";

import { api } from "@convex/_generated/api";

import { About } from "#/components/landing/about";
import { Contact } from "#/components/landing/contact";
import { CoursesPreview } from "#/components/landing/courses-preview";
import { Footer } from "#/components/landing/footer";
import { Hero } from "#/components/landing/hero";
import { Navigation } from "#/components/landing/navigation";
import { Preloader } from "#/components/landing/preloader";
import { Services } from "#/components/landing/services";
import { Testimonials } from "#/components/landing/testimonials";
import { SiteContentProvider, useSiteContentReady } from "#/lib/use-site-content";

const fetchSiteContent = createServerFn({ method: "GET" }).handler(async () => {
  const convexUrl = process.env.VITE_CONVEX_URL || import.meta.env.VITE_CONVEX_URL;
  if (!convexUrl) return [];
  const client = new ConvexHttpClient(convexUrl);
  return await client.query(api.siteContent.listAll, {});
});

export const Route = createFileRoute("/")({
  loader: () => fetchSiteContent(),
  head: ({ loaderData }) => {
    const contentMap = new Map((loaderData ?? []).map((c: any) => [c.key, c]));
    const get = (key: string, fallback: string) => contentMap.get(key)?.value?.es ?? fallback;

    const title = `${get("hero.title", "Katherin Mejia")} — Maquilladora Profesional`;
    const description = get(
      "hero.subtitle",
      "Cursos de maquillaje profesional y marca personal de Katherin Mejia (@kmakeup_c)",
    );
    const image = get("hero.image", "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&q=80");

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:image", content: image },
        { property: "og:locale", content: "es_CO" },
        { property: "og:site_name", content: "Katherin Mejia" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: image },
      ],
    };
  },
  component: HomePage,
});

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Katherin Mejia",
  alternateName: "@kmakeup_c",
  jobTitle: "Maquilladora Profesional",
  url: "https://katherinmejia.vercel.app",
  sameAs: ["https://www.instagram.com/kmakeup_c"],
  knowsAbout: ["Maquillaje profesional", "Maquillaje para eventos", "Cursos de maquillaje"],
};

function HomePage() {
  const serverData = Route.useLoaderData();

  return (
    <SiteContentProvider serverData={serverData}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HomeContent />
    </SiteContentProvider>
  );
}

function hasSeenPreloader() {
  try {
    return sessionStorage.getItem("kmakeup-preloader") === "1";
  } catch {
    return false;
  }
}

function markPreloaderSeen() {
  try {
    sessionStorage.setItem("kmakeup-preloader", "1");
  } catch {}
}

function HomeContent() {
  const isReady = useSiteContentReady();
  const [preloaderDone, setPreloaderDone] = useState(false);

  useEffect(() => {
    if (hasSeenPreloader()) {
      setPreloaderDone(true);
    }
  }, []);

  const handlePreloaderComplete = useCallback(() => {
    setPreloaderDone(true);
    markPreloaderSeen();
    document.body.style.overflow = "";
  }, []);

  useEffect(() => {
    if (preloaderDone) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [preloaderDone]);

  return (
    <>
      {!preloaderDone && <Preloader isContentReady={isReady} onComplete={handlePreloaderComplete} />}
      <div className="min-h-screen bg-background">
        <Navigation />
        <Hero />
        <Services />
        <About />
        <CoursesPreview />
        <Testimonials />
        <Contact />
        <Footer />
      </div>
    </>
  );
}
