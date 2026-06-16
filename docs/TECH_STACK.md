# Tech Stack — KMakeup Platform

## Arquitectura General

Monorepo con Turborepo + pnpm workspaces.

```
katherinmejia.com/
├── apps/
│   ├── web/              # App principal (TanStack Start)
│   ├── backend/          # Convex backend
│   └── initial-quote/    # App de cotizacion
├── packages/
│   ├── ui/               # Componentes compartidos (shadcn + base-ui)
│   ├── config/           # Configuracion compartida (TS, ESLint, etc.)
│   └── utils/            # Utilidades compartidas
├── docs/                 # Documentacion del proyecto
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

---

## Stack por Capa

### Frontend
| Tecnologia | Proposito | Justificacion |
|------------|-----------|---------------|
| **TanStack Start** | Framework fullstack | SSR, file-based routing, server functions |
| **TanStack Form + Zod** | Formularios y validacion | Type-safe, headless, validacion compartida client/server |
| **React Query** | Cache y estado servidor | Integrado con TanStack Start, mutations optimistas |
| **Zustand** | Estado global (si necesario) | Ligero, sin boilerplate, solo si React Query no cubre |
| **Tailwind CSS v4** | Estilos | Utility-first, v4 con CSS-first config |
| **shadcn/ui + Base UI** | Componentes | Accesibilidad, customizacion total, ownership del codigo |
| **Motion** | Animaciones | Declarativo, performante, gestos |

### Backend
| Tecnologia | Proposito | Justificacion |
|------------|-----------|---------------|
| **Convex** | Base de datos + backend | Real-time, serverless, TypeScript nativo, schema validation |
| **React Query + Convex** | Data fetching | Convex como source of truth, React Query para cache layer |

### Autenticacion
| Tecnologia | Proposito | Justificacion |
|------------|-----------|---------------|
| **Better Auth** | Auth completa | Email/password, Google, Apple, session management |

### Pagos
| Tecnologia | Proposito | Justificacion |
|------------|-----------|---------------|
| **Bold.co** | Pasarela de pagos | Soporte COP, PSE, Nequi, Daviplata, tarjetas nacionales/internacionales |

### Video Hosting
| Tecnologia | Proposito | Justificacion |
|------------|-----------|---------------|
| **Bunny Stream** (recomendado) | Video hosting + streaming | Costo mas bajo, DRM incluido, PoP en Bogota, live streaming RTMP |
| **Mux** (alternativa premium) | Video hosting + streaming | Mejor DX, analytics, free tier 100K min, DRM a $100/mes adicional |

> Ver [VIDEO_HOSTING_STUDY.md](./VIDEO_HOSTING_STUDY.md) para analisis completo.

### Email
| Tecnologia | Proposito | Justificacion |
|------------|-----------|---------------|
| **Resend** | Email transaccional | API moderna, React Email compatible, free tier 3K emails/mes |
| **React Email** | Templates de email | Componentes React para emails, preview en desarrollo |

### Observabilidad
| Tecnologia | Proposito | Justificacion |
|------------|-----------|---------------|
| **Sentry** | Error tracking | Free tier 5K eventos/mes, source maps, session replay |
| **PostHog** | Analytics | Free tier 1M eventos/mes, product analytics, feature flags |

### Infraestructura
| Tecnologia | Proposito | Justificacion |
|------------|-----------|---------------|
| **Vercel** | Hosting + deploy | Edge network, preview deploys, integrado con TanStack Start |
| **Convex Cloud** | Backend hosting | Managed, incluido con Convex |
| **Turborepo** | Build system | Monorepo, caching, task orchestration |
| **pnpm** | Package manager | Workspace support, eficiente en disco |

### Internacionalizacion
- Bilingue ES/EN
- Libreria por definir (evaluando: paraglide, next-intl adapter para TanStack, o solucion custom con Convex)

---

## Decisiones Arquitecturales

### Por que TanStack Start sobre Next.js?
- Full ownership sin vendor lock-in con Vercel (aunque deployamos ahi)
- TanStack Router es type-safe por defecto
- Server functions integradas sin API routes separadas
- Mejor alineacion con el ecosistema TanStack (Query, Form, Table)

### Por que Convex sobre Supabase/Planetscale?
- Real-time nativo sin WebSocket boilerplate
- TypeScript end-to-end con schema validation
- Serverless functions colocadas con la DB
- Scheduled jobs para cobros recurrentes (util con Bold)
- File storage integrado

### Por que Better Auth sobre Clerk/Auth.js?
- Self-hosted, sin dependencia de servicio externo
- Soporte nativo para Apple Sign-In
- Menor costo a escala
- Control total sobre el flujo de auth

### Por que Bold.co?
- Katherin ya tiene un flujo establecido con Bold
- Soporte nativo de metodos colombianos (PSE, Nequi, Daviplata)
- Comisiones competitivas (2.89% + $300 COP tarjetas, 1.50% Nequi)

**Limitacion**: Bold no soporta pagos recurrentes nativos. Para suscripciones se evaluara:
1. Construir logica propia con Convex scheduled jobs + tokenizacion Bold
2. Usar Wompi exclusivamente para suscripciones
3. Cobro manual mensual via Bold con reminder emails
