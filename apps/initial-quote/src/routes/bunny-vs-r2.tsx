import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Separator } from "@repo/ui/components/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@repo/ui/components/table";

export const Route = createFileRoute("/bunny-vs-r2")({
  component: BunnyVsR2Page,
});

type Effort = "low" | "med" | "high";

const effortStyles: Record<Effort, string> = {
  low: "bg-green-100 text-green-800",
  med: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-800",
};

const featureMatrix: {
  feature: string;
  bunny: string;
  bunnyStatus: "included" | "build" | "hard";
  r2: string;
  r2Status: "included" | "build" | "hard";
  effort: string;
  effortLevel: Effort;
}[] = [
  {
    feature: "Upload resumable (TUS)",
    bunny: "Incluido",
    bunnyStatus: "included",
    r2: "Construir",
    r2Status: "build",
    effort: "1-2 días",
    effortLevel: "low",
  },
  {
    feature: "Transcoding multi-resolución",
    bunny: "Incluido (H.264 gratis)",
    bunnyStatus: "included",
    r2: "FFmpeg pipeline",
    r2Status: "hard",
    effort: "4-6 semanas",
    effortLevel: "high",
  },
  {
    feature: "HLS adaptive bitrate",
    bunny: "Incluido",
    bunnyStatus: "included",
    r2: "FFmpeg HLS output",
    r2Status: "build",
    effort: "parte del transcoding",
    effortLevel: "low",
  },
  {
    feature: "CDN global",
    bunny: "114+ PoPs",
    bunnyStatus: "included",
    r2: "Cloudflare 300+ PoPs",
    r2Status: "included",
    effort: "1-2 días",
    effortLevel: "low",
  },
  {
    feature: "Player embebido",
    bunny: "iframe incluido",
    bunnyStatus: "included",
    r2: "hls.js / video.js",
    r2Status: "build",
    effort: "1-2 semanas",
    effortLevel: "med",
  },
  {
    feature: "Personalización del player",
    bunny: "Color, CSS, controles",
    bunnyStatus: "build",
    r2: "Ilimitada (tuyo)",
    r2Status: "included",
    effort: "—",
    effortLevel: "low",
  },
  {
    feature: "Token auth / signed URLs",
    bunny: "Incluido (gratis)",
    bunnyStatus: "included",
    r2: "Cloudflare Worker",
    r2Status: "build",
    effort: "3-5 días",
    effortLevel: "low",
  },
  {
    feature: "Encriptación AES-128",
    bunny: "MediaCage Basic (gratis)",
    bunnyStatus: "included",
    r2: "Construir",
    r2Status: "build",
    effort: "1-2 semanas",
    effortLevel: "med",
  },
  {
    feature: "DRM Widevine + FairPlay",
    bunny: "$99/mes + $0,005/lic",
    bunnyStatus: "build",
    r2: "$10K-$50K setup",
    r2Status: "hard",
    effort: "4-8 semanas",
    effortLevel: "high",
  },
  {
    feature: "Thumbnails automáticos",
    bunny: "Incluido",
    bunnyStatus: "included",
    r2: "FFmpeg extract",
    r2Status: "build",
    effort: "1-2 días",
    effortLevel: "low",
  },
  {
    feature: "Seek preview sprites",
    bunny: "Incluido",
    bunnyStatus: "included",
    r2: "FFmpeg sprites",
    r2Status: "build",
    effort: "3-5 días",
    effortLevel: "low",
  },
  {
    feature: "AI transcripción",
    bunny: "$0,10/min/idioma",
    bunnyStatus: "build",
    r2: "Whisper $0,006/min",
    r2Status: "included",
    effort: "1-2 semanas",
    effortLevel: "med",
  },
  {
    feature: "Auto-traducción (57 idiomas)",
    bunny: "$0,10/min/idioma",
    bunnyStatus: "build",
    r2: "Google Translate / DeepL",
    r2Status: "build",
    effort: "2-3 días",
    effortLevel: "low",
  },
  {
    feature: "Smart chapters (AI)",
    bunny: "Con transcripción",
    bunnyStatus: "included",
    r2: "Desde transcript",
    r2Status: "build",
    effort: "1-3 días",
    effortLevel: "low",
  },
  {
    feature: "Analytics (views/watch time)",
    bunny: "Incluido",
    bunnyStatus: "included",
    r2: "Construir",
    r2Status: "build",
    effort: "1-2 semanas",
    effortLevel: "med",
  },
  {
    feature: "Heatmaps de engagement",
    bunny: "Incluido",
    bunnyStatus: "included",
    r2: "Construir",
    r2Status: "hard",
    effort: "2-3 semanas",
    effortLevel: "high",
  },
  {
    feature: "Watermarking",
    bunny: "Incluido",
    bunnyStatus: "included",
    r2: "FFmpeg overlay",
    r2Status: "build",
    effort: "1-2 días",
    effortLevel: "low",
  },
  {
    feature: "Colecciones / folders",
    bunny: "API incluida",
    bunnyStatus: "included",
    r2: "Construir",
    r2Status: "build",
    effort: "1 semana",
    effortLevel: "med",
  },
  {
    feature: "Webhooks (HMAC-signed)",
    bunny: "Incluido",
    bunnyStatus: "included",
    r2: "Construir",
    r2Status: "build",
    effort: "2-3 días",
    effortLevel: "low",
  },
  {
    feature: "Dashboard de gestión",
    bunny: "Incluido",
    bunnyStatus: "included",
    r2: "Construir",
    r2Status: "hard",
    effort: "2-4 semanas",
    effortLevel: "high",
  },
];

