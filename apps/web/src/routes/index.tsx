import { createFileRoute } from "@tanstack/react-router"
import { useTranslation } from "react-i18next"

export const Route = createFileRoute("/")({
  component: HomePage,
})

function HomePage() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col items-center justify-center min-h-screen px-6">
        <h1 className="font-display text-[clamp(3rem,10vw,8rem)] font-normal leading-[1.1] tracking-tight text-foreground">
          {t("hero.title")}
        </h1>
        <p className="mt-4 text-muted-foreground text-sm uppercase tracking-[0.15em]">
          {t("hero.subtitle")}
        </p>
      </div>
    </div>
  )
}
