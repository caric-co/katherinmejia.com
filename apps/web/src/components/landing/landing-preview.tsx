import { DraftModeProvider, PreviewModeProvider, FieldClickProvider, SiteContentProvider, useSiteContentReady } from "#/lib/use-site-content"
import { Skeleton } from "@repo/ui/components/skeleton"
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
    <SiteContentProvider>
      <DraftModeProvider value={true}>
        <PreviewModeProvider value={true}>
          <FieldClickProvider value={onFieldClick ?? null}>
            <PreviewContent />
          </FieldClickProvider>
        </PreviewModeProvider>
      </DraftModeProvider>
    </SiteContentProvider>
  )
}

function PreviewContent() {
  const isReady = useSiteContentReady()

  if (!isReady) return <PreviewSkeleton />

  return (
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
  )
}

function PreviewSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav skeleton */}
      <div className="px-6 md:px-10 py-4 flex items-center justify-between">
        <Skeleton className="h-5 w-32" />
        <div className="flex gap-6">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>

      {/* Hero skeleton */}
      <div className="relative min-h-screen flex items-end pb-[15vh] px-6 md:px-10">
        <Skeleton className="absolute inset-0" />
        <div className="relative z-10 w-full max-w-7xl mx-auto space-y-4">
          <Skeleton className="h-16 w-[60%]" />
          <Skeleton className="h-5 w-[40%]" />
          <Skeleton className="h-5 w-[35%]" />
          <Skeleton className="h-12 w-40 rounded-full mt-6" />
        </div>
      </div>

      {/* Services skeleton */}
      <div className="py-24 px-6 md:px-10 bg-muted">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-4 w-20 mb-4" />
          <Skeleton className="h-10 w-[50%] mb-16" />
          <div className="grid grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[3/4]" />
                <Skeleton className="h-4 w-8" />
                <Skeleton className="h-6 w-[70%]" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* About skeleton */}
      <div className="py-24 px-6 md:px-10">
        <div className="max-w-7xl mx-auto grid grid-cols-2 gap-20">
          <Skeleton className="aspect-[4/5]" />
          <div className="space-y-4 flex flex-col justify-center">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-[60%]" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[90%]" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[85%]" />
          </div>
        </div>
      </div>
    </div>
  )
}