const statusColors = { included: "text-green-700 font-semibold", build: "text-yellow-700", hard: "text-red-700" };

const bunnyFeatures = [
  {
    title: "Upload",
    badge: "Listo",
    badgeVariant: "default" as const,
    items: [
      "TUS resumable: chunk-based, reduce fallas 90%+",
      "HTTP API: PUT con video pre-creado",
      "Pre-signed URLs: upload directo desde browser",
      "Dashboard: drag-and-drop via web UI",
    ],
  },
  {
    title: "Transcoding",
    badge: "Gratis",
    badgeVariant: "default" as const,
    items: [
      "H.264 hasta 1080p: gratis, automático",
      "H.265/HEVC y AV1: premium (contactar ventas)",
      "4K: disponible como upgrade",
      "Auto-selecciona resoluciones del source (no upscale)",
    ],
  },
  {
    title: "Delivery",
    badge: "CDN integrado",
    badgeVariant: "default" as const,
    items: [
      "HLS: M3U8 + segmentos .ts (primario)",
      "MP4 fallback: para dispositivos sin HLS",
      "CDN propio: 114+ PoPs, 6 continentes",
      "Bandwidth: desde $0,005/GB (EU/NA)",
    ],
  },
  {
    title: "Player",
    badge: "Flexible",
    badgeVariant: "secondary" as const,
    items: [
      "iframe embed: listo para usar",
      "Customizable: brand color, CSS, controles",
      "Player.js: control programático",
      "URL HLS directa: usar con hls.js custom",
    ],
  },
];

const bunnySecurityPricing: [string, string][] = [
  ["MediaCage Basic", "AES-128, gratis, incluido"],
  ["MediaCage Enterprise", "Widevine + FairPlay, $99/mes + $0,005/lic"],
  ["Token Auth", "HMAC signed URLs, gratis"],
  ["Domain Restrictions", "Whitelist de referrers, gratis"],
  ["Geo-blocking", "Restricción por país/región"],
];

const bunnyAiFeatures: [string, string][] = [
  ["Transcribe AI", "Speech-to-text automático"],
  ["Auto-traducción", "57 idiomas soportados"],
  ["Smart Chapters", "Generados desde la transcripción"],
  ["Metadata", "Extracción automática del transcript"],
];

const r2Pricing: [string, string][] = [
  ["Storage", "$0,015/GB/mes (S3-compatible)"],
  ["Egress", "$0,00/GB (zero egress fees)"],
  ["Class A ops", "$0,36/millón (writes, lists)"],
  ["Class B ops", "$0,036/millón (reads)"],
  ["Free tier", "10 GB storage, 1M Class A, 10M Class B"],
  ["CDN", "Cloudflare CDN (300+ PoPs) con cache headers"],
  ["Video TOS", "Permitido desde 2023 TOS update"],
];

