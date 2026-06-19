import { createFileRoute } from "@tanstack/react-router"
import { Navigation } from "#/components/landing/navigation"
import { Hero } from "#/components/landing/hero"
import { Services } from "#/components/landing/services"
import { About } from "#/components/landing/about"
import { CoursesPreview } from "#/components/landing/courses-preview"
import { Testimonials } from "#/components/landing/testimonials"
import { Contact } from "#/components/landing/contact"
import { Footer } from "#/components/landing/footer"
import { Preloader } from "#/components/landing/preloader"
import { SiteContentProvider, useSiteContentReady } from "#/lib/use-site-content"
import { useState, useCallback } from "react"

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
  const [preloaderDone, setPreloaderDone] = useState(false)
  const handlePreloaderComplete = useCallback(() => setPreloaderDone(true), [])

  return (
    <>
      <Preloader isContentReady={isReady} onComplete={handlePreloaderComplete} />
      <div className={`min-h-screen bg-background ${preloaderDone ? "" : "opacity-0 overflow-hidden max-h-screen"}`}>
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
  )
}
