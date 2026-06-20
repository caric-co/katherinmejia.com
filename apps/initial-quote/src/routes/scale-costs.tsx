import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Separator } from "@repo/ui/components/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@repo/ui/components/table";

import { Mermaid } from "#/components/mermaid";

export const Route = createFileRoute("/scale-costs")({
  component: ScaleCostsPage,
});

const scaleComparison = [
  {
    tier: "Lab (100)",
    egress: "1 TB",
    r2Storage: "$20.63",
    r2Ops: "$0.36",
    r2Workers: "$5.50",
    r2Compute: "$0-18",
    r2Total: "$27-45",
    bunnyVol: "$10",
    bunnySA: "$50",
    winner: "bunny",
  },
  {
    tier: "Small (1.000)",
    egress: "10 TB",
    r2Storage: "$82.50",
    r2Ops: "$3.60",
    r2Workers: "$7.50",
    r2Compute: "$57",
    r2Total: "$151",
    bunnyVol: "$70",
    bunnySA: "$470",
    winner: "bunny",
  },
  {
    tier: "Medium (10.000)",
    egress: "100 TB",
    r2Storage: "$206.25",
    r2Ops: "$36",
    r2Workers: "$25",
    r2Compute: "$157",
    r2Total: "$426",
    bunnyVol: "$550",
    bunnySA: "$4.550",
    winner: "r2",
  },
  {
    tier: "Large (100.000)",
    egress: "1 PB",
    r2Storage: "$2.063",
    r2Ops: "$360",
    r2Workers: "$180",
    r2Compute: "$400",
    r2Total: "$3.013",
    bunnyVol: "$5.000",
    bunnySA: "$45.500",
    winner: "r2",
  },
  {
    tier: "Massive (1.000.000)",
    egress: "10 PB",
    r2Storage: "$5.156",
    r2Ops: "$3.600",
    r2Workers: "$1.605",
    r2Compute: "$800",
    r2Total: "$11.161",
    bunnyVol: "$21.250",
    bunnySA: "$451.250",
    winner: "r2",
  },
];

const r2Pricing: [string, string, string][] = [
  ["Storage (Standard)", "$0,015/GB/mes", ""],
  ["Storage (Infrequent Access)", "$0,01/GB/mes", "+$0,01/GB retrieval"],
  ["Class A ops (writes)", "$4,50/millón", ""],
  ["Class B ops (reads)", "$0,36/millón", "~100 ops por vista de video"],
  ["Egress", "$0,00", "Zero egress, siempre"],
  ["Free tier", "10 GB + 1M Class A + 10M Class B", ""],
];

const workersPricing: [string, string][] = [
  ["Plan base", "$5/mes"],
  ["Requests incluidos", "10 millones/mes"],
  ["Requests adicionales", "$0,30/millón"],
  ["KV reads", "$0,50/millón"],
  ["KV writes", "$5,00/millón"],
  ["KV storage", "$0,50/GB/mes"],
];

const computePricing: [string, string, string, string][] = [
  ["Hetzner AX41", "6C/12T, 64 GB", "$57/mes", "1 transcode concurrente"],
  ["Hetzner AX52", "8C/16T, 64 GB", "$64/mes", "1-2 transcodes"],
  ["Hetzner AX102", "16C/32T, 128 GB", "$157/mes", "2-3 transcodes"],
  ["Hetzner CPX51", "16 vCPU, 32 GB", "$70-100/mes", "2 transcodes"],
  ["AWS EC2 Spot c6a.4xlarge", "16 vCPU, 32 GB", "$0,10-0,15/hr", "Burst, ~60-70% off"],
];

const transcodeTimes: [string, string, string][] = [
  ["AX41 (6C)", "~45-60 min", "1 job cómodo"],
  ["AX52 (8C)", "~35-45 min", "1-2 jobs"],
  ["AX102 (16C)", "~20-30 min", "2-3 jobs"],
  ["CPX51 (16 vCPU)", "~25-35 min", "2 jobs"],
];

const bunnyNetworkPricing: [string, string, string][] = [
  ["Standard (EU/NA)", "$0,01/GB", "Amplia cobertura"],
  ["Standard (Sudamérica)", "$0,045/GB", "18 PoPs en LATAM"],
  ["Volume Network (global)", "$0,005/GB", "Primeros 500 TB"],
  ["Volume Network (500TB-1PB)", "$0,004/GB", "Descuento por volumen"],
  ["Volume Network (1-2 PB)", "$0,002/GB", "Gran escala"],
  ["Storage (Stream)", "$0,01/GB/mes", "Por región de replicación"],
];