const r2BuildItems = [
  {
    title: "Transcoding Pipeline",
    effort: "4-6 semanas" as const,
    effortLevel: "high" as Effort,
    items: [
      "Upload handler + job queue",
      "FFmpeg worker para multi-resolución (360p/480p/720p/1080p)",
      "HLS segmentos (4-6 sec chunks) + M3U8 playlists",
      "Master playlist multi-quality",
      "Upload outputs a R2",
      "Error handling + retry logic",
    ],
    extra: [
      ["AWS Lambda", "Cold starts, 15 min timeout, 10 GB temp limit"],
      ["Hetzner dedicado", "$40-80/mes, sin límites, múltiples transcodes"],
      ["AWS MediaConvert", "$0,024/min (SD) a $0,048/min (HD)"],
    ] as [string, string][],
  },
  {
    title: "Custom Player",
    effort: "1-2 semanas" as const,
    effortLevel: "med" as Effort,
    items: [
      "hls.js: lightweight (60 KB gzip), HLS-only",
      "video.js: full-featured, plugin ecosystem",
      "Shaka Player: DASH + HLS + DRM",
      "Quality selector, fullscreen, responsive",
      "Custom skin, chapters, analytics hooks",
    ],
  },
  {
    title: "CDN + Auth",
    effort: "1-2 semanas" as const,
    effortLevel: "med" as Effort,
    items: [
      "Cloudflare CDN (gratis con R2, cache headers)",
      "Worker para validar tokens antes de servir segmentos",
      "Workers Paid plan: ~$5/mes para 10M+ requests",
      "Signed URLs con expiración",
    ],
  },
  {
    title: "DRM",
    effort: "4-8 semanas (full)" as const,
    effortLevel: "high" as Effort,
    extra: [
      ["AES-128 clear-key", "1-2 semanas, previene descarga casual"],
      ["Widevine", "Requiere aprobación de Google + license server"],
      ["FairPlay", "Apple Dev Program ($99/yr) + KSM"],
      ["Self-hosted full", "$10K-$50K setup + $500-$2K/mes"],
      ["Managed (EZDRM, etc.)", "$200-$300/mes + per-license"],
    ] as [string, string][],
  },
  {
    title: "Subtítulos",
    effort: "1-2 semanas" as const,
    effortLevel: "med" as Effort,
    extra: [
      ["Manual VTT/SRT", "1 día (store + serve)"],
      ["Whisper API", "$0,006/min (16x más barato que Bunny)"],
      ["Whisper self-hosted", "Gratis pero requiere GPU"],
      ["Google Speech-to-Text", "$0,006-$0,024/min"],
      ["Deepgram", "$0,0043/min"],
    ] as [string, string][],
  },
  {
    title: "Analytics",
    effort: "3-5 semanas total" as const,
    effortLevel: "high" as Effort,
    items: [
      "Básico (1-2 sem): play/pause/seek events, heartbeats cada 5-10s, views + watch time",
      "Heatmaps (2-3 sem): grabar segmentos vistos, agregar por viewers, visualizar",
      "Alternativa: Mux Data SDK ($0,0025/view) o PostHog",
    ],
  },
];

const costComparison: {
  concept: string;
  bunny: string;
  r2: string;
  bunnyHighlight?: boolean;
  r2Highlight?: boolean;
  r2Warn?: boolean;
  bold?: boolean;
}[] = [
  { concept: "Storage (200 GB)", bunny: "$2,00", r2: "$3,00" },
  { concept: "Bandwidth (500 GB)", bunny: "$2,50", r2: "$0 (zero egress)", r2Highlight: true },
  { concept: "Transcoding", bunny: "$0 (gratis)", r2: "$40-80 (servidor)", bunnyHighlight: true },
  { concept: "CDN / Workers", bunny: "Incluido", r2: "$5" },
  { concept: "Mantenimiento", bunny: "$0", r2: "$1.125-$2.250", bunnyHighlight: true, r2Warn: true },
  { concept: "Total mensual", bunny: "~$4,50", r2: "~$48-$2.338", bold: true },
  { concept: "Desarrollo inicial", bunny: "$0", r2: "$15.000-$30.000", bunnyHighlight: true, r2Warn: true },
];

