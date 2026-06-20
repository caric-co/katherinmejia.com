import { useState } from "react";

import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ChevronDown } from "lucide-react";

import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Separator } from "@repo/ui/components/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@repo/ui/components/table";

import { Mermaid } from "#/components/mermaid";

export const Route = createFileRoute("/media-platform")({
  component: MediaPlatformPage,
});

const modules = [
  {
    id: "storage",
    name: "Storage",
    description:
      "Object storage abstraction. Upload, organize, delete files. Presigned URLs for direct browser upload.",
    tiers: {
      lab: "R2 Standard, presigned URLs",
      small: "R2 + lifecycle policies (IA tier for old content)",
      medium: "R2 multi-region, cache warming",
    },
    cost: "$0.015/GB",
    dependencies: [],
    required: true,
  },
  {
    id: "upload",
    name: "Upload",
    description:
      "Presigned URL generation + optional TUS resumable for large files. Progress tracking, format validation, size limits.",
    tiers: {
      lab: "Presigned PUT (simple, archivos < 500 MB)",
      small: "TUS resumable (archivos grandes, conexiones inestables)",
      medium: "TUS + multipart parallel upload",
    },
    cost: "$0 (parte de R2)",
    dependencies: ["storage"],
    required: true,
  },
  {
    id: "transcode",
    name: "Transcode",
    description:
      "Convertir video source a HLS segmentado. Single-bitrate (copiar y segmentar) o multi-bitrate (transcodificar a múltiples calidades).",
    tiers: {
      lab: "Segment-only (ffmpeg -c copy, segundos, Lambda/Cloud Run)",
      small: "Multi-bitrate burst (Cloud Run Jobs, $0.10/video)",
      medium: "Multi-bitrate dedicado (Hetzner VPS, $57/mes)",
    },
    cost: "$0.001-0.15/video",
    dependencies: ["storage"],
    required: false,
  },
  {
    id: "delivery",
    name: "Delivery",
    description:
      "CDN serving con auth opcional. Contenido público (thumbnails, imágenes) o protegido (videos, adjuntos premium).",
    tiers: {
      lab: "Presigned URLs directas a R2 (4h expiry)",
      small: "Cloudflare Worker JWT ($5/mes) para HLS multi-segment",
      medium: "Worker + KV cache + rate limiting",
    },
    cost: "$0-5/mes",
    dependencies: ["storage"],
    required: true,
  },
  {
    id: "captions",
    name: "Captions",
    description:
      "Transcripción automática (speech-to-text) + traducción. Genera archivos VTT/SRT almacenados junto al video.",
    tiers: {
      lab: "AssemblyAI API ($0.0025/min) o upload manual de VTT",
      small: "Whisper self-hosted GPU spot ($0.003/min)",
      medium: "Whisper dedicado + cache de traducciones",
    },
    cost: "$0.003-0.10/min",
    dependencies: ["storage"],
    required: false,
  },
  {
    id: "images",
    name: "Image Processing",
    description: "Resize, crop, format conversion (WebP/AVIF) on-the-fly o en upload. Thumbnails automáticos de video.",
    tiers: {
      lab: "Client-side resize antes de upload (browser Canvas API)",
      small: "Cloudflare Images ($5/100K) o sharp en Cloud Run",
      medium: "Pipeline de procesamiento con variantes pre-generadas",
    },
    cost: "$0-5/mes",
    dependencies: ["storage"],
    required: false,
  },
  {
    id: "progress",
    name: "Progress Tracking",
    description:
      "Seguimiento de reproducción por segundo. Debounce, resume, completion detection. Para plataformas de cursos/e-learning.",
    tiers: {
      lab: "Directo a DB (Convex/Supabase) con debounce 10s",
      small: "Redis/Upstash como buffer + batch sync a DB",
      medium: "Redis + cron batch + analytics pipeline",
    },
    cost: "$0-10/mes",
    dependencies: [],
    required: false,
  },
  {
    id: "analytics",
    name: "Media Analytics",
    description:
      "Views, watch time, engagement heatmaps, buffering metrics, quality switches. Pipeline de eventos del player.",
    tiers: {
      lab: "Eventos básicos a PostHog (views, completion)",
      small: "Pipeline custom: player events → ClickHouse/Tinybird",
      medium: "Full analytics: heatmaps, retention curves, A/B de thumbnails",
    },
    cost: "$0-50/mes",
    dependencies: ["progress"],
    required: false,
  },
];

