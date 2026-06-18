import { useTranslation } from "react-i18next"
import { Button } from "@repo/ui/components/button"
import { ArrowRight } from "lucide-react"

export function Hero() {
  const { t } = useTranslation()

  return (
    <section className="relative min-h-screen flex items-center px-6 md:px-10">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1920&q=80')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/20" />

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <h1 className="font-display text-[clamp(3.5rem,9vw,7rem)] leading-[1] tracking-tight mb-6">
          {t("hero.title")}
        </h1>
        <p className="text-foreground/70 text-lg md:text-xl max-w-lg mb-10 leading-relaxed">
          {t("hero.subtitle")}
        </p>
        <a href="/courses">
          <Button size="lg" className="text-sm uppercase tracking-wider px-10 py-6 gap-3">
            {t("hero.cta")}
            <ArrowRight className="size-4" />
          </Button>
        </a>
      </div>
    </section>
  )
}
