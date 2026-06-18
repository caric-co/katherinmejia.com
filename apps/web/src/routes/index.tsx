import { createFileRoute } from "@tanstack/react-router"
import { Navigation } from "#/components/landing/navigation"
import { Hero } from "#/components/landing/hero"
import { Services } from "#/components/landing/services"
import { About } from "#/components/landing/about"
import { CoursesPreview } from "#/components/landing/courses-preview"
import { Testimonials } from "#/components/landing/testimonials"
import { Contact } from "#/components/landing/contact"
import { Footer } from "#/components/landing/footer"

export const Route = createFileRoute("/")({
  component: HomePage,
})

function HomePage() {
  return (
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
  )
}
