import { createFileRoute, Link } from "@tanstack/react-router"
import { ArrowLeft } from "lucide-react"
import { Button } from "@repo/ui/components/button"
import { Badge } from "@repo/ui/components/badge"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter,
} from "@repo/ui/components/table"

export const Route = createFileRoute("/pricing")({
  component: PricingPage,
})

const services = [
  { name: "Vercel", desc: "Alojamiento", detail: "$20/mes (Plan Pro, requerido para uso comercial)", sub: "Incluye 1 TB de ancho de banda, CI/CD, previews. Suficiente hasta ~10.000 usuarios." },
  { name: "Convex", desc: "Backend", detail: "$0 hasta ~440 usuarios (1M llamadas gratis/mes)", sub: "Pro a $25/mes cubre hasta 25M llamadas. Se estiman ~2.250 llamadas/usuario/mes." },
  { name: "Bunny Stream", desc: "Video", detail: "Principal generador de costo. $0,045/GB en Sudamérica.", sub: "150 GB almacenados ($1,50/mes) + ~7,5 GB/usuario/mes de ancho de banda. DRM básico gratis." },
  { name: "UploadThing", desc: "Archivos", detail: "$0 hasta 2 GB (miniaturas, portadas, portafolio)", sub: "$10/mes por 100 GB si se excede. Suficiente gratis hasta ~5.000 usuarios." },
  { name: "Resend", desc: "Correo", detail: "$0 hasta 3.000 correos/mes (~2.000 usuarios)", sub: "$20/mes para 50.000 correos. Se estiman ~1,4 correos/usuario/mes." },
  { name: "Otros", desc: "Auth, Analytics, AI", detail: "Better Auth: $0 · PostHog: $0 hasta 1M eventos/mes · Sentry: $0 hasta 5K errores/mes", sub: "Mistral API: ~$0,01/mes (negligible) · Dominio: $1/mes (~$12/año)" },
]

const costTable = [
  { users: "10", vercel: "$20", convex: "$0", bunny: "$5", upload: "$0", resend: "$0", otros: "$1", totalUsd: "$26", totalCop: "$96.200", highlight: true },
  { users: "20", vercel: "$20", convex: "$0", bunny: "$8", upload: "$0", resend: "$0", otros: "$1", totalUsd: "$29", totalCop: "$107.300" },
  { users: "50", vercel: "$20", convex: "$0", bunny: "$18", upload: "$0", resend: "$0", otros: "$1", totalUsd: "$39", totalCop: "$144.300" },
  { users: "100", vercel: "$20", convex: "$0", bunny: "$35", upload: "$0", resend: "$0", otros: "$1", totalUsd: "$56", totalCop: "$207.200" },
  { users: "500", vercel: "$20", convex: "$25", bunny: "$170", upload: "$0", resend: "$0", otros: "$1", totalUsd: "$216", totalCop: "$799.200" },
  { users: "1.000", vercel: "$20", convex: "$25", bunny: "$339", upload: "$0", resend: "$0", otros: "$1", totalUsd: "$385", totalCop: "$1.424.500" },
  { users: "5.000", vercel: "$20", convex: "$25", bunny: "$1.689", upload: "$10", resend: "$20", otros: "$27", totalUsd: "$1.791", totalCop: "$6.626.700" },
  { users: "10.000", vercel: "$20", convex: "$25", bunny: "$3.377", upload: "$10", resend: "$20", otros: "$67", totalUsd: "$3.519", totalCop: "$13.020.300" },
  { users: "25.000", vercel: "$150", convex: "$88", bunny: "$938", upload: "$10", resend: "$20", otros: "$203", totalUsd: "$1.409", totalCop: "$5.213.300", divider: true },
  { users: "50.000", vercel: "$400", convex: "$200", bunny: "$1.875", upload: "$10", resend: "$50", otros: "$429", totalUsd: "$2.964", totalCop: "$10.966.800" },
  { users: "100.000", vercel: "$400", convex: "$425", bunny: "$3.750", upload: "$25", resend: "$50", otros: "$882", totalUsd: "$5.532", totalCop: "$20.468.400" },
  { users: "250.000", vercel: "$1.500", convex: "$1.100", bunny: "$9.375", upload: "$25", resend: "$200", otros: "$2.176", totalUsd: "$14.376", totalCop: "$53.191.200" },
  { users: "500.000", vercel: "$2.500", convex: "$2.225", bunny: "$18.750", upload: "$25", resend: "$200", otros: "$4.326", totalUsd: "$28.026", totalCop: "$103.696.200" },
  { users: "1.000.000", vercel: "$5.000", convex: "$4.475", bunny: "$37.500", upload: "$25", resend: "$400", otros: "$8.626", totalUsd: "$56.026", totalCop: "$207.296.200" },
]

