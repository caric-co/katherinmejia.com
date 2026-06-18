import { useTranslation } from "react-i18next"
import { Button } from "@repo/ui/components/button"

export function Hero() {
  const { t } = useTranslation()

  return (
    <section className="min-h-screen flex items-center pt-14 px-6 md:px-10 bg-background">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Text */}
        <div className="py-16 md:py-0">
          <h1 className="font-display text-[clamp(3rem,7vw,5.5rem)] leading-[1.05] tracking-tight mb-6">
            {t("hero.title")}
          </h1>
          <p className="text-muted-foreground text-lg max-w-md mb-8 leading-relaxed">
            {t("hero.subtitle")}
          </p>
          <a href="/courses">
            <Button variant="outline" size="lg" className="text-sm uppercase tracking-wider px-8">
              {t("hero.cta")}
            </Button>
          </a>
        </div>

        {/* Image: background covers the right half, bleeds to edge */}
        <div className="relative -mr-6 md:-mr-10">
          <div
            className="aspect-[4/5] md:aspect-auto md:h-[85vh] bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=960&q=80')",
            }}
          />
        </div>
      </div>
    </section>
  )
}
