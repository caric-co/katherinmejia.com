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
import { useState, useCallback, useEffect } from "react"

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

function hasSeenPreloader() {
  try { return sessionStorage.getItem("kmakeup-preloader") === "1" } catch { return false }
}

function markPreloaderSeen() {
  try { sessionStorage.setItem("kmakeup-preloader", "1") } catch {}
}

function HomeContent() {
  const isReady = useSiteContentReady()
  const [preloaderDone, setPreloaderDone] = useState(hasSeenPreloader)

  const handlePreloaderComplete = useCallback(() => {
    setPreloaderDone(true)
    markPreloaderSeen()
    document.body.style.overflow = ""
  }, [])

  useEffect(() => {
    if (preloaderDone) return
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = "" }
  }, [preloaderDone])

  return (
    <>
      {!preloaderDone && (
        <Preloader isContentReady={isReady} onComplete={handlePreloaderComplete} />
      )}
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
  )
}
