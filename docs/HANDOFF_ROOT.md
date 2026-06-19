# Handoff — KMakeup Platform

## Resumen

Plataforma de marca personal y cursos en línea para **Katherin Mejia** ([@kmakeup_c](https://www.instagram.com/kmakeup_c)), maquilladora profesional con +20K seguidores en Instagram, basada en Colombia.

**Repo:** https://github.com/caric-co/katherinmejia.com (privado)
**Preparado por:** [Cristhian De Marchena](https://github.com/demarchenac)

---

## Estado Actual

El proyecto se encuentra en fase de **cotización y documentación**. No se ha iniciado desarrollo de la aplicación principal.

### Lo que existe

```
katherinmejia.com/
├── apps/
│   └── initial-quote/     ← App de cotización (React + Vite + Tailwind v4)
├── docs/                  ← Documentación técnica completa
├── package.json           ← Monorepo root (Turborepo + pnpm)
├── pnpm-workspace.yaml
├── turbo.json
├── PRODUCT.md
└── HANDOFF.md
```

### Lo que falta crear

```
├── apps/
│   ├── web/               ← App principal (TanStack Start) — POR CREAR
│   └── backend/           ← Convex backend — POR CREAR
├── packages/
│   ├── ui/                ← Componentes compartidos (shadcn + Base UI) — POR CREAR
│   ├── config/            ← Configuración compartida — POR CREAR
│   └── utils/             ← Utilidades compartidas — POR CREAR
```

---

## Documentación Disponible

| Documento | Contenido |
|-----------|-----------|
| [docs/PRD.md](docs/PRD.md) | Requisitos del producto, usuarios, funcionalidades, fases, modelo de negocio, KPIs |
| [docs/TECH_STACK.md](docs/TECH_STACK.md) | Stack tecnológico con justificaciones arquitecturales |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Diagrama de arquitectura, flujos principales, modelo de datos Convex |
| [docs/VIDEO_HOSTING_STUDY.md](docs/VIDEO_HOSTING_STUDY.md) | Comparativa Bunny Stream vs Mux vs Cloudflare vs AWS IVS con costos por escala |
| [docs/BOLD_INTEGRATION.md](docs/BOLD_INTEGRATION.md) | Estudio de Bold.co: APIs, métodos de pago, limitaciones de recurrentes, alternativas |
| [docs/LIVE_STREAMING.md](docs/LIVE_STREAMING.md) | Opciones de live streaming: Bunny RTMP vs Zoom vs Google Meet vs WebRTC |
| [PRODUCT.md](PRODUCT.md) | Resumen ejecutivo del proyecto |

---

## App de Cotización

**Ubicación:** `apps/initial-quote/`
**Ejecutar:** `pnpm dev --filter=@kmakeup/initial-quote` → http://localhost:5173

Contiene:
- Descripción del proyecto y referencias de diseño (Evagher, Evamuah)
- Funcionalidades detalladas de la plataforma (9 áreas)
- Estimación de horas por fase con desglose de complejidad
- Arquitectura tecnológica
- Inversión del proyecto: valor real vs precio de socio ($5M COP, Fases 1 y 2)
- Costos de infraestructura mensual con selector de escala (10 a 1M usuarios)
- Input de TRM editable (por defecto $3.700) con conversión USD → COP
- Notas y consideraciones técnicas

---

## Decisiones Clave Tomadas

### Tecnología
- **TanStack Start** sobre Next.js — independencia de framework, type-safe routing
- **Convex** sobre Supabase — real-time nativo, TypeScript end-to-end
- **Better Auth** sobre Clerk — autoalojada, menor costo a escala
- **Bunny Stream** sobre Mux — menor costo, DRM incluido, PoP en Bogotá

### Pagos
- **Bold.co** para compras individuales (Katherin ya tiene flujo establecido)
- **Bold.co no soporta pagos recurrentes** — se recomienda Wompi (Bancolombia) para suscripciones
- Evaluar doble integración (Bold + Wompi) vs migración completa a Wompi

### Video y Lives
- **Bunny Stream** para VOD y live streaming (RTMP compatible con OBS)
- Chat en vivo construido sobre Convex (real-time nativo, sin dependencia externa)
- Grabación automática de lives como contenido bajo demanda

### Comercial
- Precio acordado: **$5,000,000 COP** para Fases 1 y 2
- Tarifa base: $181,250 COP/h (salario $29M/160h)
- Descuento de socio: ~89.6%
- Fase 3 (Asistente Social, Certificados, Referidos) se cotizará por separado
- Bilingüe ES/EN, mercado colombiano, moneda COP

---

## Próximos Pasos

1. **Presentar cotización** al socio con la app `initial-quote`
2. **Definir con Katherin:** paleta de colores, fotografía profesional, contenido del portafolio
3. **Scaffolding del proyecto:** crear `apps/web` con TanStack Start + shadcn, `apps/backend` con Convex, `packages/ui`
4. **Configurar servicios:** Convex Cloud, Vercel project, Bunny Stream account, Bold.co sandbox
5. **Iniciar Fase 1 — MVP:** landing page → auth → catálogo → video player → pagos → admin → emails → analytics

---

## Dependencias y Cuentas por Configurar

| Servicio | Acción | Responsable |
|----------|--------|-------------|
| Vercel | Crear proyecto, vincular repo | Desarrollador |
| Convex | Crear proyecto en Convex Cloud | Desarrollador |
| Bunny Stream | Crear cuenta y zona de stream | Desarrollador |
| Bold.co | Obtener API keys de sandbox | Katherin / Socio |
| Resend | Crear cuenta, verificar dominio | Desarrollador |
| Sentry | Crear proyecto (free tier) | Desarrollador |
| PostHog | Crear proyecto (free tier) | Desarrollador |
| Google OAuth | Configurar credenciales en Google Cloud | Desarrollador |
| Apple Sign-In | Configurar en Apple Developer | Katherin / Socio |
| Dominio | Registrar katherinmejia.com (o similar) | Katherin / Socio |
