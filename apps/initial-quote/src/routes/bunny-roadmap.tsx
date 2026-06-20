import { useState } from "react";

import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ChevronDown } from "lucide-react";

import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Separator } from "@repo/ui/components/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@repo/ui/components/table";

export const Route = createFileRoute("/bunny-roadmap")({
  component: BunnyRoadmapPage,
});

const phases = [
  {
    n: 1,
    title: "Bunny SDK + Convex Backend",
    hours: "~6h",
    items: [
      "Env vars en Convex (dev + prod): BUNNY_API_KEY, BUNNY_LIBRARY_ID, BUNNY_CDN_HOSTNAME, BUNNY_WEBHOOK_SECRET",
      "convex/bunny.ts: server actions — createVideo(title) retorna {guid, tusUploadUrl}, getSignedUrl(videoGuid) genera HMAC signed HLS URL con 4h de expiración, deleteVideo(videoGuid), getThumbnailUrl(videoGuid)",
      "convex/videoWebhooks.ts: HTTP action — recibe POST de Bunny con VideoLibraryEncodingComplete, valida HMAC-SHA256, actualiza lessons.videoStatus a 'ready', escribe duration y thumbnailUrl",
      "convex/http.ts: registrar ruta POST /webhooks/bunny",
      "convex/schema.ts: agregar campos de video a lessons (bunnyVideoGuid, thumbnailUrl, videoStatus, hlsUrl)",
      "apps/web/src/lib/bunny.ts: client-side helper para construir URLs de Bunny CDN",
    ],
    endpoints: [
      ["POST", "/library/{libraryId}/videos", "Crear video object"],
      ["PUT", "/library/{libraryId}/videos/{videoId}", "Upload via HTTP"],
      ["DELETE", "/library/{libraryId}/videos/{videoId}", "Eliminar video"],
      ["GET", "/library/{libraryId}/videos/{videoId}", "Metadata + status"],
    ] as [string, string, string][],
  },
  {
    n: 2,
    title: "Admin: Upload de Video por Lección",
    hours: "~8h",
    items: [
      "components/video-upload.tsx: widget de upload con drag-and-drop, TUS resumable via tus-js-client, barra de progreso con porcentaje y velocidad, estados (idle → uploading → encoding → ready → error), cancel upload, límite a formatos de video (mp4, mov, webm, mkv)",
      "admin/courses/$slug/lessons.tsx: botón 'Subir video' por lección (inline), thumbnail de Bunny cuando videoStatus === 'ready', badge de status ('Sin video' / 'Subiendo' / 'Procesando' / 'Listo'), botón 'Re-subir' para reemplazar",
      "admin/courses/$slug.tsx: upload de video preview del curso (campo previewVideoId) con el mismo widget",
      "Dependencia npm: tus-js-client (~8 KB gzip)",
    ],
    flow: [
      ["1. Admin click", "Selecciona archivo de video"],
      ["2. createVideo()", "Convex action crea video en Bunny, retorna GUID + TUS endpoint"],
      ["3. TUS upload", "Browser sube directo a Bunny CDN (no pasa por servidor)"],
      ["4. Encoding", "Bunny transcodifica a multi-resolución automáticamente"],
      ["5. Webhook", "Bunny notifica EncodingComplete, Convex actualiza lesson"],
      ["6. Ready", "UI muestra thumbnail + badge 'Listo'"],
    ] as [string, string][],
  },
  {
    n: 3,
    title: "hls.js Player + Progress Tracking",
    hours: "~10h",
    items: [
      "components/video-player.tsx: hls.js para HLS adaptive bitrate, fallback a <video src> nativo en Safari. Controles custom: play/pause, progress bar, volume, quality selector, fullscreen, PiP. Keyboard shortcuts: space (play/pause), arrows (seek ±10s), F (fullscreen), M (mute). Quality selector: auto + resoluciones disponibles. Playback speed: 0.5x, 0.75x, 1x, 1.25x, 1.5x, 2x. Auto-hide controles tras 3s de inactividad",
      "lib/use-progress-tracker.ts: escucha timeupdate, debounce 10s, guarda watchedSeconds en Convex, marca completed cuando watchedSeconds >= duration * 0.9, resume: setea video.currentTime = watchedSeconds al montar, cleanup: guarda progreso en beforeunload y visibilitychange",
      "routes/courses/$slug/$lessonId.tsx: página pública con layout video (main) + sidebar lecciones. Sidebar marca completadas con checkmark. Auto-advance al terminar (3s countdown). Lección gratuita accesible sin compra, paga verifica purchase/subscription. Responsive: sidebar en drawer en mobile",
      "convex/lessons.ts: agregar getByIdWithAccess(lessonId, userId) que retorna lección + signed URL si tiene acceso",
      "Dependencia npm: hls.js (~60 KB gzip)",
    ],
    progressFlow: [
      ["timeupdate", "Cada ~250ms del video element"],
      ["Debounce", "Acumula por 10s, luego muta a Convex"],
      ["Mutation", "progress.upsert({userId, lessonId, watchedSeconds, duration})"],
      ["Completed", "Automático cuando watchedSeconds >= 90% duration"],
      ["Resume", "video.currentTime = progress.watchedSeconds al cargar"],
      ["Persist", "Save en beforeunload + visibilitychange"],
    ] as [string, string][],
  },
  {
    n: 4,
    title: "Seguridad: Token Auth + MediaCage",
    hours: "~5h",
    items: [
      "Token Authentication: activar en Bunny Dashboard → Library Settings → Security. Server-side signing en convex/bunny.ts con HMAC-SHA256. Expiración de URLs: 4 horas. Las URLs se generan on-demand por getByIdWithAccess",
      "MediaCage Basic (AES-128): activar en Bunny Dashboard → DRM. Sin cambios de código: Bunny encripta los segmentos HLS automáticamente. hls.js maneja la desencriptación transparentemente",
      "Domain Restrictions: whitelist katherinmejia.com, katherinmejia.vercel.app, localhost:3000",
      "Access control en Convex: verificar purchases o subscriptions antes de generar signed URL. Lecciones con isFree: true no requieren purchase. Retornar 403 si no tiene acceso",
    ],
  },
  {
    n: 5,
    title: "Subtítulos + Transcripción AI",
    hours: "~6h",
    items: [
      "Bunny Transcribe AI: activar en Library Settings, idioma primario español, auto-traducción a inglés, smart chapters incluidos. Costo: $0,10/min/idioma",
      "Player integration: selector de subtítulos (ES / EN / Off), cargar captions via Bunny API, renderizar como WebVTT overlay",
      "Chapters integration: cargar chapters del video via API, marcadores en la progress bar, lista de chapters en sidebar (click para saltar)",
      "Admin UI: botón 'Generar subtítulos' por lección, status de transcripción (pending / processing / ready), preview de subtítulos generados",
    ],
    transcriptionCost: [
      ["100 horas de contenido", "6.000 minutos"],
      ["Español (transcripción)", "6.000 × $0,10 = $600"],
      ["Inglés (traducción)", "6.000 × $0,10 = $600"],
      ["Total (one-time)", "$1.200"],
    ] as [string, string][],
  },
];

