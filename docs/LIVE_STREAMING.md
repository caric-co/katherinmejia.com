# Estudio de Live Streaming — KMakeup Platform

## Contexto

Katherin quiere hacer sesiones en vivo desde la plataforma. Inicialmente se penso en integracion con Zoom o Google Calendar, pero se busca evaluar una solucion propia.

---

## Opciones Evaluadas

### Opcion 1: Bunny Stream Live (RECOMENDADA)

Si usamos Bunny Stream para VOD, el live streaming viene incluido sin costo adicional de plataforma.

**Como funciona**:
1. Katherin abre OBS Studio y apunta a la URL RTMP de Bunny
2. Bunny procesa y distribuye via CDN global (PoP Bogota)
3. Clientes ven el live en un player embebido en la plataforma
4. Al terminar, la grabacion se guarda automaticamente como VOD

**Pros**:
- Sin costo adicional de plataforma (solo bandwidth)
- Grabacion automatica a VOD
- Misma infraestructura que los cursos
- Compatible con OBS, Streamlabs, vMix

**Contras**:
- Sin chat nativo (hay que construirlo con Convex)
- Sin interacciones avanzadas (polls, Q&A)
- Latencia tipica 10-30 segundos

**Costo estimado**: Solo bandwidth. Una sesion de 2h con 100 viewers ~= $9 USD.

### Opcion 2: Zoom Integration

**Como funciona**:
1. Crear reunion via Zoom API
2. Katherin inicia desde Zoom
3. Clientes acceden via link o embed (Zoom SDK)

**Pros**:
- Chat, Q&A, polls nativos
- Baja latencia (<1s)
- Familiar para usuarios

**Contras**:
- Zoom Pro requerido ($13.33/mes)
- Max 100 participantes en Pro (300 en Business a $18.33/mes)
- No se graba automaticamente como VOD en la plataforma
- UX fragmentada (sale de la plataforma o requiere SDK pesado)
- Zoom SDK tiene licencia restrictiva

### Opcion 3: Google Meet + Calendar

**Como funciona**:
1. Crear evento en Google Calendar via API
2. Generar link de Google Meet
3. Clientes acceden via link

**Pros**:
- Gratis con Google Workspace
- Familiar para usuarios
- Calendar integration nativa

**Contras**:
- Sin embed posible (redirect obligatorio)
- Max 100 participantes (Workspace), 250 con Enterprise
- Sin branding custom
- UX totalmente fuera de la plataforma
- No se graba como VOD en la plataforma

### Opcion 4: Solución Propia (WebRTC)

Construir streaming propio con WebRTC (WHIP/WHEP) usando servicios como Cloudflare Stream o LiveKit.

**Pros**:
- Control total
- Latencia sub-segundo
- Branding completo

**Contras**:
- Complejidad de desarrollo muy alta
- Costo significativo de desarrollo
- No justificado para el volumen esperado

---

## Recomendacion

### MVP (Fase 1-2): Bunny Stream Live

- Katherin transmite desde OBS
- Player embebido en la plataforma
- Chat en vivo via Convex (real-time nativo)
- Calendario de eventos en la plataforma
- Grabacion automatica como VOD

**Chat con Convex**: Convex es ideal para chat real-time. Un modelo simple:
```typescript
// messages
{
  liveEventId: Id<"liveEvents">
  userId: Id<"users">
  text: string
  createdAt: number
}
```
Subscription de Convex para actualizaciones en tiempo real. Sin infraestructura adicional.

### Futuro (Fase 3+): Evaluar

Si se necesitan features interactivos avanzados (polls, breakout rooms, multi-host), evaluar:
- LiveKit (open-source, self-hosted o cloud)
- Daily.co (API de video calls)
- Integracion Zoom solo para workshops interactivos

---

## Integracion con Calendario

Independientemente de la solucion de streaming, se recomienda:

1. **Calendario en la plataforma**: Lista de proximos lives en `liveEvents` de Convex
2. **Google Calendar**: Boton "Agregar a mi calendario" genera .ics o link directo
3. **Notificaciones**: Resend envia email recordatorio 24h y 1h antes del live
4. **PostHog**: Trackear asistencia y engagement en lives
