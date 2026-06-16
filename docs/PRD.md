# PRD — KMakeup Platform

## Resumen Ejecutivo

Plataforma de marca personal y cursos online para **Katherin Mejia** ([@kmakeup_c](https://www.instagram.com/kmakeup_c)), maquilladora profesional con +20,000 seguidores en Instagram, basada en Colombia.

El proyecto tiene dos verticales:

1. **Sitio de marca personal** — Landing page de alto impacto visual (referencia: evagher.com, evamuah.com) para atraer clientes.
2. **Plataforma de cursos** — Sistema completo para vender, administrar y consumir cursos de maquillaje con video streaming.

---

## Referencias de Diseno

| Ref | Awwwards | Website |
|-----|----------|---------|
| 01 | [evagher](https://www.awwwards.com/sites/evagher-makeup) | [evagher.com/en](https://evagher.com/en) |
| 02 | [evamuah](https://www.awwwards.com/sites/evamuah) | [evamuah.com](https://www.evamuah.com/) |

Ambas referencias comparten: animaciones de scroll, tipografia bold, imagenes de alta calidad, navegacion minimalista, paleta oscura con acentos.

---

## Usuarios

### Katherin (Admin)
- Crea y gestiona cursos (videos, imagenes, contenido)
- Edita copies y contenido del sitio
- Realiza transmisiones en vivo
- Visualiza metricas de engagement y ventas

### Cliente (Estudiante)
- Se registra e inicia sesion (email, Google, Apple)
- Navega y compra cursos individuales
- Se suscribe para acceso a todos los cursos
- Consume contenido via streaming de video
- Participa en sesiones en vivo
- Lleva seguimiento de progreso por curso

---

## Funcionalidades

### F1 — Sitio de Marca Personal
- Landing page con animaciones tipo Awwwards
- Galeria de trabajos / portafolio
- Seccion "Sobre mi"
- Testimonios
- CTA hacia cursos y redes sociales
- SEO optimizado
- Bilingue (ES/EN)

### F2 — Autenticacion
- Registro e inicio de sesion
- Proveedores: Email/Password, Google, Apple
- Gestion de sesiones
- Recuperacion de contrasena
- Provider: Better Auth

### F3 — Catalogo de Cursos
- Listado de cursos disponibles
- Detalle de curso (descripcion, temario, preview)
- Filtros y busqueda
- Cursos gratuitos como lead magnet (opcional)

### F4 — Sistema de Pagos
- Compra de curso individual
- Suscripcion mensual/anual para acceso completo
- Pasarela: Bold.co (tarjetas, PSE, Nequi, Daviplata)
- Gestion de estados de pago via webhooks
- Historial de compras del usuario

### F5 — Consumo de Cursos
- Video player con streaming adaptativo (HLS)
- Proteccion de contenido (DRM basico)
- Tracking de progreso por leccion/modulo
- Marcadores y notas (fase futura)
- Descarga offline (fase futura)

### F6 — Panel de Administracion
- CRUD de cursos y lecciones
- Upload de videos (integracion con video hosting)
- Edicion de copies del sitio
- Gestion de imagenes
- Dashboard de metricas basicas

### F7 — Transmisiones en Vivo
- Streaming en vivo desde la plataforma
- Compatible con OBS Studio (RTMP)
- Grabacion automatica como VOD
- Chat en vivo (fase futura)
- Calendario de eventos

### F8 — Notificaciones
- Email transaccional (confirmacion compra, bienvenida, reset password)
- Provider: Resend + React Email
- Notificaciones in-app (fase futura)

### F9 — Analytics y Monitoreo
- PostHog para analytics de usuario (free tier)
- Sentry para error tracking (free tier)
- Metricas de engagement con cursos

---

## Modelo de Negocio

### Suscripcion
- Plan mensual: acceso a todos los cursos
- Plan anual: descuento sobre mensual
- Beneficio adicional: acceso a lives exclusivos

### Compra Individual
- Compra unica por curso
- Acceso permanente al contenido del curso

### Nota sobre Bold.co
Bold.co **no soporta pagos recurrentes nativos** via API actualmente. Para suscripciones se requiere construir logica propia de tokenizacion y cobro recurrente, o evaluar Wompi/PayU como alternativa para esa vertical especifica.

---

## Fases del Proyecto

### Fase 1 — MVP
- Landing page de marca personal
- Autenticacion (email, Google, Apple)
- Catalogo de cursos (1-3 cursos)
- Compra individual de cursos
- Video streaming basico
- Panel admin basico
- Deploy en Vercel

### Fase 2 — Suscripciones y Lives
- Sistema de suscripcion
- Transmisiones en vivo
- Tracking de progreso
- Email transaccional completo

### Fase 3 — Crecimiento
- Bot de respuestas automaticas (WhatsApp, Instagram, Facebook via Meta API)
- Programa de referidos
- Certificados de curso
- App movil (evaluacion)

---

## Mercado Objetivo

- Mujeres 18-35 anos en Colombia y LATAM
- Interesadas en maquillaje profesional y personal
- Audiencia actual de Instagram como base
- Expansion a mercado hispanohablante general

---

## KPIs de Exito

- Tasa de conversion visitante -> registro
- Tasa de conversion registro -> compra/suscripcion
- Retencion mensual de suscriptores
- Progreso promedio de cursos (% completado)
- NPS de estudiantes
