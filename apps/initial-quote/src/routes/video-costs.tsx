import { createFileRoute } from "@tanstack/react-router"
import { DocFrame } from "#/components/doc-frame"

export const Route = createFileRoute("/video-costs")({
  component: VideoCostsPage,
})

function VideoCostsPage() {
  return (
    <DocFrame
      title="Costos de Video Streaming"
      src="/docs/research/VIDEO_STREAMING_COSTS.html"
    />
  )
}
