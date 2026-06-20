import { useEffect, useRef, useState } from "react";

import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  theme: "base",
  themeVariables: {
    primaryColor: "#ECDFD4",
    primaryTextColor: "#2B2626",
    primaryBorderColor: "rgba(43,38,38,0.25)",
    secondaryColor: "#F3ECE6",
    tertiaryColor: "#F6F3EE",
    lineColor: "rgba(43,38,38,0.4)",
    textColor: "#2B2626",
    fontSize: "13px",
    fontFamily: "Inter, sans-serif",
    noteTextColor: "rgba(43,38,38,0.6)",
    noteBkgColor: "#F3ECE6",
    noteBorderColor: "rgba(43,38,38,0.15)",
    actorBkg: "#ECDFD4",
    actorBorder: "rgba(43,38,38,0.25)",
    actorTextColor: "#2B2626",
    signalColor: "#2B2626",
    signalTextColor: "#2B2626",
    labelBoxBkgColor: "#ECDFD4",
    labelBoxBorderColor: "rgba(43,38,38,0.25)",
    labelTextColor: "#2B2626",
    activationBkgColor: "#F3ECE6",
    activationBorderColor: "rgba(43,38,38,0.25)",
  },
});

let mermaidCounter = 0;

export function Mermaid({ chart, caption }: { chart: string; caption?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState("");
  const [id] = useState(() => `mermaid-${++mermaidCounter}`);

  useEffect(() => {
    let cancelled = false;

    mermaid.render(id, chart.trim()).then((result) => {
      if (!cancelled) setSvg(result.svg);
    });

    return () => {
      cancelled = true;
    };
  }, [chart, id]);

  return (
    <div className="my-6">
      <div
        ref={containerRef}
        className="bg-white border border-border rounded-sm p-6 overflow-x-auto [&_svg]:mx-auto [&_svg]:max-w-full"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: mermaid SVG output
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      {caption && <p className="text-xs text-muted-foreground mt-2 text-center">{caption}</p>}
    </div>
  );
}
