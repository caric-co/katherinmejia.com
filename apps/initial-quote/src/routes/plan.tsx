import { createFileRoute, Link } from "@tanstack/react-router"
import { useState } from "react"
import { ArrowLeft, ChevronDown } from "lucide-react"
import { Button } from "@repo/ui/components/button"
import { Badge } from "@repo/ui/components/badge"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@repo/ui/components/table"
import { Separator } from "@repo/ui/components/separator"

export const Route = createFileRoute("/plan")({
  component: PlanPage,
})

const phases = [
  { n: 1, title: "Andamiaje del Monorrepo", hours: "~2h", items: [
    "packages/config/: TSConfig base, React y Convex compartidos",
    "packages/utils/: Función cn(), formateadores de moneda (COP), fechas",
    "packages/ui/: shadcn base-lyra con tema evamuah.com, 22+ componentes",
    "apps/convex/: Proyecto Convex con schema inicial y auth config",
    "apps/web/: TanStack Start con vite config, router, ConvexQueryClient, SSR, env validation, auth, i18n",
    "Datos mock: seed inicial con cursos, lecciones, testimonios, textos e imágenes placeholder",
    "Verificación: pnpm dev inicia ambos servidores. Placeholder en localhost:3000",
  ]},
  { n: 2, title: "Autenticación", hours: "~3h", items: [
    "Convex: tabla users, funciones getByAuthId, updateProfile, setRole, blockUser",
    "Better Auth: email/password + Google + Apple con plugin convexClient()",
    "Ruta API: /api/auth/$ (handler catch-all GET + POST)",
    "Páginas: login, register, forgot-password con TanStack Form + Zod",
    "Guards: _authenticated.tsx (redirige a login), admin/_layout.tsx (verifica role === 'admin' en beforeLoad)",
    "Resend: correo de bienvenida y restablecimiento de contraseña (bilingüe). Preconfigurado con dominio de prueba",
  ]},
  { n: 3, title: "Página de Marca Personal", hours: "~8h", items: [
    "Landing tipo evamuah.com con estética editorial minimalista, paleta crema cálida. Contenido mock editable desde admin",
    "Hero: video/imagen de fondo con overlay, texto animado (Motion), CTA, indicador de scroll",
    "Navegación: barra fija transparente→sólida al desplazar (useScroll + useTransform), toggle de idioma, botones auth",
    "Portafolio: grilla de imágenes con hover zoom, animaciones escalonadas (useInView)",
    "Sobre mí: foto + biografía con animaciones de entrada",
    "Testimonios: carrusel desde tabla siteContent (editable por admin)",
    "Cursos destacados: 2-3 cursos del catálogo con enlace a /courses",
    "Pie de página: enlaces sociales, navegación rápida, selector de idioma",
    "i18n: todo el texto usa t() de react-i18next. Responsive con menú hamburguesa en móvil",
  ]},
  { n: 4, title: "Schema Completo + Admin Base", hours: "~4h", items: [
    "Schema completo en Convex: courses, lessons, purchases, progress, subscriptions, invitationLinks, siteContent, blogPosts (9 tablas con índices)",
    "Admin layout: barra lateral con navegación agrupada (Tablero, Contenido, Usuarios, Ventas)",
    "Tablero: tarjetas resumen (total usuarios, cursos, compras recientes, estudiantes activos) con datos en tiempo real",
  ]},
  { n: 5, title: "Gestión de Cursos (Admin)", hours: "~6h", items: [
    "Convex: courses.create, .update, .updateStatus, .reorder, .delete; patrón similar para lessons.*",
    "Bunny Stream: acción Convex bunny.createVideoAction(title) → crea video, retorna ID + URL de carga. Frontend usa tus-js-client para carga reanudable directo a Bunny",
    "Páginas admin: tabla de cursos con acciones (editar, lecciones, publicar/archivar), formulario con campos bilingües, gestión de lecciones con reordenar, carga de video con indicador de progreso",
    "Imágenes: UploadThing para miniaturas de cursos",
    "Invitaciones: generar código único, configurar máximo de usos y expiración, copiar enlace",
  ]},
  { n: 6, title: "Catálogo de Cursos (Público)", hours: "~4h", items: [
    "Listado: grilla de tarjetas (miniatura, título, extracto, precio, cantidad de lecciones). Responsive 1→2→3 columnas",
    "Detalle: hero con miniatura/preview, descripción completa, temario con duración e íconos candado/libre, botón «Comprar» o «Continuar viendo»",
    "Acceso: access.hasAccess(userId, courseId) verifica: admin → suscripción activa → compra completada → lección gratuita",
    "Invitación: ruta /courses/invite/$code valida código, si autenticado redime y redirige; si no, pide login primero",
  ]},
  { n: 7, title: "Reproductor de Video + Progreso", hours: "~6h", items: [
    "Reproductor: hls.js con URL HLS de Bunny Stream. Controles: reproducir/pausar, buscar, volumen, pantalla completa, velocidad",
    "Progreso: evento timeupdate (~4x/seg), debounce a mutación Convex cada 10 segundos. También envía en: pausa, cambio de visibilidad, desmontaje, finalización. Marca completed cuando ≥90% visto",
    "Hook: useProgressTracker(lessonId, courseId, duration) → retorna { onTimeUpdate, startAt }",
    "Avance automático: overlay al completar «Siguiente: [Título]» con cuenta regresiva 5s, botones «Reproducir ahora» y «Cancelar»",
    "Barra lateral: lista de lecciones, actual resaltada, completadas con ✓, en progreso con barra, bloqueadas con 🔒",
    "Reanudación: al navegar al curso, busca última lección no completada con watchedSeconds > 0 e inicia desde ahí",
  ]},
  { n: 8, title: "Gestión de Usuarios (Admin)", hours: "~3h", items: [
    "Listado: tabla con nombre, correo, rol, fecha de registro, estado. Búsqueda por nombre/correo",
    "Detalle: perfil del usuario, lista de cursos adquiridos con progreso, acciones: otorgar/revocar acceso, bloquear/desbloquear",
  ]},
  { n: 9, title: "Contenido del Sitio + Blog", hours: "~2h", items: [
    "Editor de contenido: claves con valores ES/EN lado a lado, edición inline, agrupado por sección (Hero, Sobre mí, Testimonios, Pie de página)",
    "Landing dinámica: componentes consultan siteContent por clave, con fallback a strings de i18next",
    "Blog admin: tabla de artículos, formulario con campos bilingües, publicar/despublicar, botón «Traducir» con Mistral API (ES→EN o EN→ES con indicador de consumo)",
    "Blog público: grilla de artículos publicados, página de detalle con meta tags SEO",
  ]},
  { n: 10, title: "Analítica y Monitoreo", hours: "~1h", items: [
    "PostHog: inicializar en __root.tsx, captura automática de vistas, eventos: course_viewed, lesson_started, lesson_completed, purchase_completed, invitation_redeemed",
    "Sentry: inicializar con DSN, error boundary, carga de source maps en build",
  ]},
]