const cloudTranscription: {
  provider: string;
  model: string;
  perMin: string;
  perHr: string;
  note: string;
  best?: boolean;
}[] = [
  {
    provider: "AssemblyAI",
    model: "Universal (batch)",
    perMin: "$0,0025",
    perHr: "$0,15",
    note: "Más barato cloud",
    best: true,
  },
  { provider: "OpenAI", model: "gpt-4o-mini-transcribe", perMin: "$0,003", perHr: "$0,18", note: "Nuevo, económico" },
  {
    provider: "Google Cloud",
    model: "STT V2 (Dynamic Batch)",
    perMin: "$0,003",
    perHr: "$0,18",
    note: "Bueno para volumen",
  },
  { provider: "Deepgram", model: "Nova-3 (batch)", perMin: "$0,0043", perHr: "$0,26", note: "Muy rápido" },
  { provider: "OpenAI", model: "whisper-1", perMin: "$0,006", perHr: "$0,36", note: "Estándar" },
  { provider: "Azure", model: "Batch", perMin: "$0,006", perHr: "$0,36", note: "" },
  { provider: "Deepgram", model: "Nova-3 (streaming)", perMin: "$0,0077", perHr: "$0,46", note: "Tiempo real" },
  { provider: "Google Cloud", model: "STT V2 (Standard)", perMin: "$0,016", perHr: "$0,96", note: "Caro para volumen" },
  { provider: "AWS", model: "Transcribe (Tier 1)", perMin: "$0,024", perHr: "$1,44", note: "Más caro" },
];

const whisperModels: [string, string, string, string, string][] = [
  ["tiny", "75 MB", "~200 MB", "~30-40x real-time", "Alto (~0,35 WER)"],
  ["base", "142 MB", "~390 MB", "~15-20x real-time", "Medio-Alto (~0,30)"],
  ["small", "466 MB", "~850 MB", "~5-8x real-time", "Medio (~0,25)"],
  ["medium", "1,5 GB", "~2,1 GB", "~2-3x real-time", "Bueno (~0,20)"],
  ["large-v3", "3,1 GB", "~4,5 GB", "~0,5-1x real-time", "Mejor (~0,15)"],
];

const gpuHosting: [string, string, string, string][] = [
  ["Vast.ai (spot)", "RTX 4090", "$0,31/hr", "Más barato, interruptible"],
  ["Hetzner GEX44", "RTX 4000 SFF Ada 20 GB", "$184/mes (~$0,26/hr)", "Always-on, estable"],
  ["RunPod", "A40 (48 GB)", "$0,44/hr", "On-demand, per-second"],
  ["RunPod", "RTX 4090", "$0,69/hr", "Gran rendimiento"],
  ["Lambda Labs", "A100 80 GB", "$1,79-2,79/hr", "Premium"],
];

const selfHostedAnalysis: [string, string, string, string][] = [
  ["Hetzner GEX44 (GPU)", "faster-whisper large-v3 int8", "~6-8 min por hora de audio", "~5.400-7.200 hrs/mes"],
  ["Hetzner AX102 (CPU)", "whisper.cpp medium", "~15-20 min por hora de audio", "~2.160-2.880 hrs/mes"],
  ["Vast.ai RTX 4090", "faster-whisper large-v3", "~5-7 min por hora de audio", "On-demand"],
];

const transcriptionScenarios100 = [
  { option: "AssemblyAI Universal", calc: "6.000 min × $0,0025", cost: "$15" },
  { option: "OpenAI gpt-4o-mini-transcribe", calc: "6.000 min × $0,003", cost: "$18" },
  { option: "Deepgram Nova-3 batch", calc: "6.000 min × $0,0043", cost: "$25,80" },
  { option: "Vast.ai spot GPU", calc: "~10 hrs GPU × $0,31/hr", cost: "$3,10" },
  { option: "Bunny Transcribe AI", calc: "6.000 min × $0,10", cost: "$600" },
];

const transcriptionScenarios500 = [
  { option: "AssemblyAI Universal", calc: "30.000 min × $0,0025", cost: "$75" },
  { option: "OpenAI gpt-4o-mini-transcribe", calc: "30.000 min × $0,003", cost: "$90" },
  { option: "Vast.ai spot GPU", calc: "~50 hrs GPU × $0,31/hr", cost: "$15,50" },
  { option: "Hetzner GEX44 (1 mes)", calc: "Solo necesita ~2-3 días", cost: "$184" },
  { option: "Bunny Transcribe AI", calc: "30.000 min × $0,10", cost: "$3.000" },
];

const translationPricing: [string, string, string, string][] = [
  ["Whisper translate mode", "$0 extra", "Incluido en transcripción", "Calidad aceptable para subtítulos"],
  ["Google Translate API", "$20/millón chars", "100h ≈ $100 · 500h ≈ $500", "500K chars/mes gratis"],
  ["DeepL API Pro", "$25/millón chars + $5,49/mes", "100h ≈ $130 · 500h ≈ $630", "Mayor calidad ES→EN"],
];

const bilingualTotal = [
  {
    hours: "100h",
    bestTranscription: "Vast.ai: $3",
    bestTranslation: "Whisper translate: $0",
    total: "$3",
    altTotal: "AssemblyAI + Google: $115",
  },
  {
    hours: "500h",
    bestTranscription: "Vast.ai: $16",
    bestTranslation: "Whisper translate: $0",
    total: "$16",
    altTotal: "AssemblyAI + Google: $575",
  },
];

