import { AlertTriangle } from "lucide-react"

export function NotesSection() {
  return (
    <section className="mb-12">
      <h2 className="font-display text-h2 mb-6">Notas y Consideraciones</h2>

      <div className="rounded-lg border border-accent bg-accent/20 p-5 mb-8">
        <div className="flex items-start gap-3">
          <AlertTriangle className="size-5 text-foreground/70 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold mb-1">Pagos Recurrentes (Bold.co)</h3>
            <p className="text-muted-foreground">
              Bold.co no ofrece soporte nativo para pagos recurrentes mediante su
              API. Para el manejo de suscripciones se recomienda evaluar{" "}
              <strong className="text-foreground">Wompi</strong> (Bancolombia),
              que cuenta con soporte nativo para cobros periódicos, o bien
              construir la lógica de recurrencia de forma propia. Esta limitación
              incide directamente en la estimación de la Fase 2.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="font-semibold mb-1">Alojamiento de Video</h3>
          <p className="text-muted-foreground">
            Se recomienda{" "}
            <strong className="text-foreground">Bunny Stream</strong> como
            solución principal por su relación costo-beneficio, protección de
            contenido (DRM) incluida y punto de presencia en Bogotá.{" "}
            <strong className="text-foreground">Mux</strong> constituye la
            alternativa de gama alta en caso de requerirse analítica avanzada de
            video.
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-1">Transmisiones en Vivo</h3>
          <p className="text-muted-foreground">
            Se propone utilizar Bunny Stream Live (protocolo RTMP mediante OBS)
            para el MVP, acompañado de un chat en tiempo real construido sobre la
            infraestructura de Convex. Esta aproximación mantiene la experiencia
            del usuario dentro de la plataforma.
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-1">
            Asistente de Redes Sociales (Fase 3)
          </h3>
          <p className="text-muted-foreground">
            Integración con la API de Meta para desarrolladores, abarcando
            WhatsApp, Instagram y Facebook. Módulo independiente que será cotizado
            por separado una vez concluidas las Fases 1 y 2.
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-1">Sobre las Estimaciones</h3>
          <p className="text-muted-foreground">
            Las horas estimadas se presentan como rangos basados en la
            complejidad y dependencias. El límite inferior asume un flujo sin
            bloqueos; el superior contempla margen para integraciones complejas y
            pruebas. Los costos de infraestructura son aproximaciones
            fundamentadas en los precios publicados y pueden variar según el uso
            real.
          </p>
        </div>
      </div>
    </section>
  )
}
