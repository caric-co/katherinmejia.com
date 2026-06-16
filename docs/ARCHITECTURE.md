# Arquitectura — KMakeup Platform

## Diagrama de Alto Nivel

```
                    ┌─────────────────┐
                    │   Vercel Edge    │
                    │   (CDN + SSR)    │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  TanStack Start  │
                    │   (apps/web)     │
                    │                  │
                    │ ┌──────────────┐ │
                    │ │ Better Auth  │ │
                    │ │ (auth layer) │ │
                    │ └──────────────┘ │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
     ┌────────▼───────┐ ┌───▼────┐ ┌───────▼──────┐
     │    Convex      │ │Bold.co │ │ Bunny Stream │
     │   (backend)    │ │(pagos) │ │   (video)    │
     │                │ │        │ │              │
     │ - Users        │ │ - Card │ │ - VOD (HLS)  │
     │ - Courses      │ │ - PSE  │ │ - Live RTMP  │
     │ - Progress     │ │ - Nequi│ │ - DRM        │
     │ - Subs         │ │        │ │              │
     │ - Payments     │ └───┬────┘ └───────┬──────┘
     │ - Content      │     │              │
     └────────┬───────┘     │              │
              │        Webhooks       Player Embed
              │              │              │
     ┌────────▼───────┐     │              │
     │    Resend      │◄────┘              │
     │  (email tx)    │                    │
     └────────────────┘                    │
                                           │
     ┌─────────────┐  ┌──────────────┐     │
     │   Sentry    │  │   PostHog    │     │
     │  (errors)   │  │ (analytics)  │     │
     └─────────────┘  └──────────────┘     │
```

---

## Flujos Principales

### Registro y Login
```
Cliente → TanStack Start → Better Auth → Convex (crear/validar user)
                                      → Google/Apple OAuth
                                      → Resend (email verificacion)
```

### Compra de Curso Individual
```
Cliente → Selecciona curso → Bold.co checkout (embed/API)
       → Bold webhook → Convex (registrar pago, otorgar acceso)
       → Resend (email confirmacion)
```

### Suscripcion
```
Cliente → Selecciona plan → Wompi checkout (recurrente)
       → Wompi webhook → Convex (activar suscripcion)
       → Convex scheduled job (verificar estado mensual)
       → Resend (email bienvenida/renovacion)
```

### Consumo de Curso
```
Cliente → Navega curso → Convex (verificar acceso)
       → Bunny Stream player (video HLS con DRM)
       → Convex mutation (actualizar progreso)
```

### Live Streaming
```
Katherin → OBS Studio → Bunny Stream (RTMP ingest)
        → Bunny CDN → Clientes (player embed)
        → Grabacion automatica → VOD asset
```

### Admin - Gestion de Contenido
```
Katherin → Panel admin → Convex mutations (CRUD cursos)
        → Upload video → Bunny Stream API
        → Editar copies → Convex (contenido del sitio)
```

---

## Modelo de Datos (Convex)

### users
```typescript
{
  email: string
  name: string
  role: "student" | "admin"
  avatar?: string
  authProvider: "email" | "google" | "apple"
  locale: "es" | "en"
  createdAt: number
}
```

### courses
```typescript
{
  title: { es: string, en: string }
  description: { es: string, en: string }
  slug: string
  thumbnailUrl: string
  previewVideoId?: string
  price: number // COP
  currency: "COP"
  status: "draft" | "published" | "archived"
  order: number
  createdAt: number
}
```

### lessons
```typescript
{
  courseId: Id<"courses">
  title: { es: string, en: string }
  description: { es: string, en: string }
  videoId: string // Bunny Stream video ID
  duration: number // seconds
  order: number
  isFree: boolean // preview lesson
}
```

### subscriptions
```typescript
{
  userId: Id<"users">
  plan: "monthly" | "annual"
  status: "active" | "cancelled" | "past_due" | "expired"
  provider: "wompi" | "bold"
  externalId: string
  currentPeriodStart: number
  currentPeriodEnd: number
}
```

### purchases
```typescript
{
  userId: Id<"users">
  courseId: Id<"courses">
  amount: number
  currency: "COP"
  provider: "bold"
  transactionId: string
  status: "pending" | "completed" | "refunded"
  createdAt: number
}
```

### progress
```typescript
{
  userId: Id<"users">
  lessonId: Id<"lessons">
  courseId: Id<"courses">
  completed: boolean
  watchedSeconds: number
  lastWatchedAt: number
}
```

### siteContent
```typescript
{
  key: string // e.g. "hero.title", "about.description"
  value: { es: string, en: string }
  type: "text" | "richtext" | "image"
  updatedAt: number
}
```

### liveEvents
```typescript
{
  title: { es: string, en: string }
  description: { es: string, en: string }
  scheduledAt: number
  streamId?: string // Bunny Stream ID
  status: "scheduled" | "live" | "ended"
  recordingVideoId?: string
  isSubscribersOnly: boolean
}
```

---

## Seguridad

- Better Auth maneja sesiones y tokens
- Convex functions validan permisos en cada mutation/query
- Bold.co webhooks verificados por firma
- Bunny Stream: signed URLs + DRM para proteccion de video
- Variables de entorno via Vercel (nunca en codigo)
- Rate limiting en endpoints publicos

---

## Escalabilidad

- Convex escala automaticamente (serverless)
- Bunny CDN distribuye globalmente
- Vercel Edge para SSR con baja latencia
- Video transcoding delegado a Bunny/Mux
- Sin estado en el servidor (stateless)