const devEffort: { component: string; effort: string; effortLevel: Effort; bold?: boolean }[] = [
  { component: "Transcoding pipeline (FFmpeg + queue + storage)", effort: "4-6 semanas", effortLevel: "high" },
  { component: "CDN + token auth Worker", effort: "1-2 semanas", effortLevel: "med" },
  { component: "Custom player (hls.js)", effort: "1-2 semanas", effortLevel: "med" },
  { component: "Thumbnail + preview generation", effort: "3-5 días", effortLevel: "low" },
  { component: "Auto-transcripción (Whisper)", effort: "1-2 semanas", effortLevel: "med" },
  { component: "Analytics básico (views, watch time)", effort: "1-2 semanas", effortLevel: "med" },
  { component: "Engagement heatmaps", effort: "2-3 semanas", effortLevel: "high" },
  { component: "Webhook system", effort: "2-3 días", effortLevel: "low" },
  { component: "DRM AES-128 clear-key", effort: "1-2 semanas", effortLevel: "med" },
  { component: "Colecciones + video management API", effort: "2-3 semanas", effortLevel: "med" },
  { component: "Dashboard de gestión", effort: "2-4 semanas", effortLevel: "high" },
  { component: "Total sin DRM full", effort: "14-22 semanas (3,5-5,5 meses)", effortLevel: "high", bold: true },
  { component: "+ DRM Widevine + FairPlay", effort: "+4-8 semanas (total: 18-30 semanas)", effortLevel: "high" },
];

const bunnyPricing: [string, string, string][] = [
  ["Storage", "$0,01/GB/mes", ""],
  ["Bandwidth EU/NA", "desde $0,005/GB", "Red estándar"],
  ["Bandwidth LATAM", "$0,045/GB", "9x más caro que EU/NA"],
  ["Bandwidth Volume", "$0,005/GB flat", "10 PoPs, menos cobertura LATAM"],
  ["Encoding H.264 (1080p)", "Gratis", ""],
  ["Encoding HEVC/AV1/4K", "Contactar ventas", "Premium"],
  ["MediaCage Basic (AES-128)", "Gratis", "Cifrado dinámico incluido"],
  ["MediaCage Enterprise", "$99/mes + $0,003-0,005/lic", "Widevine + FairPlay"],
  ["Transcribe AI", "$0,10/min/idioma", "Incluye smart chapters"],
  ["Mínimo mensual", "$1/mes", ""],
  ["Trial", "14 días gratis", ""],
];

const recommendation: [string, string][] = [
  [
    "Fase 1",
    "Bunny Stream + hls.js — upload via TUS, transcoding gratuito, CDN incluido, player custom con progress tracking",
  ],
  ["Fase 2", "Token Auth — signed URLs (gratis en Bunny) para proteger el contenido"],
  ["Fase 3", "MediaCage Basic — AES-128 encryption (gratis) para prevenir descarga casual"],
  ["Fase 4", "Transcribe AI — subtítulos automáticos en ES + EN ($0,10/min/idioma)"],
  ["Futuro", "DRM Enterprise — Widevine + FairPlay si el volumen de estudiantes lo justifica ($99/mes+)"],
];