const revenueTable = [
  { users: "10", revenue: "$677.100", platform: "$96.200", bold: "$22.100", total: "$118.300", profit: "$558.800", margin: "82,5%" },
  { users: "20", revenue: "$1.354.200", platform: "$107.300", bold: "$44.100", total: "$151.400", profit: "$1.202.800", margin: "88,8%" },
  { users: "50", revenue: "$3.385.500", platform: "$144.300", bold: "$110.400", total: "$254.700", profit: "$3.130.800", margin: "92,5%" },
  { users: "100", revenue: "$6.771.000", platform: "$207.200", bold: "$220.700", total: "$427.900", profit: "$6.343.100", margin: "93,7%" },
  { users: "500", revenue: "$33.855.000", platform: "$799.200", bold: "$1.103.700", total: "$1.902.900", profit: "$31.952.100", margin: "94,4%" },
  { users: "1.000", revenue: "$67.710.000", platform: "$1.424.500", bold: "$2.207.300", total: "$3.631.800", profit: "$64.078.200", margin: "94,6%" },
  { users: "5.000", revenue: "$338.550.000", platform: "$6.626.700", bold: "$11.036.700", total: "$17.663.400", profit: "$320.886.600", margin: "94,8%" },
  { users: "10.000", revenue: "$677.100.000", platform: "$13.020.300", bold: "$22.073.500", total: "$35.093.800", profit: "$642.006.200", margin: "94,8%" },
  { users: "100.000", revenue: "$6.771.000.000", platform: "$20.468.400", bold: "$220.734.600", total: "$241.203.000", profit: "$6.529.797.000", margin: "96,4%", divider: true },
  { users: "1.000.000", revenue: "$67.710.000.000", platform: "$207.296.200", bold: "$2.207.346.000", total: "$2.414.642.200", profit: "$65.295.357.800", margin: "96,4%" },
]

const freeTiers = [
  { service: "Convex", limit: "1M llamadas/mes", exceeds: "~440 usuarios activos", cost: "$25/mes (Pro)" },
  { service: "UploadThing", limit: "2 GB almacenamiento", exceeds: "~5.000 usuarios (con fotos de perfil)", cost: "$10/mes" },
  { service: "Resend", limit: "3.000 correos/mes", exceeds: "~2.000 usuarios activos", cost: "$20/mes" },
  { service: "PostHog", limit: "1M eventos/mes", exceeds: "~5.500 usuarios activos", cost: "~$0,05/1K eventos" },
  { service: "Sentry", limit: "5K errores/mes", exceeds: "~3.000-5.000 usuarios", cost: "$26/mes (Team)" },
]

const milestones = [
  { users: "1", event: "Lanzamiento", action: "Activar Vercel Pro ($20/mes)", impact: "+$20/mes" },
  { users: "~440", event: "Convex free tier agotado", action: "Upgrade a Convex Pro", impact: "+$25/mes" },
  { users: "~2.000", event: "Resend free tier agotado", action: "Upgrade a Resend Pro", impact: "+$20/mes" },
  { users: "~5.000", event: "Sentry + UploadThing free agotados", action: "Upgrade ambos planes", impact: "+$36/mes" },
  { users: "~10.000-25.000", event: "Punto de inflexión de Bunny", action: "Migrar a Red de Volumen ($0,005/GB)", impact: "-80% en video", highlight: true },
  { users: "~100.000+", event: "Escala enterprise", action: "Negociar contratos con todos los proveedores", impact: "Reducción 20-40%" },
]