const decisions = [
  [
    "Player: hls.js en vez del iframe de Bunny",
    "Control total del UX, integración directa con Convex para progress tracking. El iframe no permite capturar timeupdate events ni customizar controles.",
  ],
  [
    "Upload: TUS resumable directo al CDN",
    "El video nunca pasa por nuestro servidor. Browser → Bunny CDN via pre-signed URLs. Soporta archivos grandes (>2 GB) y conexiones inestables.",
  ],
  [
    "Progress: heartbeat cada 10 segundos",
    "Debounce con requestAnimationFrame. Mutation a Convex progress.upsert. Resume desde watchedSeconds al cargar lección. Persist en beforeunload como safety net.",
  ],
  [
    "Seguridad: Token Auth + MediaCage Basic",
    "Ambas features gratuitas en Bunny. HMAC signed URLs con 4h de expiración + AES-128 encryption. Suficiente para prevenir descarga casual y compartir enlaces.",
  ],
  [
    "VideoId: GUID de Bunny en campo existente",
    "El campo lessons.videoId ya existe en el schema. La URL HLS se construye como https://vz-{pullZone}.b-cdn.net/{videoId}/playlist.m3u8.",
  ],
  [
    "Duración: automática via webhook",
    "Se obtiene del webhook VideoLibraryEncodingComplete y se escribe en lessons.duration. No depende de input manual del admin.",
  ],
];

