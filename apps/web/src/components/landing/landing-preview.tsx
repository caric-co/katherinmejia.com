import { DraftModeProvider, PreviewModeProvider, FieldClickProvider } from "#/lib/use-site-content"
import { Navigation } from "./navigation"
import { Hero } from "./hero"
import { Services } from "./services"
import { About } from "./about"
import { CoursesPreview } from "./courses-preview"
import { Testimonials } from "./testimonials"
import { Contact } from "./contact"
import { Footer } from "./footer"

interface LandingPreviewProps {
  onFieldClick?: (key: string) => void
}

export function LandingPreview({ onFieldClick }: LandingPreviewProps) {
  return (
    <DraftModeProvider value={true}>
      <PreviewModeProvider value={true}>
        <FieldClickProvider value={onFieldClick ?? null}>
          <div
            className="min-h-screen bg-background"
            onClickCapture={(e) => {
              const target = e.target as HTMLElement
              if (target.closest("a, button[type='submit']")) {
                if (!target.closest("[data-field-key]")) {
                  e.preventDefault()
                  e.stopPropagation()
                }
              }
            }}
          >
            <Navigation />
            <Hero />
            <Services />
            <About />
            <CoursesPreview />
            <Testimonials />
            <Contact />
            <Footer />
          </div>
        </FieldClickProvider>
      </PreviewModeProvider>
    </DraftModeProvider>
  )
}
