# Estudio de Video Hosting — KMakeup Platform

## Contexto

Plataforma de cursos de maquillaje para creadora colombiana con 20K seguidores. Requiere video on demand para cursos pregrabados y live streaming para sesiones en vivo.

**Supuestos base**: 50 horas de contenido (~3,000 min almacenados), usuario promedio consume 5 horas/mes (~300 min).

---

## Comparativa de Plataformas

### 1. Bunny Stream (bunny.net) — RECOMENDADO

**Modelo de precios**: Pay-as-you-go. Storage $0.005/GB/mes + CDN bandwidth. LATAM bandwidth: $0.045/GB.

| Escala | Storage | Bandwidth (LATAM) | Total Est. |
|--------|---------|-------------------|------------|
| 100 usuarios | $0.75 | $22.50 | ~$23/mes |
| 500 usuarios | $0.75 | $112.50 | ~$113/mes |
| 1,000 usuarios | $0.75 | $225 | ~$226/mes |
| 5,000 usuarios | $0.75 | $1,125 | ~$1,126/mes |
| 10,000 usuarios | $0.75 | $2,250 | ~$2,251/mes |

**VOD**: Transcoding automatico HLS, player incluido, subtitulos AI ($0.10/min).
**Live**: RTMP ingest (compatible OBS), grabacion automatica a VOD.
**DRM**: MediaCage Basic gratis (previene descargas). Enterprise $99/mes (Widevine + FairPlay).
**LATAM**: PoP en Bogota + 18 ubicaciones en la region. <10ms a ciudades principales de Colombia.
**Free tier**: No, pero minimo $1/mes.

### 2. Mux — Alternativa Premium

**Modelo de precios**: Delivery $0.0008/min (primeros 100K gratis). Storage $0.0024/min. DRM: $100/mes + $0.003/licencia.

| Escala | Storage | Delivery | Total Est. |
|--------|---------|----------|------------|
| 100 usuarios | $7.20 | $0 (free tier) | ~$7/mes |
| 500 usuarios | $7.20 | $20 | ~$27/mes |
| 1,000 usuarios | $7.20 | $140 | ~$147/mes |
| 5,000 usuarios | $7.20 | ~$1,080 | ~$1,087/mes |
| 10,000 usuarios | $7.20 | ~$2,160 | ~$2,167/mes |

**VOD**: HLS adaptativo, Mux Player (React SDK), captions automaticos, analytics (Mux Data).
**Live**: RTMP/SRT, low-latency LL-HLS (4-7s), simulcasting, grabacion a VOD.
**DRM**: Widevine + PlayReady + FairPlay. $100/mes + $0.003/licencia.
**LATAM**: Multi-CDN, sin PoPs LATAM propios.
**Free tier**: 100K min delivery/mes, 10 videos.

### 3. Cloudflare Stream — NO RECOMENDADO

**Modelo**: $5/1K min storage + $1/1K min delivery + $5/mes Workers.

| Escala | Total Est. |
|--------|------------|
| 100 usuarios | ~$50/mes |
| 1,000 usuarios | ~$320/mes |
| 10,000 usuarios | ~$3,020/mes |

**Sin DRM nativo** — dealbreaker para contenido pago.
Excelente cobertura LATAM (4 PoPs en Colombia) pero no justifica la falta de proteccion.

### 4. AWS IVS — NO RECOMENDADO

Orientado a live interactivo, no es plataforma VOD. Requiere servicios AWS adicionales (S3, CloudFront, MediaConvert) para cursos. Complejidad excesiva para este caso de uso. Sin DRM nativo.

| Escala | Total Est. (solo live) |
|--------|------------------------|
| 100 usuarios | ~$50/mes |
| 1,000 usuarios | ~$482/mes |
| 10,000 usuarios | ~$4,802/mes |

### 5. Otros Evaluados

- **api.video**: Pricing opaco, menor presencia LATAM. No recomendado.
- **Vimeo OTT**: $1/suscriptor/mes. Plataforma en incertidumbre tras adquisicion por Bending Spoons. No recomendado.
- **VdoCipher**: DRM Hollywood-grade incluido, desde $99/mes. Interesante si DRM es prioridad maxima.

---

## Matriz Comparativa

| Feature | Bunny Stream | Mux | Cloudflare | AWS IVS |
|---------|-------------|-----|------------|---------|
| Costo @ 100 users | ~$23 | ~$7 | ~$50 | ~$50 |
| Costo @ 1K users | ~$226 | ~$147 | ~$320 | ~$482 |
| Costo @ 10K users | ~$2,251 | ~$2,167 | ~$3,020 | ~$4,802 |
| VOD | Excelente | Excelente | Bueno | Pobre |
| Live streaming | Bueno (RTMP) | Excelente (LL-HLS) | Excelente | Mejor |
| DRM incluido | Basico gratis | $100/mes extra | No | No |
| PoP Colombia | Bogota | Via CDN partners | Bogota, Medellin, Cali, B/quilla | Bogota, Medellin, Cali |
| API/SDK | Bueno | Mejor | Bueno | Complejo |
| Free tier | $1/mes min | 100K min/mes | No | 12 meses solo |

---

## Recomendacion

### Primaria: Bunny Stream

1. **Menor costo** en todas las escalas
2. **DRM incluido gratis** (MediaCage Basic)
3. **PoP en Bogota** para latencia optima
4. **Live streaming RTMP** compatible con OBS
5. **Grabacion automatica** de lives a VOD
6. Pricing simple y predecible

### Secundaria: Mux (si el presupuesto lo permite)

1. **Mejor DX** (SDKs, Player, analytics)
2. **Free tier generoso** para arrancar
3. DRM completo disponible ($100/mes adicional)
4. Mejor para escalar a una plataforma de video sofisticada

### Estrategia Sugerida

Arrancar con **Bunny Stream** en MVP (bajo costo, DRM gratis). Si la plataforma crece y requiere analytics avanzados o mejor player SDK, migrar a **Mux** en Fase 2+.