const publicRoutes = [
  ["/", "Landing page"], ["/courses", "Catálogo de cursos"], ["/courses/$slug", "Detalle del curso"],
  ["/courses/$slug/lesson/$id", "Reproductor"], ["/courses/invite/$code", "Redimir invitación"],
  ["/blog", "Listado de artículos"], ["/blog/$slug", "Artículo"],
  ["/auth/login", "Inicio de sesión"], ["/auth/register", "Registro"],
  ["/auth/forgot-password", "Recuperar contraseña"], ["/api/auth/$", "Handler Better Auth"],
]

const adminRoutes = [
  ["/admin", "Tablero general"], ["/admin/courses", "Listar cursos"], ["/admin/courses/new", "Crear curso"],
  ["/admin/courses/$id", "Editar curso"], ["/admin/courses/$id/lessons", "Gestionar lecciones"],
  ["/admin/users", "Listar usuarios"], ["/admin/users/$id", "Detalle usuario"],
  ["/admin/content", "Editor de contenido"], ["/admin/invitations", "Enlaces de invitación"],
  ["/admin/blog", "Gestionar artículos"], ["/admin/blog/new", "Crear artículo"], ["/admin/blog/$id", "Editar artículo"],
]

const schemas: { name: string; fields: [string, string, string][] }[] = [
  { name: "users", fields: [["email", "string", "Índice único"], ["name", "string", ""], ["role", '"student" | "admin"', "Índice por rol"], ["avatar", "string?", "URL de imagen"], ["authProvider", '"email" | "google" | "apple"', ""], ["locale", '"es" | "en"', "Idioma preferido"], ["isBlocked", "boolean", "Admin puede bloquear"]] },
  { name: "courses", fields: [["title", "{ es, en }", "Bilingüe"], ["description", "{ es, en }", "Bilingüe"], ["slug", "string", "URL-friendly, índice"], ["thumbnailUrl", "string?", "UploadThing"], ["price", "number", "En COP"], ["status", '"draft" | "published" | "archived"', ""], ["order", "number", "Orden de visualización"]] },
  { name: "lessons", fields: [["courseId", 'Id<"courses">', "Relación"], ["title", "{ es, en }", "Bilingüe"], ["videoId", "string", "Bunny Stream video ID"], ["duration", "number", "Segundos"], ["order", "number", "Dentro del curso"], ["isFree", "boolean", "Vista previa gratuita"]] },
  { name: "progress", fields: [["userId", "string", ""], ["lessonId", 'Id<"lessons">', ""], ["courseId", 'Id<"courses">', "Para consultas por curso"], ["watchedSeconds", "number", "Progreso por segundo"], ["completed", "boolean", "true cuando ≥90% visto"], ["lastWatchedAt", "number", "Para reanudar"]] },
  { name: "purchases", fields: [["userId", "string", ""], ["courseId", 'Id<"courses">', ""], ["amount", "number", "0 para invitaciones/manual"], ["provider", '"bold" | "manual" | "invitation"', ""], ["status", '"pending" | "completed" | "refunded"', ""], ["grantedBy", '"admin" | "invitation" | "payment"', "Unifica verificación"]] },
  { name: "subscriptions", fields: [["userId", "string", ""], ["plan", '"monthly" | "annual"', ""], ["status", '"active" | "cancelled" | "past_due" | "expired"', ""], ["provider", '"wompi" | "bold" | "manual"', ""], ["currentPeriodStart", "number", ""], ["currentPeriodEnd", "number", ""], ["cancelledAt", "number?", ""]] },
  { name: "invitationLinks", fields: [["courseId", 'Id<"courses">', ""], ["code", "string", "Código único, índice"], ["maxUses", "number", ""], ["usedCount", "number", ""], ["expiresAt", "number?", "Opcional"]] },
  { name: "siteContent", fields: [["key", "string", 'Ej: "hero.title"'], ["value", "{ es, en }", "Bilingüe"], ["type", '"text" | "richtext" | "image"', ""]] },
  { name: "blogPosts", fields: [["title", "{ es, en }", "Bilingüe"], ["slug", "string", "URL-friendly"], ["content", "{ es, en }", "Markdown o richtext"], ["excerpt", "{ es, en }", "Resumen para listado"], ["status", '"draft" | "published"', ""]] },
]

