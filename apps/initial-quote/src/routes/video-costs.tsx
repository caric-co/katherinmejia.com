import { createFileRoute, Link } from "@tanstack/react-router"
import { ArrowLeft } from "lucide-react"
import { Button } from "@repo/ui/components/button"
import { Badge } from "@repo/ui/components/badge"
import { DataTable, type ColumnDef } from "@repo/ui/components/data-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table"
import { Separator } from "@repo/ui/components/separator"

export const Route = createFileRoute("/video-costs")({
  component: VideoCostsPage,
})

const noDrmData = [
  { users: "10", bunny: "$5", mux: "$9", cloudflare: "$22", r2: "$7", s3: "$16", best: "bunny" },
  { users: "50", bunny: "$18", mux: "$9", cloudflare: "$29", r2: "$7", s3: "$67", best: "bunny" },
  { users: "100", bunny: "$35", mux: "$9", cloudflare: "$38", r2: "$7", s3: "$131", best: "mux" },
  { users: "500", bunny: "$170", mux: "$9", cloudflare: "$110", r2: "$8", s3: "$641", best: "mux" },
  { users: "1.000", bunny: "$339", mux: "$89", cloudflare: "$200", r2: "$8", s3: "$1.278", best: "r2" },
]

const drmData = [
  { users: "10", bunnyBasic: "$5", bunnyEnterprise: "$104", mux: "$109", cloudflare: "N/A", best: "bunnyBasic" },
  { users: "50", bunnyBasic: "$18", bunnyEnterprise: "$121", mux: "$111", cloudflare: "N/A", best: "bunnyBasic" },
  { users: "100", bunnyBasic: "$35", bunnyEnterprise: "$138", mux: "$113", cloudflare: "N/A", best: "bunnyBasic" },
  { users: "500", bunnyBasic: "$170", bunnyEnterprise: "$269", mux: "$127", cloudflare: "N/A", best: "bunnyBasic" },
  { users: "1.000", bunnyBasic: "$339", bunnyEnterprise: "$438", mux: "$225", cloudflare: "N/A", best: "bunnyBasic" },
]

const providers = [
  {
    name: "Bunny Stream",
    badge: "Recomendado",
    badgeVariant: "default" as const,
    pricing: [
      ["Almacenamiento", "$0,01/GB/mes"],
      ["Codificación estándar", "Gratis (H.264 hasta 1080p)"],
      ["CDN América del Sur", "$0,045/GB"],
      ["CDN Red de Volumen", "$0,005/GB (tarifa plana, 10 PoPs)"],
      ["DRM MediaCage Básico", "Gratis (cifrado dinámico)"],
      ["DRM MediaCage Enterprise", "$99/mes + $0,005/licencia"],
      ["Transmisión en vivo", "Solo costo de ancho de banda CDN"],
      ["Mínimo mensual", "$1"],
    ],
    note: "El ancho de banda para Sudamérica a $0,045/GB es 4,5x más caro que EU/NA. A 500 usuarios el costo mensual llega a ~$170. La Red de Volumen ($0,005/GB) reduce esto drásticamente pero tiene menos puntos de presencia en LATAM.",
  },
  {
    name: "Mux",
    badge: "Alternativa Premium",
    badgeVariant: "secondary" as const,
    pricing: [
      ["Codificación (Basic)", "Gratis"],
      ["Almacenamiento (1080p)", "$0,003/min/mes"],
      ["Entrega (1080p)", "$0,001/min (primeros 100K min gratis)"],
      ["DRM", "$100/mes + $0,003/reproducción"],
      ["Transmisión en vivo", "Costos de codificación superiores"],
    ],
    note: "Los 100K minutos gratuitos cubren hasta ~556 usuarios (180 min/usuario/mes). Por debajo de ese umbral, Mux es extraordinariamente económico ($9/mes). El DRM a $100/mes fijo lo hace inviable para plataformas pequeñas.",
  },
  {
    name: "Cloudflare Stream",
    badge: "Sin DRM",
    badgeVariant: "destructive" as const,
    pricing: [
      ["Almacenamiento", "$5/1.000 min ($0,005/min)"],
      ["Entrega", "$1/1.000 min ($0,001/min)"],
      ["Codificación", "Gratis"],
      ["Plan Workers requerido", "$5/mes"],
      ["DRM", "No disponible"],
    ],
    note: "La ausencia de DRM lo descalifica para contenido de pago. Precio lineal sin descuentos por volumen.",
  },
  {
    name: "Cloudflare R2 Autoalojado",
    badge: "Más Económico a Escala",
    badgeVariant: "secondary" as const,
    pricing: [
      ["Almacenamiento R2", "$0,015/GB/mes (10 GB gratis)"],
      ["Egreso R2", "$0 (GRATIS)"],
      ["Operaciones GET", "$0,36/millón de solicitudes"],
      ["Workers", "$5/mes"],
      ["Transcodificación", "DIY con FFmpeg (costo único)"],
      ["DRM", "No incluido (URLs firmadas como alternativa)"],
    ],
    note: "El egreso gratuito de R2 lo convierte en el más barato a cualquier escala (~$7-8/mes constante). Sin embargo, requiere 40-80 horas de desarrollo para pipeline de transcodificación, generación de manifiestos HLS, reproductor personalizado y control de acceso. A $50/hora, eso equivale a $2.000-4.000.",
  },
]

