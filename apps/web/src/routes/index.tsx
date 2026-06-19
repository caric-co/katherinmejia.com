import { createFileRoute } from "@tanstack/react-router"
import { Navigation } from "#/components/landing/navigation"
import { Hero } from "#/components/landing/hero"
import { Services } from "#/components/landing/services"
import { About } from "#/components/landing/about"
import { CoursesPreview } from "#/components/landing/courses-preview"
import { Testimonials } from "#/components/landing/testimonials"
import { Contact } from "#/components/landing/contact"
import { Footer } from "#/components/landing/footer"
import { SiteContentProvider, useSiteContentReady } from "#/lib/use-site-content"

export const Route = createFileRoute("/")({
  component: HomePage,
})

function HomePage() {
  return (
    <SiteContentProvider>
      <HomeContent />
    </SiteContentProvider>
  )
}

function HomeContent() {
  const isReady = useSiteContentReady()

  return (
    <div className={`min-h-screen bg-background transition-opacity duration-500 ${isReady ? "opacity-100" : "opacity-0"}`}>
      <Navigation />
      <Hero />
      <Services />
      <About />
      <CoursesPreview />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  )
}