function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8 print:hidden">
          <Link to="/"><Button variant="ghost" size="sm"><ArrowLeft data-icon="inline-start" className="size-3.5" />Volver al índice</Button></Link>
        </div>

        <p className="text-sm text-muted-foreground uppercase tracking-widest mb-3">Análisis Financiero</p>
        <h1 className="font-display text-h1 tracking-tight mb-3">Costos de Plataforma y Modelo de Precios</h1>
        <p className="text-muted-foreground mb-10 max-w-3xl">
          Desglose completo de costos operativos mensuales por servicio y escala de usuarios, con modelo de precios recomendado para alcanzar 50-80% de margen de ganancia en pesos colombianos. TRM: $3.700.
        </p>

        {/* Key stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { value: "$26", label: "USD/mes con 10 usuarios" },
            { value: "82%", label: "Margen mínimo (10 usuarios)" },
            { value: "94%", label: "Margen a 500+ usuarios" },
            { value: "$0", label: "Costo fijo Bold.co" },
          ].map((s) => (
            <div key={s.label} className="text-center border border-border bg-card p-4">
              <div className="font-display text-3xl">{s.value}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Service cards */}
        <h2 className="font-display text-h2 mb-4 border-b border-border pb-2">Costo por Servicio</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {services.map((s) => (
            <div key={s.name} className="border border-border bg-card p-5">
              <h3 className="font-semibold">{s.name} <span className="font-normal text-muted-foreground text-sm">{s.desc}</span></h3>
              <p className="mt-1"><strong>{s.detail.split(".")[0]}.</strong></p>
              <p className="text-sm text-muted-foreground mt-1">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Cost table */}
        <h2 className="font-display text-h2 mb-4 border-b border-border pb-2">Costo Total Mensual por Escala</h2>
        <div className="border border-border mb-4">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead>Usuarios</TableHead>
                <TableHead>Vercel</TableHead>
                <TableHead>Convex</TableHead>
                <TableHead>Bunny</TableHead>
                <TableHead>Upload</TableHead>
                <TableHead>Resend</TableHead>
                <TableHead>Otros</TableHead>
                <TableHead className="text-right">Total USD</TableHead>
                <TableHead className="text-right">Total COP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {costTable.map((row) => (
                <TableRow key={row.users} className={row.highlight ? "bg-accent/20" : row.divider ? "border-t-2 border-foreground/20" : ""}>
                  <TableCell className="font-semibold">{row.users}</TableCell>
                  <TableCell>{row.vercel}</TableCell>
                  <TableCell>{row.convex}</TableCell>
                  <TableCell>{row.bunny}</TableCell>
                  <TableCell>{row.upload}</TableCell>
                  <TableCell>{row.resend}</TableCell>
                  <TableCell>{row.otros}</TableCell>
                  <TableCell className="text-right font-semibold">{row.totalUsd}</TableCell>
                  <TableCell className="text-right">{row.totalCop}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <p className="text-xs text-muted-foreground mb-12">A partir de 25K, Bunny migra a Red de Volumen ($0,005/GB plano), reduciendo el costo de video ~9x.</p>

        {/* Pricing model */}
        <h2 className="font-display text-h2 mb-4 border-b border-border pb-2">Modelo de Precios Recomendado</h2>
        <p className="text-muted-foreground mb-6">Precios posicionados para el mercado colombiano de cursos de maquillaje. Por debajo de academias premium ($300-500K COP) pero por encima de cursos masivos tipo Domestika ($37-111K COP).</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="border border-border bg-card p-6 text-center">
            <Badge variant="outline" className="mb-3">Mensual</Badge>
            <div className="font-display text-3xl">$79.900</div>
            <div className="text-sm text-muted-foreground">COP / mes</div>
            <div className="text-xs text-muted-foreground mt-1">~$21,59 USD</div>
            <ul className="text-left text-sm text-muted-foreground mt-4 space-y-1">
              <li>— Acceso a todos los cursos</li>
              <li>— Transmisiones en vivo</li>
              <li>— Contenido nuevo mensual</li>
              <li>— Cancela cuando quieras</li>
            </ul>
          </div>
          <div className="border-2 border-foreground bg-card p-6 text-center">
            <Badge className="mb-3">Anual: 20% dto.</Badge>
            <div className="font-display text-3xl">$769.000</div>
            <div className="text-sm text-muted-foreground">COP / año ($64.083/mes)</div>
            <div className="text-xs text-muted-foreground mt-1">~$207,84 USD/año ($17,32/mes)</div>
            <ul className="text-left text-sm text-muted-foreground mt-4 space-y-1">
              <li>— Todo lo del plan mensual</li>
              <li>— Ahorro de $189.800/año</li>
              <li>— Acceso prioritario a lives</li>
              <li>— 2,4 meses gratis</li>
            </ul>
          </div>
          <div className="border border-border bg-card p-6 text-center">
            <Badge variant="outline" className="mb-3">Curso Individual</Badge>
            <div className="font-display text-3xl">$149.900</div>
            <div className="text-sm text-muted-foreground">COP / curso</div>
            <div className="text-xs text-muted-foreground mt-1">~$40,51 USD</div>
            <ul className="text-left text-sm text-muted-foreground mt-4 space-y-1">
              <li>— Acceso permanente al curso</li>
              <li>— Sin acceso a otros cursos</li>
              <li>— Sin transmisiones en vivo</li>
              <li>— Ideal para un tema específico</li>
            </ul>
          </div>
        </div>

        {/* Revenue table */}
        <h2 className="font-display text-h2 mb-4 border-b border-border pb-2">Análisis de Rentabilidad</h2>
        <p className="text-muted-foreground mb-4">Supuestos: 60% suscriptores mensuales, 25% anuales, 15% compradores individuales. Ingreso promedio ponderado: <strong>$18,30 USD/mes ($67.710 COP/mes)</strong>.</p>
        <div className="border border-border mb-4">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead>Usuarios</TableHead>
                <TableHead className="text-right">Ingreso Mensual</TableHead>
                <TableHead className="text-right">Costo Plataforma</TableHead>
                <TableHead className="text-right">Comisión Bold</TableHead>
                <TableHead className="text-right">Costo Total</TableHead>
                <TableHead className="text-right">Ganancia</TableHead>
                <TableHead className="text-center">Margen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {revenueTable.map((row) => (
                <TableRow key={row.users} className={row.divider ? "border-t-2 border-foreground/20" : ""}>
                  <TableCell className="font-semibold">{row.users}</TableCell>
                  <TableCell className="text-right">{row.revenue}</TableCell>
                  <TableCell className="text-right">{row.platform}</TableCell>
                  <TableCell className="text-right">{row.bold}</TableCell>
                  <TableCell className="text-right">{row.total}</TableCell>
                  <TableCell className="text-right font-semibold">{row.profit}</TableCell>
                  <TableCell className="text-center font-semibold">{row.margin}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <p className="text-xs text-muted-foreground mb-12">Valores en COP. Comisión Bold.co: mezcla 70% tarjeta (2,89% + $900 COP) / 30% Nequi (1,50%). Tasa efectiva ~3,26%.</p>

        {/* Free tiers */}
        <h2 className="font-display text-h2 mb-4 border-b border-border pb-2">Duración de los Planes Gratuitos</h2>
        <div className="border border-border mb-4">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead>Servicio</TableHead>
                <TableHead>Límite Gratuito</TableHead>
                <TableHead>Se Excede Con...</TableHead>
                <TableHead>Costo al Exceder</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {freeTiers.map((f) => (
                <TableRow key={f.service}>
                  <TableCell className="font-semibold">{f.service}</TableCell>
                  <TableCell>{f.limit}</TableCell>
                  <TableCell>{f.exceeds}</TableCell>
                  <TableCell>{f.cost}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="border border-accent bg-accent/20 p-5 mb-12">
          <p className="text-muted-foreground">
            <strong className="text-foreground">Hasta ~440 usuarios</strong>, el único costo fijo es Vercel ($20/mes) + Bunny Stream (variable) + dominio ($1/mes). Con 50 usuarios el costo total es apenas ~$39 USD/mes (~$144.300 COP), generando ~$3.130.800 COP de ganancia mensual.
          </p>
        </div>

        {/* Milestones */}
        <h2 className="font-display text-h2 mb-4 border-b border-border pb-2">Hitos de Escala y Acciones Requeridas</h2>
        <div className="border border-border mb-12">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead>Usuarios</TableHead>
                <TableHead>Evento</TableHead>
                <TableHead>Acción</TableHead>
                <TableHead className="text-right">Impacto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {milestones.map((m) => (
                <TableRow key={m.users} className={m.highlight ? "bg-accent/20" : ""}>
                  <TableCell className="font-semibold">{m.users}</TableCell>
                  <TableCell>{m.event}</TableCell>
                  <TableCell>{m.action}</TableCell>
                  <TableCell className="text-right font-semibold">{m.impact}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <footer className="border-t border-border pt-8 mt-14 text-center text-sm text-muted-foreground">
          <p>Análisis preparado para KMakeup Platform · Junio 2026 · TRM $3.700</p>
          <p className="mt-2">
            <a href="https://github.com/demarchenac" target="_blank" rel="noopener noreferrer" className="text-foreground font-semibold hover:opacity-70 transition-opacity">
              Cristhian De Marchena
            </a>
          </p>
        </footer>
      </div>
    </div>
  )
}