const competitorComparison: {
  feature: string;
  thisProject: string;
  bunny: string;
  mux: string;
  uploadthing: string;
}[] = [
  { feature: "Video transcoding", thisProject: "FFmpeg (tuyo)", bunny: "Incluido", mux: "Incluido", uploadthing: "No" },
  { feature: "HLS streaming", thisProject: "R2 + CDN", bunny: "Incluido", mux: "Incluido", uploadthing: "No" },
  {
    feature: "File hosting",
    thisProject: "Mismo R2",
    bunny: "Bunny Storage (separado)",
    mux: "No",
    uploadthing: "Incluido",
  },
  { feature: "Image processing", thisProject: "Configurable", bunny: "Bunny Optimizer", mux: "No", uploadthing: "No" },
  {
    feature: "Auth/DRM",
    thisProject: "Worker JWT / presigned",
    bunny: "Token + MediaCage",
    mux: "Signed URLs + DRM",
    uploadthing: "No",
  },
  {
    feature: "Transcription",
    thisProject: "Configurable (AssemblyAI/Whisper)",
    bunny: "Transcribe AI ($0.10/min)",
    mux: "Auto captions",
    uploadthing: "No",
  },
  { feature: "Progress tracking", thisProject: "Incluido", bunny: "No", mux: "Mux Data ($)", uploadthing: "No" },
  {
    feature: "Egress cost",
    thisProject: "$0 (R2)",
    bunny: "$0.005-0.045/GB",
    mux: "$0.001/min",
    uploadthing: "Incluido",
  },
  { feature: "Vendor lock-in", thisProject: "Ninguno", bunny: "Medio", mux: "Alto", uploadthing: "Medio" },
  { feature: "Self-hostable", thisProject: "Sí", bunny: "No", mux: "No", uploadthing: "No" },
];

const kickoffScope = [
  {
    module: "Storage",
    kickoff: "R2 client wrapper, presigned URL generation, path conventions",
    futureWork: "Multi-region, lifecycle policies, IA tier",
    priority: "P0",
  },
  {
    module: "Upload",
    kickoff: "Presigned PUT para archivos < 500 MB, React upload component con progress",
    futureWork: "TUS resumable, multipart parallel, drag-drop zones",
    priority: "P0",
  },
  {
    module: "Transcode",
    kickoff: "Single-bitrate HLS (segment-only via Cloud Run / Lambda)",
    futureWork: "Multi-bitrate, quality presets, thumbnail extraction",
    priority: "P0",
  },
  {
    module: "Delivery",
    kickoff: "Presigned URLs para videos, URLs públicas para assets estáticos",
    futureWork: "Worker JWT, KV cache, rate limiting, geo-restrictions",
    priority: "P0",
  },
  {
    module: "Captions",
    kickoff: "AssemblyAI integration (API call, store VTT en R2), Whisper translate mode para EN",
    futureWork: "Whisper self-hosted, multi-language, smart chapters",
    priority: "P0",
  },
  {
    module: "Images",
    kickoff: "Client-side resize + WebP conversion (Canvas API) antes de upload a R2",
    futureWork: "Server-side processing, variantes automáticas, AVIF",
    priority: "P0",
  },
  {
    module: "Progress",
    kickoff: "useProgressTracker hook: debounce 10s → Convex mutation",
    futureWork: "Redis buffer, batch sync, resume cross-device",
    priority: "P0",
  },
  {
    module: "Analytics",
    kickoff: "Eventos básicos a PostHog (view, complete, drop-off)",
    futureWork: "Heatmaps, retention, buffering metrics, dashboard",
    priority: "P2",
  },
];

const pricingModel = [
  {
    tier: "Free / Lab",
    storage: "10 GB",
    transcode: "Segment-only",
    delivery: "Presigned URLs",
    extras: "—",
    price: "$0/mes (R2 free tier)",
  },
  {
    tier: "Starter",
    storage: "100 GB",
    transcode: "Multi-bitrate burst",
    delivery: "Worker JWT",
    extras: "Captions (100 min)",
    price: "~$7/mes (R2 + Worker)",
  },
  {
    tier: "Pro",
    storage: "1 TB",
    transcode: "Multi-bitrate burst",
    delivery: "Worker JWT + KV",
    extras: "Captions, images, progress",
    price: "~$25/mes",
  },
  {
    tier: "Scale",
    storage: "10+ TB",
    transcode: "Dedicado",
    delivery: "Worker + custom rules",
    extras: "Todo + analytics",
    price: "~$100+/mes",
  },
];

