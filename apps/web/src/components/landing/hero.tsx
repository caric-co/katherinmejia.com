import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@repo/ui/components/button";

import { useFieldClick, usePreviewMode, useSiteContent } from "#/lib/use-site-content";

export function Hero() {
  const { t } = useTranslation();
  const { t: c } = useSiteContent("hero.");
  const isPreview = usePreviewMode();
  const onFieldClick = useFieldClick();

  return (
    <section className={`relative min-h-screen flex items-end pb-[15vh] px-6 md:px-10 ${isPreview ? "-mt-24" : ""}`}>
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('${c("hero.image", "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1920&q=80")}')`,
        }}
      />
      <div
        className={`absolute inset-0 bg-gradient-to-t from-background/70 via-background/20 to-transparent ${isPreview ? "cursor-pointer z-[1]" : ""}`}
        onClick={isPreview && onFieldClick ? () => onFieldClick("hero.image") : undefined}
      />

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <h1 className="font-display text-[clamp(3.5rem,9vw,7rem)] leading-[1] tracking-tight mb-6">
          {c("hero.title", t("hero.title"))}
        </h1>
        <p className="text-foreground/70 text-lg md:text-xl max-w-lg mb-10 leading-relaxed">
          {c("hero.subtitle", t("hero.subtitle"))}
        </p>
        <a href="/courses">
          <Button size="lg" className="text-sm uppercase tracking-wider px-10 py-6 gap-3">
            {c("hero.cta", t("hero.cta"))}
            <ArrowRight className="size-4" />
          </Button>
        </a>
      </div>
    </section>
  );
}
