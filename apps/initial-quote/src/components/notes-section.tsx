export function NotesSection() {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6">Notas y Consideraciones</h2>

      <div className="space-y-4">
        <div className="rounded-lg border border-border p-4 bg-surface-raised">
          <h3 className="font-semibold text-warning mb-2">
            Pagos Recurrentes (Bold.co)
          </h3>
          <p className="text-sm text-text-muted">
            Bold.co no ofrece soporte nativo para pagos recurrentes mediante su
            API. Para el manejo de suscripciones se recomienda evaluar{" "}
            <strong className="text-text">Wompi</strong> (Bancolombia), que
            cuenta con soporte nativo para cobros periódicos, o bien construir
            la lógica de recurrencia de forma propia. Esta limitación incide
            directamente en la estimación de la Fase 2.
          </p>
        </div>

        <div className="rounded-lg border border-border p-4 bg-surface-raised">
          <h3 className="font-semibold text-brand mb-2">
            Alojamiento de Video
          </h3>
          <p className="text-sm text-text-muted">
            Se recomienda <strong className="text-text">Bunny Stream</strong>{" "}
            como solución principal por su relación costo-beneficio, protección
            de contenido (DRM) incluida y punto de presencia en Bogotá.{" "}
            <strong className="text-text">Mux</strong> constituye la alternativa
            de gama alta en caso de requerirse analítica avanzada de video.
            Consulte el estudio detallado en la documentación.
          </p>
        </div>

        <div className="rounded-lg border border-border p-4 bg-surface-raised">
          <h3 className="font-semibold mb-2">Transmisiones en Vivo</h3>
          <p className="text-sm text-text-muted">
            Se propone utilizar Bunny Stream Live (protocolo RTMP mediante OBS)
            para el MVP, acompañado de un chat en tiempo real construido sobre
            la infraestructura de Convex. Esta aproximación evita dependencias
            externas como Zoom o Google Meet y mantiene la experiencia del
            usuario dentro de la plataforma.
          </p>
        </div>

        <div className="rounded-lg border border-border p-4 bg-surface-raised">
          <h3 className="font-semibold mb-2">
            Asistente de Redes Sociales (Fase 3)
          </h3>
          <p className="text-sm text-text-muted">
            Integración con la API de Meta para desarrolladores, abarcando
            WhatsApp, Instagram y Facebook. Se trata de un módulo independiente
            que será cotizado por separado una vez se alcance la Fase 3 del
            proyecto.
          </p>
        </div>

        <div className="rounded-lg border border-border p-4 bg-surface-raised">
          <h3 className="font-semibold mb-2">Sobre las Estimaciones</h3>
          <p className="text-sm text-text-muted">
            Las horas estimadas se presentan como rangos basados en la
            complejidad y las dependencias de cada funcionalidad. El límite
            inferior asume un flujo de desarrollo sin bloqueos; el superior
            contempla margen para integraciones complejas y pruebas. Los costos
            de infraestructura son aproximaciones fundamentadas en los precios
            publicados por cada proveedor y pueden variar según el uso real.
          </p>
        </div>
      </div>
    </section>
  );
}