function BunnyVsR2Page() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8 print:hidden">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft data-icon="inline-start" className="size-3.5" />
              Volver al índice
            </Button>
          </Link>
        </div>

        <p className="text-sm text-muted-foreground uppercase tracking-widest mb-3">Investigación Técnica</p>
        <h1 className="font-display text-h1 tracking-tight mb-3">Bunny Stream vs R2 + Self-Built</h1>
        <p className="text-muted-foreground mb-10 max-w-3xl">
          Estudio de features para decidir la infraestructura de video de KMakeup. Bunny Stream ofrece un servicio
          gestionado completo; R2 ofrece storage barato con zero egress pero requiere construir todo el pipeline de
          video.
        </p>

        {/* Key Numbers */}
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-6">
          {[
            { v: "$4,50", l: "Bunny / mes" },
            { v: "$48+", l: "R2 self-built / mes" },
            { v: "0", l: "Semanas dev Bunny" },
            { v: "14-22", l: "Semanas dev R2" },
            { v: "$15K-$30K", l: "Costo dev R2" },
          ].map((s) => (
            <div key={s.l} className="text-center bg-muted p-3">
              <div className="font-display text-2xl">{s.v}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">{s.l}</div>
            </div>
          ))}
        </div>

        <div className="border border-accent bg-accent/20 p-5 mb-12">
          <p className="font-semibold mb-1">Escenario base</p>
          <p className="text-muted-foreground">
            100 cursos, 500 estudiantes, 200 GB de video almacenado, 500 GB/mes de bandwidth, 100 horas de contenido
            total.
          </p>
        </div>

        {/* Feature Matrix */}
        <h2 className="font-display text-h2 mb-4">Matriz de Paridad de Features</h2>
        <Separator className="mb-4" />
        <div className="mb-12 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead>Feature</TableHead>
                <TableHead className="text-center">Bunny Stream</TableHead>
                <TableHead className="text-center">R2 + Self-Built</TableHead>
                <TableHead className="text-center">Esfuerzo para paridad</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {featureMatrix.map((f) => (
                <TableRow key={f.feature}>
                  <TableCell className="font-medium">{f.feature}</TableCell>
                  <TableCell className={`text-center ${statusColors[f.bunnyStatus]}`}>{f.bunny}</TableCell>
                  <TableCell className={`text-center ${statusColors[f.r2Status]}`}>{f.r2}</TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${effortStyles[f.effortLevel]}`}
                    >
                      {f.effort}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Bunny Features Detail */}
        <h2 className="font-display text-h2 mb-4">Detalle de Features: Bunny Stream</h2>
        <Separator className="mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {bunnyFeatures.map((f) => (
            <div key={f.title} className="bg-muted p-5">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="font-semibold">{f.title}</h3>
                <Badge variant={f.badgeVariant}>{f.badge}</Badge>
              </div>
              <ul className="space-y-1.5 text-muted-foreground">
                {f.items.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-foreground shrink-0 mt-0.5">—</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-muted p-5">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="font-semibold">Seguridad</h3>
              <Badge>Multi-capa</Badge>
            </div>
            <Table>
              <TableBody>
                {bunnySecurityPricing.map(([item, desc]) => (
                  <TableRow key={item}>
                    <TableCell className="font-medium w-1/3">{item}</TableCell>
                    <TableCell className="text-muted-foreground">{desc}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="bg-muted p-5">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="font-semibold">AI Features</h3>
              <Badge variant="secondary">$0,10/min</Badge>
            </div>
            <Table>
              <TableBody>
                {bunnyAiFeatures.map(([item, desc]) => (
                  <TableRow key={item}>
                    <TableCell className="font-medium w-1/3">{item}</TableCell>
                    <TableCell className="text-muted-foreground">{desc}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <p className="text-muted-foreground mt-3 text-sm">
              <strong className="text-foreground">Costo:</strong> $0,10/min/idioma. 100 horas de contenido en 2 idiomas
              = $1.200 (one-time).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          <div className="bg-muted p-5">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="font-semibold">Analytics</h3>
              <Badge>Incluido</Badge>
            </div>
            <ul className="space-y-1.5 text-muted-foreground">
              {[
                "Views: plays por sesión de viewer",
                "Watch time: acumulado, por hora/día (UTC)",
                "Engagement heatmap: secciones vistas/revistas y drop-offs",
                "Engagement score: 0-100, API-only",
                "Geografía: datos a nivel de país",
                "API access: todos los stats via REST",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-foreground shrink-0 mt-0.5">—</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-muted p-5">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="font-semibold">Extras</h3>
              <Badge>Incluido</Badge>
            </div>
            <ul className="space-y-1.5 text-muted-foreground">
              {[
                "Thumbnails: automáticos en timestamp configurable",
                "Seek preview: sprite sheets para scrub",
                "Watermarking: logo overlay quemado en video",
                "Colecciones: carpetas dentro de libraries",
                "Webhooks: encoding started/finished/failed, HMAC-SHA256",
                "Custom thumbnails: upload via API",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-foreground shrink-0 mt-0.5">—</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* R2 Detail */}
        <h2 className="font-display text-h2 mb-4">Detalle: R2 + Self-Built Pipeline</h2>
        <Separator className="mb-4" />
        <div className="bg-muted p-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="font-semibold">Lo que R2 provee</h3>
            <Badge variant="secondary">Solo storage</Badge>
          </div>
          <Table>
            <TableBody>
              {r2Pricing.map(([item, desc]) => (
                <TableRow key={item}>
                  <TableCell className="font-medium w-1/3">{item}</TableCell>
                  <TableCell className="text-muted-foreground">{desc}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <h3 className="font-semibold mb-4">Lo que tendrías que construir</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {r2BuildItems.map((b) => (
            <div key={b.title} className="bg-muted p-5">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="font-semibold">{b.title}</h3>
                <span
                  className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${effortStyles[b.effortLevel]}`}
                >
                  {b.effort}
                </span>
              </div>
              {b.items && (
                <ul className="space-y-1.5 text-muted-foreground">
                  {b.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="text-foreground shrink-0 mt-0.5">—</span>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
              {b.extra && (
                <Table>
                  <TableBody>
                    {b.extra.map(([item, desc]) => (
                      <TableRow key={item}>
                        <TableCell className="font-medium w-2/5">{item}</TableCell>
                        <TableCell className="text-muted-foreground">{desc}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          ))}
        </div>

        {/* Cost Comparison */}
        <h2 className="font-display text-h2 mb-4">Comparación de Costos Mensuales</h2>
        <Separator className="mb-4" />
        <div className="mb-4">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead>Concepto</TableHead>
                <TableHead>Bunny Stream</TableHead>
                <TableHead>R2 + Self-Built</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {costComparison.map((row) => (
                <TableRow key={row.concept} className={row.bold ? "bg-muted font-bold" : ""}>
                  <TableCell className="font-medium">{row.concept}</TableCell>
                  <TableCell className={row.bunnyHighlight ? "text-green-700 font-semibold" : ""}>
                    {row.bunny}
                  </TableCell>
                  <TableCell
                    className={row.r2Warn ? "text-red-700" : row.r2Highlight ? "text-green-700 font-semibold" : ""}
                  >
                    {row.r2}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="border border-accent bg-accent/20 p-5 mb-12">
          <p className="text-muted-foreground text-sm">
            <strong className="text-foreground">Nota sobre mantenimiento R2:</strong> El rango $1.125-$2.250/mes asume
            tarifa de contractor a $75/hr para 15-30 horas mensuales de: actualizaciones FFmpeg, patches de codecs,
            monitoreo de infra, compatibilidad browser del player, security patches y edge cases.
          </p>
        </div>

        {/* Dev Effort */}
        <h2 className="font-display text-h2 mb-4">Esfuerzo Total de Desarrollo (R2)</h2>
        <Separator className="mb-4" />
        <div className="mb-12">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead>Componente</TableHead>
                <TableHead>Esfuerzo estimado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {devEffort.map((row) => (
                <TableRow key={row.component} className={row.bold ? "bg-muted" : ""}>
                  <TableCell className={`font-medium ${row.bold ? "font-bold" : ""}`}>{row.component}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${effortStyles[row.effortLevel]}`}
                    >
                      {row.effort}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Advantages */}
        <h2 className="font-display text-h2 mb-4">Ventajas Competitivas por Opción</h2>
        <Separator className="mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          <div className="bg-muted p-5 ring-1 ring-green-200">
            <h3 className="font-semibold text-green-700 mb-3">Bunny Stream gana en</h3>
            <ul className="space-y-1.5 text-muted-foreground">
              {[
                "Time-to-market: 0 semanas vs 14-22 semanas",
                "Costo mensual: ~$4,50 vs $48-$2.338",
                "Cero mantenimiento de infraestructura de video",
                "AI features listas: transcripción, chapters, traducción 57 idiomas",
                "Analytics con heatmaps sin construir nada",
                "DRM disponible como upgrade cuando se necesite",
                "Webhooks para sincronizar estado con tu backend",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-foreground shrink-0 mt-0.5">—</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-muted p-5">
            <h3 className="font-semibold mb-3">R2 + Self-Built gana en</h3>
            <ul className="space-y-1.5 text-muted-foreground">
              {[
                "Control total del player: UX diferenciada, integración directa con progress tracking",
                "Zero egress: a escala masiva (10K+ usuarios) esto importa",
                "Sin vendor lock-in: puedes migrar libremente",
                "Transcripción 16x más barata: Whisper $0,006 vs Bunny $0,10/min",
                "Sin límites de personalización: cualquier feature imaginable",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-foreground shrink-0 mt-0.5">—</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bunny Pricing */}
        <h2 className="font-display text-h2 mb-4">Bunny Stream: Pricing Detallado</h2>
        <Separator className="mb-4" />
        <div className="mb-12">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead>Componente</TableHead>
                <TableHead>Costo</TableHead>
                <TableHead>Notas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bunnyPricing.map(([component, cost, note]) => (
                <TableRow key={component}>
                  <TableCell className="font-medium">{component}</TableCell>
                  <TableCell className={cost === "Gratis" ? "text-green-700 font-semibold" : ""}>{cost}</TableCell>
                  <TableCell className="text-muted-foreground">{note}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* API Coverage */}
        <h2 className="font-display text-h2 mb-4">Bunny Stream: API Coverage</h2>
        <Separator className="mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {[
            {
              title: "Videos",
              items: [
                "Create / Upload (HTTP + TUS)",
                "Update / Delete",
                "List / Get",
                "Reencode",
                "Set thumbnail time",
                "Upload custom thumbnail",
              ],
            },
            { title: "Colecciones", items: ["Create / Update / Delete", "List / Get", "Assign videos"] },
            {
              title: "Otros",
              items: [
                "Captions: add/delete per-language",
                "Statistics: video + library stats",
                "Webhooks: per-library URL",
                "Auth: API key via AccessKey header",
              ],
            },
          ].map((g) => (
            <div key={g.title} className="bg-muted p-5">
              <h3 className="font-semibold mb-3">{g.title}</h3>
              <ul className="space-y-1.5 text-muted-foreground">
                {g.items.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-foreground shrink-0 mt-0.5">—</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Hybrid Recommendation */}
        <h2 className="font-display text-h2 mb-4">Ruta Híbrida: Lo Mejor de Ambos</h2>
        <Separator className="mb-4" />
        <div className="bg-muted/50 border border-green-200 p-5 mb-6">
          <p className="font-semibold mb-2">Bunny Stream + hls.js custom player</p>
          <p className="text-muted-foreground mb-3">
            Bunny expone la URL HLS directa de cada video. Esto permite usar Bunny para todo el backend (upload,
            transcoding, CDN, DRM, analytics) pero renderizar el video con un player hls.js propio para:
          </p>
          <ul className="space-y-1.5 text-muted-foreground">
            {[
              "Progress tracking por segundo (integrado con Convex)",
              "UI del player 100% alineada con el design system de KMakeup",
              "Auto-advance entre lecciones",
              "Resume desde última posición",
              "Chapters interactivos en el player",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-foreground shrink-0 mt-0.5">—</span>
                {item}
              </li>
            ))}
          </ul>
          <p className="text-muted-foreground mt-3">
            <strong className="text-foreground">Costo:</strong> $4,50/mes (Bunny) + 1-2 semanas de desarrollo del player
            custom. Sin pipeline de transcoding, sin mantenimiento de infra.
          </p>
        </div>

        <div className="bg-muted ring-1 ring-green-200 p-5 mb-12">
          <h3 className="font-semibold text-green-700 mb-3">Plan de Implementación Recomendado</h3>
          <Table>
            <TableBody>
              {recommendation.map(([phase, desc]) => (
                <TableRow key={phase}>
                  <TableCell className="font-medium w-20">{phase}</TableCell>
                  <TableCell className="text-muted-foreground">{desc}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <footer className="border-t border-border pt-8 mt-14 text-center text-sm text-muted-foreground">
          <p>Investigación realizada para KMakeup Platform · Datos actualizados a junio 2026</p>
          <p className="mt-2">
            Ver también:{" "}
            <Link to="/video-costs" className="text-foreground underline underline-offset-2 hover:opacity-70">
              Costos de Video Streaming
            </Link>
            {" · "}
            <Link to="/bunny-roadmap" className="text-foreground underline underline-offset-2 hover:opacity-70">
              Roadmap Bunny Stream
            </Link>
          </p>
          <p className="mt-2">
            Preparado por{" "}
            <a
              href="https://github.com/demarchenac"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground font-semibold hover:opacity-70 transition-opacity"
            >
              Cristhian De Marchena
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