const phases = [
  {
    n: 1,
    title: "Core: Storage + Upload + Delivery",
    hours: "~15h",
    description:
      "La base que todo lo demás usa. R2 wrapper, presigned URLs, upload component, path conventions. Suficiente para servir archivos estáticos (thumbnails, PDFs, imágenes).",
    items: [
      "R2 client: createPresignedUploadUrl(), createPresignedGetUrl(), deleteObject(), listObjects()",
      "Path conventions: /{project}/{type}/{id}/{filename} (e.g. /kmakeup/thumbs/curso-1/cover.webp)",
      "React upload component: drag-drop zone, progress bar, format validation, size limits",
      "Public delivery: URLs directas al CDN para assets públicos (thumbnails, blog images)",
      "Protected delivery: presigned URLs con expiración para contenido de pago",
      "Convex integration: actions para generar URLs, mutations para guardar paths",
    ],
  },
  {
    n: 2,
    title: "Video: Transcode + HLS",
    hours: "~20h",
    description:
      "Pipeline de video: segmentar (single-bitrate) o transcodificar (multi-bitrate). HLS playlists. Thumbnail extraction. Webhook de completion.",
    items: [
      "Segment-only mode: ffmpeg -c copy -hls_time 4 (Cloud Run Job, segundos por video)",
      "Multi-bitrate mode: ffmpeg multi-pass a 1080p/720p/480p (Cloud Run Job, 20-60 min)",
      "Master playlist generation (master.m3u8 con variantes de calidad)",
      "Thumbnail extraction automática del primer keyframe",
      "Job queue: Convex action → trigger Cloud Run/Lambda → webhook completion",
      "Config: TRANSCODE_MODE env var (segment-only | burst | dedicated)",
      "hls.js player component: quality selector, keyboard shortcuts, responsive, Safari fallback",
    ],
  },
  {
    n: 3,
    title: "Auth: Worker JWT",
    hours: "~8h",
    description:
      "Cloudflare Worker que valida JWT antes de servir contenido protegido. Se activa con una env var. Sin ella, delivery usa presigned URLs.",
    items: [
      "Cloudflare Worker: validar JWT signature, expiración, claims (userId, lessonId)",
      "JWT generation en Convex: signJWT({userId, lessonId, exp: 4h})",
      "Domain restrictions: allowlist en Worker config",
      "Config: AUTH_MODE env var (presigned | worker)",
      "KV cache para tokens revocados (opcional, Tier 2+)",
    ],
  },
  {
    n: 4,
    title: "Captions + Progress",
    hours: "~10h",
    description:
      "Transcripción automática + progress tracking. Los dos features más importantes para plataformas de cursos.",
    items: [
      "AssemblyAI integration: submit audio URL → poll status → download VTT → store en R2",
      "Whisper translate mode: audio ES → text EN (gratis, incluido en transcripción)",
      "Player caption support: selector ES/EN/Off, WebVTT rendering",
      "useProgressTracker: timeupdate listener, 10s debounce, Convex mutation, resume, beforeunload",
      "Auto-complete: marca lección completada cuando watchedSeconds >= 90% duration",
      "Auto-advance: countdown 3s al terminar → siguiente lección",
    ],
  },
  {
    n: 5,
    title: "Extract + Package",
    hours: "~12h",
    description: "Extraer los módulos de KMakeup como paquetes reutilizables. Documentación, tipos, ejemplos.",
    items: [
      "packages/media-core: R2 client, path conventions, types, config schema",
      "packages/media-react: upload component, video player, progress tracker, caption selector",
      "packages/media-worker: Cloudflare Worker para JWT auth (wrangler template)",
      "packages/media-transcode: Cloud Run Job template + FFmpeg presets",
      "README con quickstart: npm install → config → upload → serve",
      "Ejemplo de configuración por tier (env vars)",
    ],
  },
];