const decisions = [
  ["🎬", "hls.js sobre iframe de Bunny", "Necesitamos eventos timeupdate del elemento <video> para seguimiento por segundo. El iframe requeriría postMessage, que es frágil."],
  ["⏱", "Debounce de 10 segundos", "Enviar progreso cada 10s equilibra precisión de reanudación con volumen de escrituras. A 100 estudiantes simultáneos: ~10 mutaciones/seg, dentro del plan gratuito de Convex."],
  ["🌐", "Datos bilingües como { es, en }", "Objetos directos en Convex en lugar de tabla de traducciones. Consultas simples, sin joins. Aceptable porque solo hay 2 idiomas."],
  ["📝", "i18n híbrido", "Strings estáticos de UI vía archivos JSON de i18next (rápido, sin consultas DB). Contenido dinámico (hero, testimonios) vía tabla siteContent (editable por admin)."],
  ["🎟️", "Invitaciones como registros de compra", "Al redimir, se crea un purchases con grantedBy: 'invitation' y amount: 0. La verificación de acceso solo consulta purchases."],
  ["🖼", "UploadThing para imágenes, Bunny para video", "UploadThing para miniaturas y portadas de blog (free tier 2GB). Bunny Stream exclusivamente para video (HLS + DRM)."],
  ["🔒", "Auth guard en beforeLoad", "TanStack Router ejecuta beforeLoad antes de renderizar. Se consulta el usuario, se verifica el rol y se lanza redirect() si no tiene permisos. Sin destello de contenido no autorizado."],
]