const monthlyCost = [
  { users: "10", storage: "$2,00", bandwidth: "$0,50", bunny: "$2,50", convex: "$0", total: "$2,50" },
  { users: "50", storage: "$2,00", bandwidth: "$2,50", bunny: "$4,50", convex: "$0", total: "$4,50" },
  { users: "100", storage: "$2,00", bandwidth: "$5,00", bunny: "$7,00", convex: "$0", total: "$7,00" },
  { users: "500", storage: "$2,00", bandwidth: "$25,00", bunny: "$27,00", convex: "$25", total: "$52,00" },
  { users: "1.000", storage: "$2,00", bandwidth: "$50,00", bunny: "$52,00", convex: "$25", total: "$77,00" },
];

const schemaChanges = {
  lessons: [
    ["videoId", "v.string() → v.optional(v.string())", "Mantener como fallback"],
    ["+ bunnyVideoGuid", "v.optional(v.string())", "GUID de Bunny Stream"],
    ["+ thumbnailUrl", "v.optional(v.string())", "Auto-generado por Bunny"],
    ["+ videoStatus", '"pending" | "encoding" | "ready" | "failed"', "Estado del video"],
    ["+ hlsUrl", "v.optional(v.string())", "Convenience, construida server-side"],
  ] as [string, string, string][],
  progress: [
    ["watchedSeconds", "Sin cambio", "Ya existe"],
    ["duration", "Sin cambio", "Ya existe"],
    ["completed", "Sin cambio", "Ya existe"],
    ["+ completedAt", "v.optional(v.number())", "Timestamp de completación"],
  ] as [string, string, string][],
};

const filesAffected = {
  new: [
    ["apps/web/src/lib/bunny.ts", "Bunny SDK wrapper (API key, library ID, signed URLs)"],
    ["apps/web/src/lib/use-progress-tracker.ts", "Hook: 10s heartbeat, upsert progress, resume"],
    ["apps/web/src/components/video-player.tsx", "hls.js player + custom controls + progress"],
    ["apps/web/src/components/video-upload.tsx", "TUS upload widget (progress bar, drag-drop)"],
    ["apps/web/src/routes/courses/$slug/$lessonId.tsx", "Página de lección pública (player + sidebar)"],
    ["apps/web/src/routes/admin/.../lessons/$lessonId.tsx", "Editar lección + preview video"],
    ["apps/backend/convex/bunny.ts", "Server actions: create video, signed URL, delete"],
    ["apps/backend/convex/videoWebhooks.ts", "HTTP handler para webhooks de Bunny"],
  ],
  modified: [
    ["apps/backend/convex/schema.ts", "Agregar campos video a lessons + progress"],
    ["apps/backend/convex/lessons.ts", "Fields de video, getByIdWithAccess"],
    ["apps/backend/convex/http.ts", "Registrar ruta de webhook"],
    ["apps/web/src/components/course-preview.tsx", "Thumbnail real de Bunny"],
    ["apps/web/src/routes/courses/$slug.tsx", "Player en detalle público"],
    ["apps/web/src/routes/admin/.../courses/$slug.tsx", "Upload de preview video"],
    ["apps/web/src/routes/admin/.../$slug/lessons.tsx", "Upload TUS por lección"],
  ],
};

const risks = [
  {
    title: "Riesgos Técnicos",
    items: [
      "CORS en TUS upload: Bunny maneja CORS automáticamente. Si falla, usar pre-signed HTTP upload como fallback",
      "Webhook delivery: Bunny reintenta 3 veces. Si Convex HTTP action falla, video queda en 'encoding'. Mitigar con polling fallback en admin UI",
      "Safari HLS nativo: no necesita hls.js pero requiere testing de controles custom con el player nativo. Probar en iOS Safari también",
      "Progress persist en tab close: beforeunload no garantiza que el fetch se complete. Usar navigator.sendBeacon como fallback",
    ],
  },
  {
    title: "Mitigaciones",
    items: [
      "Videos grandes (>2 GB): TUS resumable maneja esto naturalmente. Chunk size de 10 MB",
      "Encoding lento: videos largos pueden tardar 10-30 min. Mostrar ETA estimado basado en duración del source",
      "Bandwidth LATAM: Volume Network a $0,005/GB reduce costos 9x vs standard SA pricing. Menos PoPs pero aceptable",
      "Vendor lock-in: bajo riesgo. Videos source re-descargables. hls.js funciona con cualquier CDN HLS. Migración sería de backend, no frontend",
    ],
  },
];