function ScaleCostsPage() {
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

        <p className="text-sm text-muted-foreground uppercase tracking-widest mb-3">Análisis de Costos a Escala</p>
        <h1 className="font-display text-h1 tracking-tight mb-3">Infraestructura de Video: Costos Reales</h1>
        <p className="text-muted-foreground mb-10 max-w-3xl">
          Análisis detallado de costos operacionales (sin contar desarrollo) para una plataforma de video a diferentes
          escalas. Bunny Stream vs R2 DIY, más opciones de transcripción y traducción automática.
        </p>

        {/* Key Insight */}
        <div className="border border-accent bg-accent/20 p-5 mb-12">
          <p className="font-semibold mb-1">Hallazgo clave</p>
          <p className="text-muted-foreground">
            Bunny Stream (Volume Network) es más barato que R2 DIY hasta ~10.000 usuarios. A partir de ahí, el zero
            egress de R2 ahorra miles por mes. Para transcripción, Bunny Transcribe AI ($0,10/min) es{" "}
            <strong className="text-foreground">40x más caro</strong> que AssemblyAI ($0,0025/min) y{" "}
            <strong className="text-foreground">33x más caro</strong> que Whisper self-hosted en GPU spot.
          </p>
        </div>

        {/* ========== ARCHITECTURE ========== */}
        <h2 className="font-display text-h2 mb-4">Arquitectura R2 DIY: Cómo Funciona</h2>
        <Separator className="mb-4" />

        <h3 className="font-semibold mb-1">Flujo 1: Admin sube un video</h3>
        <p className="text-muted-foreground mb-2">
          El video nunca pasa por tu servidor. El admin sube directo a R2 via presigned URL. Luego un servidor FFmpeg
          dedicado lo transcodifica a HLS multi-bitrate y sube los segmentos de vuelta a R2.
        </p>
        <Mermaid
          chart={`
sequenceDiagram
    participant A as Admin (Browser)
    participant API as Tu API (Convex)
    participant R2 as Cloudflare R2
    participant FF as FFmpeg Server (Hetzner VPS)

    A->>API: Quiero subir video para lección X
    API->>R2: Generar presigned upload URL
    R2-->>API: URL firmada (4h expiración)
    API-->>A: Presigned URL

    Note over A,R2: Upload directo browser → R2 (tu API no toca el archivo)
    A->>R2: PUT video.mp4 (upload directo)
    R2-->>A: 200 OK

    API->>FF: Job: transcodificar /videos/abc123.mp4
    FF->>R2: Descargar video source
    Note over FF: FFmpeg transcodifica (20-60 min)<br/>→ 1080p, 720p, 480p<br/>→ segmentos HLS .ts<br/>→ playlists .m3u8
    FF->>R2: Subir segmentos HLS + playlists
    FF->>API: Webhook: encoding complete, duración: 45min
    API->>API: Actualizar lesson: status=ready, duration=2700
          `}
          caption="El servidor FFmpeg es el único costo fijo ($57-157/mes). Sin él, no hay forma de generar HLS multi-bitrate."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-muted p-4">
            <p className="font-semibold text-sm mb-1">¿Por qué presigned URL?</p>
            <p className="text-muted-foreground text-sm">
              El video puede pesar 2-5 GB. Si pasa por tu API (serverless), te cobran por tiempo de ejecución y ancho de
              banda. Con presigned URL, el browser sube directo a R2: gratis, rápido, resumable.
            </p>
          </div>
          <div className="bg-muted p-4">
            <p className="font-semibold text-sm mb-1">¿Por qué FFmpeg en VPS?</p>
            <p className="text-muted-foreground text-sm">
              Transcodificar 1 hora de video toma 20-60 min de CPU intensivo. Serverless (Lambda, Convex) tiene timeouts
              de segundos. Necesitas un servidor always-on con acceso a disco para los archivos intermedios.
            </p>
          </div>
          <div className="bg-muted p-4">
            <p className="font-semibold text-sm mb-1">¿Por qué HLS multi-bitrate?</p>
            <p className="text-muted-foreground text-sm">
              Un video 1080p a 5 Mbps no funciona en conexiones lentas. HLS sirve 480p (1.4 Mbps) a conexiones malas y
              1080p a las buenas, automáticamente. Sin esto, tus estudiantes con WiFi débil ven buffering infinito.
            </p>
          </div>
        </div>

        <h3 className="font-semibold mb-1">Flujo 2: Estudiante reproduce un video</h3>
        <p className="text-muted-foreground mb-2">
          El estudiante pide acceso a tu API, que verifica la compra y retorna un token JWT. El player (hls.js) usa ese
          token para todas las requests. Un Cloudflare Worker valida el token antes de servir cada segmento desde el CDN
          o R2.
        </p>
        <Mermaid
          chart={`
sequenceDiagram
    participant E as Estudiante (hls.js)
    participant API as Tu API (Convex)
    participant W as CF Worker (auth)
    participant CDN as Cloudflare CDN (cache)
    participant R2 as Cloudflare R2

    E->>API: getVideoAccess(lessonId, userId)
    API->>API: ¿isFree? ¿purchase? ¿subscription?

    alt No tiene acceso
        API-->>E: 403 Forbidden
    else Tiene acceso
        API-->>E: { token: JWT (4h), hlsUrl }
    end

    Note over E,R2: Playback: hls.js hace ~100-300 requests por video

    E->>W: GET master.m3u8 + Authorization: Bearer {token}
    W->>W: Validar JWT (< 1ms en edge)
    W->>CDN: Forward request
    CDN->>CDN: ¿En cache?

    alt Cache HIT (85-95% de las veces)
        CDN-->>E: Segmento desde edge (rápido)
    else Cache MISS
        CDN->>R2: Fetch segmento
        R2-->>CDN: Segmento (egress $0)
        CDN-->>E: Segmento + cachear
    end

    Note over E: Repite para cada segmento .ts (cada 4-6 seg de video)
          `}
          caption="El Worker cuesta $5/mes e intercepta cada request. Sin él, cualquiera con la URL puede ver el video."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-muted p-4">
            <p className="font-semibold text-sm mb-1">¿Por qué Worker y no presigned URLs?</p>
            <p className="text-muted-foreground text-sm">
              Un video HLS tiene 100-300 segmentos. Firmar cada URL individualmente agrega latencia y complejidad. El
              Worker valida 1 token JWT para todos los segmentos, corriendo en el edge (&lt;1ms). Cuesta solo $5/mes.
            </p>
          </div>
          <div className="bg-muted p-4">
            <p className="font-semibold text-sm mb-1">¿Por qué CDN cache importa?</p>
            <p className="text-muted-foreground text-sm">
              Si 50 estudiantes ven la misma lección, el segmento se descarga de R2 solo 1 vez y se sirve desde cache
              las otras 49. A escala, el 85-95% de requests no tocan R2, reduciendo operaciones (y costo) drásticamente.
            </p>
          </div>
          <div className="bg-muted p-4">
            <p className="font-semibold text-sm mb-1">¿Por qué token JWT de 4h?</p>
            <p className="text-muted-foreground text-sm">
              4 horas cubre una sesión de estudio completa sin re-autenticar. Si alguien comparte el token, expira
              pronto. El Worker verifica la firma criptográfica sin llamar a tu API (zero latencia extra).
            </p>
          </div>
        </div>

        <h3 className="font-semibold mb-1">Flujo 3: Transcripción y subtítulos</h3>
        <p className="text-muted-foreground mb-2">
          Tu API envía el audio a una API de transcripción (AssemblyAI o Whisper self-hosted). El resultado es un
          archivo VTT que se guarda en R2 junto al video. El player lo carga como subtítulo.
        </p>
        <Mermaid
          chart={`
sequenceDiagram
    participant A as Admin
    participant API as Tu API (Convex)
    participant R2 as Cloudflare R2
    participant STT as Transcripción (AssemblyAI o Whisper GPU)
    participant TR as Traducción (Whisper translate o Google)

    A->>API: Generar subtítulos para lección X
    API->>R2: Obtener URL del audio/video
    API->>STT: Transcribir audio (español)
    Note over STT: Procesa audio<br/>AssemblyAI: ~real-time<br/>Whisper GPU: ~8x real-time
    STT-->>API: Transcript ES (formato VTT con timestamps)
    API->>R2: Guardar subtitulos-es.vtt

    API->>TR: Traducir texto ES → EN
    Note over TR: Whisper translate: gratis<br/>Google Translate: $20/M chars
    TR-->>API: Transcript EN
    API->>R2: Guardar subtitulos-en.vtt

    API->>API: Actualizar lesson: subtitles=[es, en]

    Note over A: El player carga .vtt via tag track
          `}
          caption="La transcripción es one-time por video. El costo más bajo es Vast.ai GPU spot ($3 por 100h) o AssemblyAI ($15 por 100h)."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-muted p-4">
            <p className="font-semibold text-sm mb-1">¿Por qué no Bunny Transcribe AI?</p>
            <p className="text-muted-foreground text-sm">
              Bunny cobra $0,10/min/idioma. Para 100 horas en 2 idiomas = $1.200. AssemblyAI cobra $0,0025/min = $15 por
              las mismas 100 horas. Whisper self-hosted en GPU spot = $3. Bunny es 40-400x más caro.
            </p>
          </div>
          <div className="bg-muted p-4">
            <p className="font-semibold text-sm mb-1">¿Whisper translate vs Google Translate?</p>
            <p className="text-muted-foreground text-sm">
              Whisper tiene un modo que transcribe audio en español directamente a texto en inglés, sin costo extra.
              Calidad aceptable para subtítulos. Google Translate ($100/100h) da mejor calidad pero no justifica el
              costo para la mayoría de cursos.
            </p>
          </div>
        </div>

        <h3 className="font-semibold mb-1">Arquitectura completa</h3>
        <p className="text-muted-foreground mb-2">
          Todos los componentes y cómo se conectan. Los costos mensuales están al lado de cada servicio.
        </p>
        <Mermaid
          chart={`
flowchart TB
    subgraph ADMIN["Admin (Browser)"]
        UP[Upload video]
        MANAGE[Gestionar lecciones]
    end

    subgraph CONVEX["Tu API · Convex (gratis hasta 300 usuarios)"]
        AUTH[Verificar acceso]
        PRESIGN[Generar presigned URL]
        JOBS[Cola de jobs]
        PROGRESS[Progress tracking]
        LESSONS[CRUD lecciones]
    end

    subgraph CF["Cloudflare (Workers $5/mes)"]
        WORKER[Worker auth · JWT]
        CDNC[CDN cache · 300+ PoPs · gratis]
        R2DB[(R2 Storage · $0.015/GB · $0 egress)]
    end

    subgraph HETZNER["Hetzner VPS ($57-157/mes)"]
        FFMPEG[FFmpeg transcoder]
        WHISPER[Whisper / faster-whisper]
    end

    subgraph STUDENT["Estudiante (Browser)"]
        PLAYER[hls.js player]
        SUBS[Subtítulos ES/EN]
    end

    subgraph EXTERNAL["APIs externas (pay-per-use)"]
        ASSEMBLY[AssemblyAI · $0.0025/min]
    end

    UP -->|presigned URL| PRESIGN
    UP -->|upload directo| R2DB
    PRESIGN --> R2DB
    MANAGE --> LESSONS
    JOBS -->|transcode job| FFMPEG
    FFMPEG -->|descarga source| R2DB
    FFMPEG -->|sube HLS segments| R2DB
    FFMPEG -->|encoding complete| CONVEX

    JOBS -->|transcribe job| ASSEMBLY
    JOBS -->|o self-hosted| WHISPER
    WHISPER -->|descarga audio| R2DB
    ASSEMBLY -->|VTT result| CONVEX
    WHISPER -->|VTT result| CONVEX
    CONVEX -->|guardar .vtt| R2DB

    PLAYER -->|getVideoAccess| AUTH
    AUTH -->|JWT token| PLAYER
    PLAYER -->|GET segments + JWT| WORKER
    WORKER -->|validar JWT| WORKER
    WORKER --> CDNC
    CDNC -->|cache miss| R2DB
    CDNC -->|stream| PLAYER

    PLAYER -->|progress cada 10s| PROGRESS
    PLAYER -->|cargar .vtt| SUBS
          `}
          caption="Costo mensual total a escala pequeña: Convex gratis + Workers $5 + Hetzner VPS $57 + R2 storage variable = desde ~$65/mes"
        />

        <div className="border border-accent bg-accent/20 p-5 mb-12">
          <p className="font-semibold mb-1">¿Por qué cada pieza?</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 mt-3">
            <p className="text-muted-foreground text-sm">
              <strong className="text-foreground">Convex (gratis):</strong> ya es tu backend. Maneja auth, purchases,
              progress, lessons. No necesitas otro servidor para la lógica.
            </p>
            <p className="text-muted-foreground text-sm">
              <strong className="text-foreground">R2 ($0.015/GB, $0 egress):</strong> almacena videos y subtítulos. El
              zero egress es lo que hace viable servir petabytes sin quebrar.
            </p>
            <p className="text-muted-foreground text-sm">
              <strong className="text-foreground">Worker ($5/mes):</strong> valida JWT en el edge antes de servir cada
              segmento. Sin esto, cualquiera con la URL ve el video gratis.
            </p>
            <p className="text-muted-foreground text-sm">
              <strong className="text-foreground">CDN (gratis):</strong> viene con R2. Cachea segmentos populares en
              300+ PoPs. Reduce reads a R2 en 85-95%.
            </p>
            <p className="text-muted-foreground text-sm">
              <strong className="text-foreground">Hetzner VPS ($57-157):</strong> FFmpeg para transcoding +
              opcionalmente faster-whisper para transcripción. El único costo fijo significativo.
            </p>
            <p className="text-muted-foreground text-sm">
              <strong className="text-foreground">AssemblyAI (pay-per-use):</strong> alternativa a self-hosted Whisper.
              $0,0025/min, sin infraestructura. Mejor para catálogos pequeños (&lt;500h).
            </p>
          </div>
        </div>

        {/* ========== PART 1: VIDEO INFRASTRUCTURE ========== */}
        <h2 className="font-display text-h2 mb-4">Parte 1: Infraestructura de Video a Escala</h2>
        <Separator className="mb-4" />

        <div className="border border-accent bg-accent/20 p-5 mb-8">
          <p className="font-semibold mb-1">Supuestos del modelo</p>
          <p className="text-muted-foreground">
            Catálogo: video original × 2,75 = storage HLS (multi-bitrate 1080p/720p/480p/360p) · Consumo: ~10
            GB/usuario/mes (ABR optimizado) · ~100 Class B ops por vista de video · Cache hit ratio CDN: 85-95%
          </p>
        </div>

        {/* Comparison table */}
        <h3 className="font-semibold mb-3">Comparativa mensual por escala</h3>
        <div className="mb-8 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead>Escala (usuarios)</TableHead>
                <TableHead>Egress</TableHead>
                <TableHead>R2 DIY Total</TableHead>
                <TableHead>Bunny Volume</TableHead>
                <TableHead>Bunny SA Estándar</TableHead>
                <TableHead>Ganador</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scaleComparison.map((row) => (
                <TableRow key={row.tier}>
                  <TableCell className="font-medium">{row.tier}</TableCell>
                  <TableCell className="text-muted-foreground">{row.egress}</TableCell>
                  <TableCell className={row.winner === "r2" ? "text-green-700 font-semibold" : ""}>
                    {row.r2Total}
                  </TableCell>
                  <TableCell className={row.winner === "bunny" ? "text-green-700 font-semibold" : ""}>
                    {row.bunnyVol}
                  </TableCell>
                  <TableCell className="text-red-700">{row.bunnySA}</TableCell>
                  <TableCell>
                    <Badge variant={row.winner === "r2" ? "default" : "secondary"}>
                      {row.winner === "r2" ? "R2 DIY" : "Bunny Vol."}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* R2 DIY Breakdown */}
        <h3 className="font-semibold mb-3">Desglose R2 DIY por tier</h3>
        <div className="mb-8 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead>Escala</TableHead>
                <TableHead>R2 Storage</TableHead>
                <TableHead>R2 Ops</TableHead>
                <TableHead>Workers</TableHead>
                <TableHead>Cómputo FFmpeg</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scaleComparison.map((row) => (
                <TableRow key={row.tier}>
                  <TableCell className="font-medium">{row.tier}</TableCell>
                  <TableCell>{row.r2Storage}</TableCell>
                  <TableCell>{row.r2Ops}</TableCell>
                  <TableCell>{row.r2Workers}</TableCell>
                  <TableCell>{row.r2Compute}</TableCell>
                  <TableCell className="font-semibold">{row.r2Total}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* R2 Pricing Reference */}
        <h3 className="font-semibold mb-3">Precios de referencia: Cloudflare R2</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-muted p-5">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">R2 Storage</h4>
            <Table>
              <TableBody>
                {r2Pricing.map(([item, price, note]) => (
                  <TableRow key={item}>
                    <TableCell className="font-medium">{item}</TableCell>
                    <TableCell>{price}</TableCell>
                    {note && <TableCell className="text-muted-foreground text-xs">{note}</TableCell>}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="bg-muted p-5">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Cloudflare Workers
            </h4>
            <Table>
              <TableBody>
                {workersPricing.map(([item, price]) => (
                  <TableRow key={item}>
                    <TableCell className="font-medium">{item}</TableCell>
                    <TableCell>{price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Compute for transcoding */}
        <h3 className="font-semibold mb-3">Cómputo para transcoding (FFmpeg)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-muted p-5">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Servidores disponibles
            </h4>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted hover:bg-muted">
                  <TableHead>Servidor</TableHead>
                  <TableHead>Specs</TableHead>
                  <TableHead>Precio</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {computePricing.map(([name, specs, price]) => (
                  <TableRow key={name}>
                    <TableCell className="font-medium">{name}</TableCell>
                    <TableCell className="text-muted-foreground">{specs}</TableCell>
                    <TableCell>{price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="bg-muted p-5">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Tiempo de transcode (1h de video 1080p → HLS multi-bitrate)
            </h4>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted hover:bg-muted">
                  <TableHead>Servidor</TableHead>
                  <TableHead>Tiempo</TableHead>
                  <TableHead>Jobs simultáneos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transcodeTimes.map(([server, time, jobs]) => (
                  <TableRow key={server}>
                    <TableCell className="font-medium">{server}</TableCell>
                    <TableCell>{time}</TableCell>
                    <TableCell className="text-muted-foreground">{jobs}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Bunny Network Pricing */}
        <h3 className="font-semibold mb-3">Precios de referencia: Bunny Stream</h3>
        <div className="bg-muted p-5 mb-8">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead>Red / Región</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Notas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bunnyNetworkPricing.map(([network, price, note]) => (
                <TableRow key={network}>
                  <TableCell className="font-medium">{network}</TableCell>
                  <TableCell>{price}</TableCell>
                  <TableCell className="text-muted-foreground">{note}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <p className="text-muted-foreground mt-3 text-sm">
            <strong className="text-foreground">Para LATAM:</strong> La red estándar Sudamérica ($0,045/GB) es 9x más
            cara que EU/NA. La Volume Network ($0,005/GB) reduce drásticamente los costos pero tiene menos PoPs en la
            región.
          </p>
        </div>

        {/* Inflection Point */}
        <div className="bg-muted/50 border border-green-200 p-5 mb-12">
          <p className="font-semibold mb-2">Punto de inflexión: ¿cuándo migrar a R2 DIY?</p>
          <p className="text-muted-foreground">
            Con Bunny Volume Network, R2 DIY empieza a ser más barato a partir de ~10.000 usuarios (~100 TB/mes de
            egress). Con la red estándar de Sudamérica, R2 DIY gana desde ~100 usuarios. La recomendación es{" "}
            <strong className="text-foreground">
              comenzar con Bunny Stream (Volume Network) y migrar a R2 DIY cuando el egress supere ~50 TB/mes
            </strong>
            , momento en que el ahorro justifica la complejidad operacional.
          </p>
        </div>

        {/* ========== PART 2: TRANSCRIPTION ========== */}
        <h2 className="font-display text-h2 mb-4">Parte 2: Transcripción y Subtítulos</h2>
        <Separator className="mb-4" />

        <div className="border border-accent bg-accent/20 p-5 mb-8">
          <p className="font-semibold mb-1">Contexto</p>
          <p className="text-muted-foreground">
            Bunny Transcribe AI cobra $0,10/min/idioma. Esto es{" "}
            <strong className="text-foreground">40x más caro</strong> que AssemblyAI y{" "}
            <strong className="text-foreground">33x más caro</strong> que OpenAI Whisper API. Para un catálogo de 100
            horas: Bunny = $600, AssemblyAI = $15, self-hosted GPU = $3.
          </p>
        </div>

        {/* Cloud APIs */}
        <h3 className="font-semibold mb-3">APIs cloud de transcripción (pay-per-use)</h3>
        <div className="mb-8 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead>Proveedor</TableHead>
                <TableHead>Modelo</TableHead>
                <TableHead>$/min</TableHead>
                <TableHead>$/hora</TableHead>
                <TableHead>Nota</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cloudTranscription.map((row) => (
                <TableRow key={`${row.provider}-${row.model}`} className={row.best ? "bg-green-50" : ""}>
                  <TableCell className="font-medium">{row.provider}</TableCell>
                  <TableCell>{row.model}</TableCell>
                  <TableCell>{row.perMin}</TableCell>
                  <TableCell className={row.best ? "text-green-700 font-semibold" : ""}>{row.perHr}</TableCell>
                  <TableCell className="text-muted-foreground">{row.note}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Self-hosted Whisper */}
        <h3 className="font-semibold mb-3">Whisper self-hosted: modelos y rendimiento en CPU</h3>
        <div className="mb-8 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead>Modelo</TableHead>
                <TableHead>Disco</TableHead>
                <TableHead>RAM</TableHead>
                <TableHead>Velocidad (CPU 8-core)</TableHead>
                <TableHead>Precisión (WER)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {whisperModels.map(([model, disk, ram, speed, accuracy]) => (
                <TableRow key={model} className={model === "medium" ? "bg-green-50" : ""}>
                  <TableCell className="font-medium">{model}</TableCell>
                  <TableCell>{disk}</TableCell>
                  <TableCell>{ram}</TableCell>
                  <TableCell>{speed}</TableCell>
                  <TableCell className="text-muted-foreground">{accuracy}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <p className="text-xs text-muted-foreground mt-2">
            Para español (idioma de alto recurso en Whisper), el modelo <strong>medium</strong> ofrece el mejor balance
            precisión/velocidad en CPU. En GPU, <strong>large-v3</strong> es viable a ~8-12x real-time.
          </p>
        </div>

        {/* GPU hosting */}
        <h3 className="font-semibold mb-3">Hosting GPU para Whisper</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-muted p-5">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Opciones de GPU cloud
            </h4>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted hover:bg-muted">
                  <TableHead>Proveedor</TableHead>
                  <TableHead>GPU</TableHead>
                  <TableHead>Precio</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {gpuHosting.map(([provider, gpu, price]) => (
                  <TableRow key={`${provider}-${gpu}`}>
                    <TableCell className="font-medium">{provider}</TableCell>
                    <TableCell>{gpu}</TableCell>
                    <TableCell>{price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="bg-muted p-5">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Rendimiento con faster-whisper
            </h4>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted hover:bg-muted">
                  <TableHead>Setup</TableHead>
                  <TableHead>Tiempo/hora audio</TableHead>
                  <TableHead>Capacidad</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selfHostedAnalysis.map(([setup, time, capacity]) => (
                  <TableRow key={setup}>
                    <TableCell className="font-medium">{setup}</TableCell>
                    <TableCell>{time}</TableCell>
                    <TableCell className="text-muted-foreground">{capacity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Break-even */}
        <div className="bg-muted/50 border border-border p-5 mb-8">
          <p className="font-semibold mb-2">Break-even: self-hosted vs API</p>
          <p className="text-muted-foreground">
            Hetzner GEX44 (GPU) a $184/mes puede procesar ~5.400+ horas/mes. Break-even vs AssemblyAI ($0,15/hr):{" "}
            <strong className="text-foreground">1.227 horas/mes</strong>. Para catálogos one-time de 100-500 horas,{" "}
            <strong className="text-foreground">las APIs cloud o GPU spot son la mejor opción</strong>. Self-hosted solo
            justifica si transcribes &gt;500 hrs/mes continuamente.
          </p>
        </div>

        {/* Cost scenarios */}
        <h3 className="font-semibold mb-3">Escenario: 100 horas de contenido (6.000 min)</h3>
        <div className="mb-8">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead>Opción</TableHead>
                <TableHead>Cálculo</TableHead>
                <TableHead>Costo total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transcriptionScenarios100.map((row) => (
                <TableRow
                  key={row.option}
                  className={
                    row.option === "Bunny Transcribe AI"
                      ? "bg-red-50"
                      : row.option.includes("Vast")
                        ? "bg-green-50"
                        : ""
                  }
                >
                  <TableCell className="font-medium">{row.option}</TableCell>
                  <TableCell className="text-muted-foreground">{row.calc}</TableCell>
                  <TableCell
                    className={
                      row.option === "Bunny Transcribe AI"
                        ? "text-red-700 font-semibold"
                        : row.option.includes("Vast")
                          ? "text-green-700 font-semibold"
                          : "font-semibold"
                    }
                  >
                    {row.cost}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <h3 className="font-semibold mb-3">Escenario: 500 horas de contenido (30.000 min)</h3>
        <div className="mb-8">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead>Opción</TableHead>
                <TableHead>Cálculo</TableHead>
                <TableHead>Costo total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transcriptionScenarios500.map((row) => (
                <TableRow
                  key={row.option}
                  className={
                    row.option === "Bunny Transcribe AI"
                      ? "bg-red-50"
                      : row.option.includes("Vast")
                        ? "bg-green-50"
                        : ""
                  }
                >
                  <TableCell className="font-medium">{row.option}</TableCell>
                  <TableCell className="text-muted-foreground">{row.calc}</TableCell>
                  <TableCell
                    className={
                      row.option === "Bunny Transcribe AI"
                        ? "text-red-700 font-semibold"
                        : row.option.includes("Vast")
                          ? "text-green-700 font-semibold"
                          : "font-semibold"
                    }
                  >
                    {row.cost}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* ========== PART 3: TRANSLATION ========== */}
        <h2 className="font-display text-h2 mb-4">Parte 3: Traducción ES → EN</h2>
        <Separator className="mb-4" />

        <h3 className="font-semibold mb-3">Opciones de traducción después de transcribir</h3>
        <div className="mb-8">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead>Opción</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Costo estimado</TableHead>
                <TableHead>Nota</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {translationPricing.map(([option, price, cost, note]) => (
                <TableRow key={option} className={option.includes("Whisper") ? "bg-green-50" : ""}>
                  <TableCell className="font-medium">{option}</TableCell>
                  <TableCell>{price}</TableCell>
                  <TableCell>{cost}</TableCell>
                  <TableCell className="text-muted-foreground">{note}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <p className="text-xs text-muted-foreground mt-2">
            Whisper tiene un modo <code>translate</code> que transcribe audio en cualquier idioma directamente a texto
            en inglés, sin costo extra. Calidad aceptable para subtítulos; para traducción profesional, usar Google
            Translate o DeepL.
          </p>
        </div>

        {/* Total bilingual cost */}
        <h3 className="font-semibold mb-3">Costo total bilingüe (transcripción ES + traducción EN)</h3>
        <div className="mb-8">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead>Contenido</TableHead>
                <TableHead>Opción más barata</TableHead>
                <TableHead>Costo mínimo</TableHead>
                <TableHead>Alternativa con API de traducción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bilingualTotal.map((row) => (
                <TableRow key={row.hours}>
                  <TableCell className="font-medium">{row.hours}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {row.bestTranscription} + {row.bestTranslation}
                  </TableCell>
                  <TableCell className="text-green-700 font-semibold">{row.total}</TableCell>
                  <TableCell className="text-muted-foreground">{row.altTotal}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Recommendation */}
        <div className="bg-muted ring-1 ring-green-200 p-5 mb-12">
          <h3 className="font-semibold text-green-700 mb-3">Recomendación para KMakeup</h3>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium w-1/4">Video (MVP)</TableCell>
                <TableCell className="text-muted-foreground">
                  <strong className="text-foreground">Bunny Stream Volume Network</strong> (~$10-70/mes). Más simple y
                  barato que R2 DIY hasta ~10.000 usuarios.
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Video (escala)</TableCell>
                <TableCell className="text-muted-foreground">
                  Migrar a <strong className="text-foreground">Cloudflare R2 DIY</strong> cuando egress supere ~50
                  TB/mes. Ahorro: 40-90% vs Bunny.
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Transcripción</TableCell>
                <TableCell className="text-muted-foreground">
                  <strong className="text-foreground">NO usar Bunny Transcribe AI</strong> ($0,10/min). Usar{" "}
                  <strong className="text-foreground">AssemblyAI</strong> ($0,0025/min) o{" "}
                  <strong className="text-foreground">Vast.ai spot GPU</strong> (~$3 por 100 horas).
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Traducción EN</TableCell>
                <TableCell className="text-muted-foreground">
                  Usar <strong className="text-foreground">Whisper translate mode</strong> (gratis, incluido) para
                  subtítulos. Google Translate API para calidad profesional (~$100/100h).
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <footer className="border-t border-border pt-8 mt-14 text-center text-sm text-muted-foreground">
          <p>Análisis de costos para KMakeup Platform · Datos actualizados a junio 2026</p>
          <p className="mt-2">
            Ver también:{" "}
            <Link to="/video-costs" className="text-foreground underline underline-offset-2 hover:opacity-70">
              Costos de Video Streaming
            </Link>
            {" · "}
            <Link to="/bunny-vs-r2" className="text-foreground underline underline-offset-2 hover:opacity-70">
              Bunny vs R2 Features
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