function PlanPage() {
  const [openPhases, setOpenPhases] = useState<Set<number>>(new Set([1]))

  const togglePhase = (n: number) => {
    setOpenPhases((prev) => {
      const next = new Set(prev)
      if (next.has(n)) next.delete(n)
      else next.add(n)
      return next
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8 print:hidden">
          <Link to="/"><Button variant="ghost" size="sm"><ArrowLeft data-icon="inline-start" className="size-3.5" />Volver al índice</Button></Link>
        </div>

        <p className="text-sm text-muted-foreground uppercase tracking-widest mb-3">Plan de Implementación</p>
        <h1 className="font-display text-h1 tracking-tight mb-3">KMakeup Platform: MVP</h1>
        <p className="text-muted-foreground mb-10 max-w-3xl">
          Plataforma de marca personal y cursos en línea para <strong className="text-foreground">Katherin Mejia</strong> (<a href="https://www.instagram.com/kmakeup_c" target="_blank" rel="noopener noreferrer" className="text-foreground underline underline-offset-2 hover:opacity-70">@kmakeup_c</a>). Este documento detalla las 10 fases de implementación del MVP, la arquitectura, el modelo de datos y las decisiones técnicas clave.
        </p>

        {/* Timeline stats */}
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-12">
          {[{ v: "10", l: "Fases" }, { v: "~39", l: "Horas Est." }, { v: "9", l: "Tablas Convex" }, { v: "~25", l: "Rutas" }, { v: "ES/EN", l: "Bilingüe" }].map((s) => (
            <div key={s.l} className="text-center bg-muted p-3">
              <div className="font-display text-2xl">{s.v}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">{s.l}</div>
            </div>
          ))}
        </div>

        {/* Route map */}
        <h2 className="font-display text-h2 mb-4">Mapa de Rutas</h2>
        <Separator className="mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          <div className="bg-muted p-5">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Públicas</h3>
            <ul className="space-y-1">
              {publicRoutes.map(([path, desc]) => (
                <li key={path} className="text-sm"><code className="text-foreground bg-muted px-1.5 py-0.5 text-xs">{path}</code> <span className="text-muted-foreground">{desc}</span></li>
              ))}
            </ul>
          </div>
          <div className="bg-muted p-5">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Admin (protegidas)</h3>
            <ul className="space-y-1">
              {adminRoutes.map(([path, desc]) => (
                <li key={path} className="text-sm"><code className="text-foreground bg-muted px-1.5 py-0.5 text-xs">{path}</code> <span className="text-muted-foreground">{desc}</span></li>
              ))}
            </ul>
          </div>
        </div>

        {/* Data model */}
        <h2 className="font-display text-h2 mb-4">Modelo de Datos (Convex)</h2>
        <Separator className="mb-4" />
        <div className="space-y-6 mb-12">
          {schemas.map((s) => (
            <div key={s.name}>
              <h3 className="font-semibold mb-2">{s.name}</h3>
              <div className="">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted hover:bg-muted">
                      <TableHead>Campo</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Notas</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {s.fields.map(([field, type, note]) => (
                      <TableRow key={field}>
                        <TableCell className="font-medium">{field}</TableCell>
                        <TableCell><code className="bg-foreground text-background px-1.5 py-0.5 text-xs rounded-sm">{type}</code></TableCell>
                        <TableCell className="text-muted-foreground">{note}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ))}
        </div>

        {/* Phases */}
        <h2 className="font-display text-h2 mb-4">Fases de Implementación</h2>
        <Separator className="mb-4" />
        <div className="space-y-2 mb-12">
          {phases.map((p) => {
            const isOpen = openPhases.has(p.n)
            return (
              <div key={p.n} className="bg-muted">
                <button
                  onClick={() => togglePhase(p.n)}
                  className="w-full text-left flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-accent text-foreground text-sm font-bold shrink-0">{p.n}</span>
                  <span className="font-semibold flex-1">{p.title}</span>
                  <span className="text-sm text-muted-foreground font-mono">{p.hours}</span>
                  <ChevronDown className={`size-4 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
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
            )
          })}
        </div>

        {/* Decisions */}
        <h2 className="font-display text-h2 mb-4">Decisiones Técnicas Clave</h2>
        <Separator className="mb-4" />
        <div className="space-y-3 mb-12">
          {decisions.map(([icon, title, desc]) => (
            <div key={title} className="flex gap-3 p-4 bg-muted/50 border border-border">
              <span className="text-lg shrink-0">{icon}</span>
              <div>
                <p className="font-semibold">{title}</p>
                <p className="text-muted-foreground mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <footer className="border-t border-border pt-8 mt-14 text-center text-sm text-muted-foreground">
          <p>
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
