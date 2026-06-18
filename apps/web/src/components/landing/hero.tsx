import { useTranslation } from "react-i18next"
import { Button } from "@repo/ui/components/button"

export function Hero() {
  const { t } = useTranslation()

  return (
    <section className="relative min-h-screen flex items-end pb-24 px-6 md:px-10 bg-muted">
      {/* Background image placeholder */}
      <div className="absolute inset-0 bg-accent/30" />
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1920&q=80')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

      <div className="relative z-10 max-w-3xl">
        <h1 className="font-display text-[clamp(3rem,8vw,6rem)] leading-[1.05] tracking-tight mb-6">
          {t("hero.title")}
        </h1>
        <p className="text-foreground/70 text-lg md:text-xl max-w-xl mb-8">
          {t("hero.subtitle")}
        </p>
        <a href="#courses">
          <Button variant="outline" size="lg" className="text-sm uppercase tracking-wider px-8">
            {t("hero.cta")}
          </Button>
        </a>
      </div>
    </section>
  )
}