const recommendation = [
  { scale: "Inicio (10-50 usuarios)", rec: "Bunny Stream + DRM Básico", detail: "$5-18/mes. Sin desarrollo adicional para infraestructura de video." },
  { scale: "Escala (100-500)", rec: "Continuar con Bunny Stream", detail: "$35-170/mes. Evaluar Red de Volumen si la cobertura LATAM es aceptable." },
  { scale: "Escala (1.000+)", rec: "Evaluar híbrido", detail: "Bunny para DRM/reproductor/codificación con R2 como almacenamiento origen. A $339/mes, Bunny sigue siendo razonable." },
  { scale: "Transmisión en vivo", rec: "Bunny Stream Live", detail: "Ingesta RTMP (compatible OBS), codificación estándar gratis, solo costo de ancho de banda CDN." },
]

function VideoCostsPage() {
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

        <p className="text-sm text-muted-foreground uppercase tracking-widest mb-3">
          Investigación Técnica
        </p>
        <h1 className="font-display text-h1 tracking-tight mb-3">
          Costos de Video Streaming y Almacenamiento
        </h1>
        <p className="text-muted-foreground mb-8 max-w-3xl">
          Análisis comparativo de proveedores de video para la plataforma de
          cursos de KMakeup. Enfoque en audiencia latinoamericana (Colombia) con
          escala de 10 a 1.000+ usuarios.
        </p>

        <div className="border border-accent bg-accent/20 p-5 mb-12">
          <p className="font-semibold mb-1">Supuestos base para todos los cálculos:</p>
          <p className="text-muted-foreground">
            Contenido almacenado: ~50 horas (3.000 minutos, ~150 GB tras
            codificación multi-bitrate) · Consumo promedio por usuario: 3
            horas/mes (180 min, ~7,5 GB) · Resolución máxima: 1080p · Región
            principal: América del Sur (Colombia)
          </p>
        </div>

        {/* Comparison tables */}
        <h2 className="font-display text-h2 mb-4">
          Comparativa de Costos Mensuales (USD, sin DRM)
        </h2>
        <Separator className="mb-4" />
        <div className="border border-border mb-12">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead>Usuarios</TableHead>
                <TableHead>Bunny Stream (SA)</TableHead>
                <TableHead>Mux</TableHead>
                <TableHead>Cloudflare Stream</TableHead>
                <TableHead>R2 Autoalojado</TableHead>
                <TableHead>S3+CloudFront (SA)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {noDrmData.map((row) => (
                <TableRow key={row.users}>
                  <TableCell className="font-semibold">{row.users}</TableCell>
                  <TableCell className={row.best === "bunny" ? "bg-accent/30 font-semibold" : ""}>{row.bunny}</TableCell>
                  <TableCell className={row.best === "mux" ? "bg-accent/30 font-semibold" : ""}>{row.mux}</TableCell>
                  <TableCell>{row.cloudflare}</TableCell>
                  <TableCell className={row.best === "r2" ? "bg-accent/30 font-semibold" : ""}>{row.r2}</TableCell>
                  <TableCell>{row.s3}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <h2 className="font-display text-h2 mb-4">
          Comparativa con DRM
        </h2>
        <Separator className="mb-4" />
        <div className="border border-border mb-12">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead>Usuarios</TableHead>
                <TableHead>Bunny (DRM básico, gratis)</TableHead>
                <TableHead>Bunny (DRM Enterprise)</TableHead>
                <TableHead>Mux DRM</TableHead>
                <TableHead>Cloudflare</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {drmData.map((row) => (
                <TableRow key={row.users}>
                  <TableCell className="font-semibold">{row.users}</TableCell>
                  <TableCell className="bg-accent/30 font-semibold">{row.bunnyBasic}</TableCell>
                  <TableCell>{row.bunnyEnterprise}</TableCell>
                  <TableCell>{row.mux}</TableCell>
                  <TableCell className="text-muted-foreground">{row.cloudflare}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Provider detail cards */}
        <h2 className="font-display text-h2 mb-4">
          Detalle por Proveedor
        </h2>
        <Separator className="mb-4" />
        <div className="space-y-4 mb-12">
          {providers.map((p) => (
            <div key={p.name} className="border border-border bg-card p-5">
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-lg font-semibold">{p.name}</h3>
                <Badge variant={p.badgeVariant}>{p.badge}</Badge>
              </div>
              <div className="border border-border mb-3">
                <Table>
                  <TableBody>
                    {p.pricing.map(([item, price]) => (
                      <TableRow key={item}>
                        <TableCell className="font-medium w-1/3">{item}</TableCell>
                        <TableCell>{price}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <p className="text-sm text-muted-foreground">{p.note}</p>
            </div>
          ))}
        </div>

        {/* Optimization */}
        <h2 className="font-display text-h2 mb-4">
          Estrategias de Optimización de Costos
        </h2>
        <Separator className="mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          <div className="border border-border bg-card p-5">
            <h3 className="font-semibold mb-3">Reducir Ancho de Banda</h3>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li>— Limitar a 720p + 1080p (sin 4K): ahorro ~20-30%</li>
              <li>— H.265/HEVC: 30-50% más pequeño que H.264</li>
              <li>— Tutoriales de maquillaje son mayormente estáticos: CRF encoding produce archivos más pequeños</li>
              <li>— Objetivo: 2-3 Mbps para 1080p en vez de 5 Mbps</li>
              <li className="font-medium text-foreground">— Reducción estimada: de 7,5 GB a ~4 GB/usuario/mes</li>
            </ul>
          </div>
          <div className="border border-border bg-card p-5">
            <h3 className="font-semibold mb-3">Protección de Contenido</h3>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li>— URLs firmadas con expiración (4-24 horas): previene compartir enlaces</li>
              <li>— Restricción por dominio: previene incrustación externa</li>
              <li>— Tokens vinculados a IP (cuidado con redes móviles)</li>
              <li>— MediaCage Basic de Bunny es suficiente para prevenir descarga casual</li>
            </ul>
          </div>
        </div>

        {/* Recommendation */}
        <h2 className="font-display text-h2 mb-4">
          Recomendación para KMakeup
        </h2>
        <Separator className="mb-4" />
        <div className="border-2 border-foreground/20 bg-card p-5 mb-12">
          <h3 className="font-semibold mb-3">Ruta Recomendada</h3>
          <div className="border border-border">
            <Table>
              <TableBody>
                {recommendation.map((r) => (
                  <TableRow key={r.scale}>
                    <TableCell className="font-medium w-1/4">{r.scale}</TableCell>
                    <TableCell>
                      <strong>{r.rec}</strong>: {r.detail}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <footer className="border-t border-border pt-8 mt-14 text-center text-sm text-muted-foreground">
          <p>Investigación realizada para KMakeup Platform · Datos actualizados a junio 2026</p>
          <p className="mt-2">
            Preparado por{" "}
            <a href="https://github.com/demarchenac" target="_blank" rel="noopener noreferrer" className="text-foreground font-semibold hover:opacity-70 transition-opacity">
              Cristhian De Marchena
            </a>
          </p>
        </footer>
      </div>
    </div>
  )
}