const nameCandidates = [
  { name: "streamkit", domain: "streamkit.dev", note: "Claro, dev-friendly" },
  { name: "mediaforge", domain: "mediaforge.io", note: "Forjar tu propia infra" },
  { name: "cloudmux", domain: "cloudmux.dev", note: "Multiplexar media en la nube" },
  { name: "mediapipe", domain: "—", note: "Existe (Google)" },
  { name: "uploadkit", domain: "uploadkit.dev", note: "Foco en upload + delivery" },
  { name: "@carico/media", domain: "—", note: "Scope de la org, npm package" },
];

function MediaPlatformPage() {
  const [openPhases, setOpenPhases] = useState<Set<number>>(new Set([1]));

  const togglePhase = (n: number) => {
    setOpenPhases((prev) => {
      const next = new Set(prev);
      if (next.has(n)) next.delete(n);
      else next.add(n);
      return next;
    });
  };

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

        <p className="text-sm text-muted-foreground uppercase tracking-widest mb-3">Exploración de Producto</p>
        <h1 className="font-display text-h1 tracking-tight mb-3">Media Infrastructure Platform</h1>
        <p className="text-muted-foreground mb-10 max-w-3xl">
          Un sistema modular de infraestructura de medios que escala de $0 a petabytes. Construido sobre Cloudflare R2
          (zero egress). Cada feature se activa/desactiva con una env var. Pay what you use, build what you need.
        </p>

        {/* Vision */}
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-6">
          {[
            { v: "8", l: "Módulos" },
            { v: "3", l: "Tiers" },
            { v: "$0", l: "Egress" },
            { v: "~65h", l: "Kickoff" },
            { v: "1", l: "Primer cliente" },
          ].map((s) => (
            <div key={s.l} className="text-center bg-muted p-3">
              <div className="font-display text-2xl">{s.v}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">{s.l}</div>
            </div>
          ))}
        </div>

        <div className="border border-accent bg-accent/20 p-5 mb-12">
          <p className="font-semibold mb-1">Tesis</p>
          <p className="text-muted-foreground">
            Cada proyecto de Carico que tenga contenido multimedia necesita lo mismo: upload, storage, delivery, y
            opcionalmente video transcoding, captions, y progress tracking. En vez de reconstruirlo cada vez o pagar
            servicios managed (Bunny, Mux, UploadThing), construimos la infraestructura una vez como módulos
            configurables sobre R2. KMakeup es el primer cliente y el terreno de pruebas. Cuando esté probado en
            producción, se extrae como producto independiente.
          </p>
        </div>

        {/* ========== CONCEPT ========== */}
        <h2 className="font-display text-h2 mb-4">El Concepto</h2>
        <Separator className="mb-4" />

        <p className="text-muted-foreground mb-4">
          No es un SaaS. No es un servicio managed. Es un{" "}
          <strong className="text-foreground">kit de infraestructura</strong> que te da las piezas para construir tu
          propia plataforma de medios, con tu propia cuenta de Cloudflare, tu propio R2, tu propio dominio. Tú controlas
          los datos, los costos, y la escala.
        </p>

        <Mermaid
          chart={`
flowchart TB
    subgraph SDK["Media Infrastructure Kit"]
        direction TB
        CORE["Core\nStorage + Upload + Delivery"]
        VIDEO["Video\nTranscode + HLS + Player"]
        AUTH["Auth\nWorker JWT + Presigned"]
        CAPTIONS["Captions\nSTT + Translation"]
        IMAGES["Images\nResize + Optimize"]
        PROGRESS["Progress\nTracking + Resume"]
        ANALYTICS["Analytics\nEvents + Heatmaps"]
    end

    subgraph INFRA["Tu Infraestructura (pay what you use)"]
        R2["Cloudflare R2\n$0.015/GB, $0 egress"]
        WORKER["CF Worker\n$5/mes (opcional)"]
        COMPUTE["Cloud Run / Lambda\npay-per-use (opcional)"]
    end

    subgraph APPS["Tus Proyectos"]
        APP1["KMakeup\n(cursos de maquillaje)"]
        APP2["Portfolio App\n(fotografía)"]
        APP3["Podcast Platform\n(audio)"]
    end

    CORE --> R2
    VIDEO --> COMPUTE
    AUTH --> WORKER
    CAPTIONS --> COMPUTE

    SDK --> APP1
    SDK --> APP2
    SDK --> APP3
          `}
          caption="Un kit, múltiples proyectos. Cada proyecto configura qué módulos usa."
        />

        {/* ========== MODULES ========== */}
        <h2 className="font-display text-h2 mb-4">Módulos</h2>
        <Separator className="mb-4" />

        <p className="text-muted-foreground mb-4">
          Cada módulo es independiente. Solo <strong className="text-foreground">Storage</strong>,{" "}
          <strong className="text-foreground">Upload</strong>, y <strong className="text-foreground">Delivery</strong>{" "}
          son requeridos. El resto se activa según necesidad.
        </p>

        <div className="mb-8 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead>Módulo</TableHead>
                <TableHead>Lab</TableHead>
                <TableHead>Small</TableHead>
                <TableHead>Medium+</TableHead>
                <TableHead>Costo base</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {modules.map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="font-medium">
                    {m.name}
                    {m.required && (
                      <Badge className="ml-2" variant="secondary">
                        core
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{m.tiers.lab}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{m.tiers.small}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{m.tiers.medium}</TableCell>
                  <TableCell className="text-sm">{m.cost}</TableCell>
                  <TableCell>
                    {m.dependencies.length > 0 && (
                      <span className="text-xs text-muted-foreground">dep: {m.dependencies.join(", ")}</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Config example */}
        <h3 className="font-semibold mb-3">Ejemplo de configuración</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="bg-muted p-4">
            <p className="font-semibold text-sm mb-2">Plataforma de cursos</p>
            <div className="text-xs font-mono space-y-1 text-muted-foreground">
              <p className="text-green-700">storage: true</p>
              <p className="text-green-700">upload: true</p>
              <p className="text-green-700">transcode: "burst"</p>
              <p className="text-green-700">delivery: "worker"</p>
              <p className="text-green-700">captions: "assemblyai"</p>
              <p className="text-green-700">progress: true</p>
              <p className="text-muted-foreground">images: false</p>
              <p className="text-muted-foreground">analytics: false</p>
            </div>
          </div>
          <div className="bg-muted p-4">
            <p className="font-semibold text-sm mb-2">Portfolio de fotografía</p>
            <div className="text-xs font-mono space-y-1 text-muted-foreground">
              <p className="text-green-700">storage: true</p>
              <p className="text-green-700">upload: true</p>
              <p className="text-muted-foreground">transcode: false</p>
              <p className="text-green-700">delivery: "presigned"</p>
              <p className="text-muted-foreground">captions: false</p>
              <p className="text-muted-foreground">progress: false</p>
              <p className="text-green-700">images: "cloudrun"</p>
              <p className="text-muted-foreground">analytics: false</p>
            </div>
          </div>
          <div className="bg-muted p-4">
            <p className="font-semibold text-sm mb-2">Podcast platform</p>
            <div className="text-xs font-mono space-y-1 text-muted-foreground">
              <p className="text-green-700">storage: true</p>
              <p className="text-green-700">upload: "tus"</p>
              <p className="text-muted-foreground">transcode: false</p>
              <p className="text-green-700">delivery: "presigned"</p>
              <p className="text-green-700">captions: "whisper"</p>
              <p className="text-green-700">progress: true</p>
              <p className="text-muted-foreground">images: false</p>
              <p className="text-green-700">analytics: true</p>
            </div>
          </div>
        </div>

        {/* ========== VS COMPETITION ========== */}
        <h2 className="font-display text-h2 mb-4">vs. Competencia</h2>
        <Separator className="mb-4" />

        <div className="mb-8 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead>Feature</TableHead>
                <TableHead>Este proyecto</TableHead>
                <TableHead>Bunny Stream</TableHead>
                <TableHead>Mux</TableHead>
                <TableHead>UploadThing</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {competitorComparison.map((row) => (
                <TableRow key={row.feature}>
                  <TableCell className="font-medium">{row.feature}</TableCell>
                  <TableCell>{row.thisProject}</TableCell>
                  <TableCell className="text-muted-foreground">{row.bunny}</TableCell>
                  <TableCell className="text-muted-foreground">{row.mux}</TableCell>
                  <TableCell className="text-muted-foreground">{row.uploadthing}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          <div className="bg-muted p-4">
            <p className="font-semibold text-sm mb-2">Diferenciadores clave</p>
            <ul className="text-muted-foreground text-sm space-y-1.5">
              <li>
                — <strong className="text-foreground">$0 egress</strong>: R2 zero egress vs Bunny $0.005-0.045/GB vs Mux
                per-minute
              </li>
              <li>
                — <strong className="text-foreground">Modular</strong>: activa solo lo que necesitas, no pagas por
                features que no usas
              </li>
              <li>
                — <strong className="text-foreground">Self-hosted</strong>: tu R2, tu Worker, tus datos. Sin vendor
                lock-in
              </li>
              <li>
                — <strong className="text-foreground">Full-stack</strong>: video + archivos + imágenes + captions en un
                solo kit
              </li>
              <li>
                — <strong className="text-foreground">Progressive</strong>: escala de $0 a enterprise con env vars
              </li>
            </ul>
          </div>
          <div className="bg-muted p-4">
            <p className="font-semibold text-sm mb-2">Trade-offs honestos</p>
            <ul className="text-muted-foreground text-sm space-y-1.5">
              <li>
                — <strong className="text-foreground">Más setup</strong>: necesitas cuenta de Cloudflare, configurar R2,
                deployar Worker
              </li>
              <li>
                — <strong className="text-foreground">Mantenimiento</strong>: actualizaciones de FFmpeg, browser compat
                del player, etc.
              </li>
              <li>
                — <strong className="text-foreground">Sin dashboard managed</strong>: no hay UI de admin como Bunny/Mux
                (a menos que la construyas)
              </li>
              <li>
                — <strong className="text-foreground">Sin DRM enterprise</strong>: Widevine/FairPlay requiere licencias
                separadas
              </li>
              <li>
                — <strong className="text-foreground">Soporte eres tú</strong>: no hay equipo de soporte detrás, es tu
                infra
              </li>
            </ul>
          </div>
        </div>

        {/* ========== PRICING MODEL ========== */}
        <h2 className="font-display text-h2 mb-4">Modelo de Pricing (Pay What You Use)</h2>
        <Separator className="mb-4" />

        <p className="text-muted-foreground mb-4">
          El kit es open-source (o de uso interno de Carico). El costo es solo la infraestructura de Cloudflare que
          consumas. No hay fee del kit.
        </p>

        <div className="mb-8 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead>Tier</TableHead>
                <TableHead>Storage</TableHead>
                <TableHead>Transcode</TableHead>
                <TableHead>Delivery</TableHead>
                <TableHead>Extras</TableHead>
                <TableHead>Costo real</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pricingModel.map((row) => (
                <TableRow key={row.tier}>
                  <TableCell className="font-medium">{row.tier}</TableCell>
                  <TableCell className="text-muted-foreground">{row.storage}</TableCell>
                  <TableCell className="text-muted-foreground">{row.transcode}</TableCell>
                  <TableCell className="text-muted-foreground">{row.delivery}</TableCell>
                  <TableCell className="text-muted-foreground">{row.extras}</TableCell>
                  <TableCell className="font-semibold">{row.price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <p className="text-xs text-muted-foreground mt-2">
            Estos son costos de infraestructura real (Cloudflare R2 + Workers + compute). El kit no cobra nada.
          </p>
        </div>

        {/* ========== KICKOFF ========== */}
        <h2 className="font-display text-h2 mb-4">Kickoff: Lo que se construye para KMakeup</h2>
        <Separator className="mb-4" />

        <div className="border border-accent bg-accent/20 p-5 mb-8">
          <p className="font-semibold mb-1">Estrategia</p>
          <p className="text-muted-foreground">
            Construir los módulos <strong className="text-foreground">dentro de KMakeup</strong> con la separación
            correcta desde el día 1. No como un paquete externo todavía — eso viene en la Fase 5 cuando esté probado en
            producción. KMakeup es el dogfooding ground.
          </p>
        </div>

        <div className="mb-8 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead>Módulo</TableHead>
                <TableHead>Kickoff (para KMakeup)</TableHead>
                <TableHead>Trabajo futuro (post-extracción)</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {kickoffScope.map((row) => (
                <TableRow key={row.module}>
                  <TableCell className="font-medium">{row.module}</TableCell>
                  <TableCell className="text-muted-foreground">{row.kickoff}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{row.futureWork}</TableCell>
                  <TableCell>
                    <Badge
                      variant={row.priority === "P0" ? "default" : row.priority === "P1" ? "secondary" : "outline"}
                    >
                      {row.priority}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* ========== PHASES ========== */}
        <h2 className="font-display text-h2 mb-4">Fases de Implementación</h2>
        <Separator className="mb-4" />

        <Mermaid
          chart={`
flowchart LR
    subgraph F1["Fase 1 (~15h)"]
        F1A["Storage + Upload\n+ Delivery"]
    end

    subgraph F2["Fase 2 (~20h)"]
        F2A["Video Transcode\n+ HLS + Player"]
    end

    subgraph F3["Fase 3 (~8h)"]
        F3A["Worker JWT\nAuth"]
    end

    subgraph F4["Fase 4 (~10h)"]
        F4A["Captions\n+ Progress"]
    end

    subgraph F5["Fase 5 (~12h)"]
        F5A["Extract\n+ Package"]
    end

    F1 --> F2
    F1 --> F3
    F2 --> F4
    F3 --> F4
    F4 --> F5
          `}
          caption="F1 es prerequisito de todo. F2 y F3 pueden correr en paralelo. F5 es la extracción como producto."
        />

        <div className="space-y-2 mb-12">
          {phases.map((p) => {
            const isOpen = openPhases.has(p.n);
            return (
              <div key={p.n} className="bg-muted">
                <button
                  type="button"
                  onClick={() => togglePhase(p.n)}
                  className="w-full text-left flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-accent text-foreground text-sm font-bold shrink-0">
                    {p.n}
                  </span>
                  <div className="flex-1">
                    <span className="font-semibold">{p.title}</span>
                    <p className="text-sm text-muted-foreground mt-0.5">{p.description}</p>
                  </div>
                  <span className="text-sm text-muted-foreground font-mono">{p.hours}</span>
                  <ChevronDown
                    className={`size-4 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-0">
                    <ul className="space-y-2 ml-11">
                      {p.items.map((item, i) => (
                        <li key={i} className="text-muted-foreground flex items-start gap-2">
                          <span className="text-foreground shrink-0 mt-0.5">—</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ========== NAMING ========== */}
        <h2 className="font-display text-h2 mb-4">Naming (exploración)</h2>
        <Separator className="mb-4" />

        <div className="mb-12 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead>Nombre</TableHead>
                <TableHead>Dominio</TableHead>
                <TableHead>Nota</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {nameCandidates.map((row) => (
                <TableRow key={row.name}>
                  <TableCell className="font-medium font-mono">{row.name}</TableCell>
                  <TableCell className="text-muted-foreground">{row.domain}</TableCell>
                  <TableCell className="text-muted-foreground">{row.note}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <p className="text-xs text-muted-foreground mt-2">
            Nombres tentativos. Verificar disponibilidad de dominio y npm scope antes de decidir.
          </p>
        </div>

        {/* ========== NEXT STEPS ========== */}
        <div className="bg-muted ring-1 ring-green-200 p-5 mb-12">
          <h3 className="font-semibold text-green-700 mb-3">Próximos Pasos</h3>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium w-1/4">Ahora</TableCell>
                <TableCell className="text-muted-foreground">
                  Construir Fase 1 (Storage + Upload + Delivery) dentro de KMakeup. Módulos en{" "}
                  <code>apps/web/src/lib/media/</code> con separación clara. KMakeup los consume como imports internos.
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Después de MVP</TableCell>
                <TableCell className="text-muted-foreground">
                  Fases 2-4: video, auth, captions. Todo probado con usuarios reales en KMakeup. Iterar basado en
                  feedback real, no en suposiciones.
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Cuando esté estable</TableCell>
                <TableCell className="text-muted-foreground">
                  Fase 5: extraer a <code>packages/media-*</code> en el monorepo. Luego a repo independiente si hay
                  demanda de otros proyectos de Carico.
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Si hay demanda externa</TableCell>
                <TableCell className="text-muted-foreground">
                  Publicar como paquetes npm open-source o como producto de Carico. Landing page, docs, quickstart. El
                  producto ya existe y está probado — solo falta empaquetarlo.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <footer className="border-t border-border pt-8 mt-14 text-center text-sm text-muted-foreground">
          <p>Exploración de producto para Carico · Junio 2026</p>
          <p className="mt-2">
            Basado en:{" "}
            <Link to="/scale-costs" className="text-foreground underline underline-offset-2 hover:opacity-70">
              Costos a Escala
            </Link>
            {" · "}
            <Link to="/bunny-vs-r2" className="text-foreground underline underline-offset-2 hover:opacity-70">
              Bunny vs R2
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