const preChecklist = [
  "Crear cuenta en Bunny.net (14 días free trial)",
  "Crear Stream Library en Bunny Dashboard",
  "Obtener API Key + Library ID",
  "Configurar webhook URL: https://{convex-site-url}/webhooks/bunny",
  "Agregar env vars a Convex (dev): BUNNY_API_KEY, BUNNY_LIBRARY_ID, BUNNY_CDN_HOSTNAME",
  "Instalar hls.js y tus-js-client en apps/web",
  "Subir video de prueba via Dashboard para verificar transcoding",
  "Probar URL HLS en browser para confirmar CDN funciona",
];

const npmDeps = [
  ["hls.js", "^1.5", "~60 KB gzip", "HLS adaptive bitrate player"],
  ["tus-js-client", "^4.1", "~8 KB gzip", "TUS resumable uploads"],
] as [string, string, string, string][];

function BunnyRoadmapPage() {
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

        <p className="text-sm text-muted-foreground uppercase tracking-widest mb-3">Roadmap de Implementación</p>
        <h1 className="font-display text-h1 tracking-tight mb-3">Bunny Stream + hls.js</h1>
        <p className="text-muted-foreground mb-10 max-w-3xl">
          Plan de integración de video streaming para KMakeup Platform. Bunny Stream como backend de video (upload,
          transcoding, CDN, DRM). hls.js como player custom para progress tracking por segundo, auto-advance y resume.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-6">
          {[
            { v: "5", l: "Fases" },
            { v: "~35", l: "Horas Est." },
            { v: "~$4,50", l: "Costo / Mes" },
            { v: "8", l: "Archivos Nuevos" },
            { v: "7", l: "Archivos Modif." },
          ].map((s) => (
            <div key={s.l} className="text-center bg-muted p-3">
              <div className="font-display text-2xl">{s.v}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">{s.l}</div>
            </div>
          ))}
        </div>

        <div className="border border-accent bg-accent/20 p-5 mb-12">
          <p className="font-semibold mb-1">Estrategia</p>
          <p className="text-muted-foreground">
            Usar Bunny Stream para upload, transcoding, CDN, thumbnails y seguridad. Construir un player custom con
            hls.js para control total del UX: progress tracking por segundo, auto-advance entre lecciones, resume desde
            última posición, y UI alineada al design system. Bunny expone la URL HLS directa de cada video.
          </p>
        </div>

        {/* Decisions */}
        <h2 className="font-display text-h2 mb-4">Decisiones Técnicas</h2>
        <Separator className="mb-4" />
        <div className="space-y-3 mb-12">
          {decisions.map(([title, desc]) => (
            <div key={title} className="flex gap-3 p-4 bg-muted/50 border border-border">
              <span className="text-muted-foreground shrink-0 mt-0.5">&#9670;</span>
              <div>
                <p className="font-semibold">{title}</p>
                <p className="text-muted-foreground mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Dependency Graph */}
        <h2 className="font-display text-h2 mb-4">Grafo de Dependencias</h2>
        <Separator className="mb-4" />
        <div className="bg-muted p-5 mb-12 font-mono text-sm space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="default">F1: Bunny SDK</Badge>
            <span className="text-muted-foreground">→</span>
            <Badge variant="secondary">F2: Admin Upload</Badge>
            <span className="text-muted-foreground">→</span>
            <Badge variant="outline">F4: Token Auth</Badge>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="default">F1: Bunny SDK</Badge>
            <span className="text-muted-foreground">→</span>
            <Badge variant="secondary">F3: hls.js Player</Badge>
            <span className="text-muted-foreground">→</span>
            <Badge variant="outline">F5: Subtítulos</Badge>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary">F2: Admin Upload</Badge>
            <span className="text-muted-foreground">→</span>
            <Badge variant="secondary">F3: hls.js Player</Badge>
          </div>
          <p className="text-muted-foreground text-xs mt-3 font-sans">
            F1 es prerequisito de todo. F2 y F3 pueden ejecutarse en paralelo parcial. F4 y F5 son independientes entre
            sí.
          </p>
        </div>

        {/* Files affected */}
        <h2 className="font-display text-h2 mb-4">Archivos Afectados</h2>
        <Separator className="mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          <div className="bg-muted p-5">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Nuevos <Badge className="ml-2">8</Badge>
            </h3>
            <ul className="space-y-2">
              {filesAffected.new.map(([path, desc]) => (
                <li key={path}>
                  <code className="text-foreground text-xs">{path}</code>
                  <br />
                  <span className="text-muted-foreground text-xs">{desc}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-muted p-5">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Modificados{" "}
              <Badge variant="secondary" className="ml-2">
                7
              </Badge>
            </h3>
            <ul className="space-y-2">
              {filesAffected.modified.map(([path, desc]) => (
                <li key={path}>
                  <code className="text-foreground text-xs">{path}</code>
                  <br />
                  <span className="text-muted-foreground text-xs">{desc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Schema changes */}
        <h2 className="font-display text-h2 mb-4">Cambios al Schema de Convex</h2>
        <Separator className="mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold">lessons</h3>
              <Badge variant="secondary">Modificar</Badge>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted hover:bg-muted">
                  <TableHead>Campo</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Nota</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schemaChanges.lessons.map(([field, type, note]) => (
                  <TableRow key={field}>
                    <TableCell className={`font-medium ${field.startsWith("+") ? "text-green-700" : ""}`}>
                      {field}
                    </TableCell>
                    <TableCell>
                      <code className="bg-foreground text-background px-1.5 py-0.5 text-xs rounded-sm">{type}</code>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{note}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold">progress</h3>
              <Badge variant="secondary">Modificar</Badge>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted hover:bg-muted">
                  <TableHead>Campo</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Nota</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schemaChanges.progress.map(([field, type, note]) => (
                  <TableRow key={field}>
                    <TableCell className={`font-medium ${field.startsWith("+") ? "text-green-700" : ""}`}>
                      {field}
                    </TableCell>
                    <TableCell>
                      <code className="bg-foreground text-background px-1.5 py-0.5 text-xs rounded-sm">{type}</code>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{note}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <p className="text-xs text-muted-foreground mt-2">
              El schema de progress ya está bien diseñado. Solo se agrega completedAt para tracking.
            </p>
          </div>
        </div>

        {/* Phases */}
        <h2 className="font-display text-h2 mb-4">Fases de Implementación</h2>
        <Separator className="mb-4" />
        <div className="space-y-2 mb-12">
          {phases.map((p) => {
            const isOpen = openPhases.has(p.n);
            return (
              <div key={p.n} className="bg-muted">
                <button
                  onClick={() => togglePhase(p.n)}
                  className="w-full text-left flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-accent text-foreground text-sm font-bold shrink-0">
                    {p.n}
                  </span>
                  <span className="font-semibold flex-1">{p.title}</span>
                  <span className="text-sm text-muted-foreground font-mono">{p.hours}</span>
                  <ChevronDown
                    className={`size-4 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-0 space-y-4">
                    <ul className="space-y-2 ml-11">
                      {p.items.map((item, i) => (
                        <li key={i} className="text-muted-foreground flex items-start gap-2">
                          <span className="text-foreground shrink-0 mt-0.5">—</span>
                          {item}
                        </li>
                      ))}
                    </ul>

                    {p.endpoints && (
                      <div className="ml-11">
                        <p className="text-sm font-semibold mb-2">Bunny API endpoints usados</p>
                        <Table>
                          <TableBody>
                            {p.endpoints.map(([method, path, desc]) => (
                              <TableRow key={path}>
                                <TableCell className="font-mono text-xs w-16">{method}</TableCell>
                                <TableCell>
                                  <code className="text-xs">{path}</code>
                                </TableCell>
                                <TableCell className="text-muted-foreground">{desc}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}

                    {p.flow && (
                      <div className="ml-11">
                        <p className="text-sm font-semibold mb-2">Flujo de upload</p>
                        <Table>
                          <TableBody>
                            {p.flow.map(([step, desc]) => (
                              <TableRow key={step}>
                                <TableCell className="font-medium w-1/4">{step}</TableCell>
                                <TableCell className="text-muted-foreground">{desc}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}

                    {p.progressFlow && (
                      <div className="ml-11">
                        <p className="text-sm font-semibold mb-2">Progress tracking flow</p>
                        <Table>
                          <TableBody>
                            {p.progressFlow.map(([step, desc]) => (
                              <TableRow key={step}>
                                <TableCell className="font-medium w-1/4">{step}</TableCell>
                                <TableCell className="text-muted-foreground">{desc}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}

                    {p.transcriptionCost && (
                      <div className="ml-11">
                        <p className="text-sm font-semibold mb-2">Costo estimado para KMakeup</p>
                        <Table>
                          <TableBody>
                            {p.transcriptionCost.map(([item, cost]) => (
                              <TableRow key={item}>
                                <TableCell
                                  className={`font-medium w-1/2 ${item === "Total (one-time)" ? "font-bold" : ""}`}
                                >
                                  {item}
                                </TableCell>
                                <TableCell
                                  className={item === "Total (one-time)" ? "font-bold" : "text-muted-foreground"}
                                >
                                  {cost}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Monthly cost */}
        <h2 className="font-display text-h2 mb-4">Costo Mensual Proyectado</h2>
        <Separator className="mb-4" />
        <div className="mb-4">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead>Usuarios</TableHead>
                <TableHead>Storage</TableHead>
                <TableHead>Bandwidth</TableHead>
                <TableHead>Total Bunny</TableHead>
                <TableHead>Convex</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {monthlyCost.map((row) => (
                <TableRow key={row.users}>
                  <TableCell className="font-semibold">{row.users}</TableCell>
                  <TableCell>{row.storage}</TableCell>
                  <TableCell>{row.bandwidth}</TableCell>
                  <TableCell>{row.bunny}</TableCell>
                  <TableCell>{row.convex}</TableCell>
                  <TableCell className="font-semibold">{row.total}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="border border-accent bg-accent/20 p-5 mb-12">
          <p className="text-muted-foreground text-sm">
            <strong className="text-foreground">Supuestos:</strong> 200 GB almacenado, 3h/usuario/mes de consumo (~500
            MB/usuario con ABR), CDN Volume Network ($0,005/GB). Convex free tier cubre hasta ~300 usuarios; Pro a
            $25/mes después.
          </p>
        </div>

        {/* NPM deps */}
        <h2 className="font-display text-h2 mb-4">Dependencias npm</h2>
        <Separator className="mb-4" />
        <div className="mb-12">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead>Paquete</TableHead>
                <TableHead>Versión</TableHead>
                <TableHead>Tamaño</TableHead>
                <TableHead>Propósito</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {npmDeps.map(([name, version, size, purpose]) => (
                <TableRow key={name}>
                  <TableCell className="font-mono font-semibold">{name}</TableCell>
                  <TableCell className="font-mono">{version}</TableCell>
                  <TableCell>{size}</TableCell>
                  <TableCell className="text-muted-foreground">{purpose}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <p className="text-xs text-muted-foreground mt-2">
            Solo 2 dependencias nuevas (~68 KB total). Sin SDKs pesados ni dependencias transitivas grandes.
          </p>
        </div>

        {/* Risks */}
        <h2 className="font-display text-h2 mb-4">Riesgos y Mitigaciones</h2>
        <Separator className="mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {risks.map((r) => (
            <div key={r.title} className="bg-muted p-5">
              <h3 className="font-semibold mb-3">{r.title}</h3>
              <ul className="space-y-1.5 text-muted-foreground">
                {r.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-foreground shrink-0 mt-0.5">—</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Pre-implementation checklist */}
        <h2 className="font-display text-h2 mb-4">Checklist Pre-Implementación</h2>
        <Separator className="mb-4" />
        <div className="bg-muted p-5 mb-12">
          <ul className="space-y-2">
            {preChecklist.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-muted-foreground">
                <span className="text-foreground font-bold shrink-0">○</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <footer className="border-t border-border pt-8 mt-14 text-center text-sm text-muted-foreground">
          <p>Roadmap de implementación para KMakeup Platform · Junio 2026</p>
          <p className="mt-2">
            Basado en:{" "}
            <Link to="/video-costs" className="text-foreground underline underline-offset-2 hover:opacity-70">
              Costos de Video Streaming
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
