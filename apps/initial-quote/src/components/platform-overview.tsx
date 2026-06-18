const capabilities = [
  {
    area: "Marca Personal",
    icon: "01",
    items: [
      "Página de presentación con animaciones de alto impacto visual",
      "Galería de trabajos y portafolio de maquillaje",
      "Sección «Sobre mí» con trayectoria profesional",
      "Testimonios de clientes",
      "Llamados a la acción hacia cursos y redes sociales",
      "Optimización para motores de búsqueda y soporte bilingüe (ES/EN)",
    ],
  },
  {
    area: "Registro y Autenticación",
    icon: "02",
    items: [
      "Registro e inicio de sesión para estudiantes",
      "Acceso mediante correo electrónico, Google y Apple",
      "Recuperación de contraseña",
      "Gestión del perfil de usuario",
    ],
  },
  {
    area: "Cursos y Contenido",
    icon: "03",
    items: [
      "Catálogo de cursos con filtros y búsqueda",
      "Detalle del curso con temario, descripción y vista previa",
      "Reproducción de video adaptativa con protección de contenido (DRM)",
      "Seguimiento de progreso por lección y módulo",
      "Lecciones gratuitas de muestra para captar estudiantes",
    ],
  },
  {
    area: "Pagos y Suscripciones",
    icon: "04",
    items: [
      "Compra individual de cursos (pago único)",
      "Suscripción mensual o anual con acceso a todos los cursos",
      "Pasarela Bold.co: tarjetas, PSE, Nequi, Daviplata",
      "Historial de compras y comprobantes",
      "Notificación automática del estado de cada pago",
    ],
  },
  {
    area: "Panel de Administración",
    icon: "05",
    items: [
      "Creación, edición y eliminación de cursos y lecciones",
      "Carga y gestión de videos",
      "Edición de textos y contenido del sitio",
      "Gestión de imágenes y galería",
      "Tablero con métricas básicas de ventas y participación",
    ],
  },
  {
    area: "Transmisiones en Vivo",
    icon: "06",
    items: [
      "Transmisión en vivo desde software profesional (OBS Studio)",
      "Visualización del en vivo directamente en la plataforma",
      "Grabación automática del en vivo como contenido bajo demanda",
      "Chat en tiempo real durante las transmisiones",
      "Calendario de próximos eventos con notificaciones",
    ],
  },
  {
    area: "Comunicación",
    icon: "07",
    items: [
      "Correos transaccionales: bienvenida, confirmación de compra, restablecimiento de contraseña",
      "Recordatorios de eventos en vivo",
      "Avisos de renovación de suscripción",
    ],
  },
  {
    area: "Analítica y Monitoreo",
    icon: "08",
    items: [
      "Seguimiento del comportamiento de usuarios (PostHog)",
      "Monitoreo de errores en tiempo real (Sentry)",
      "Métricas de participación en cursos y contenido",
    ],
  },
  {
    area: "Fase Futura: Asistente Social",
    icon: "09",
    items: [
      "Asistente automático de respuestas en WhatsApp, Instagram y Facebook",
      "Integración con la API de Meta para desarrolladores",
      "Atención automatizada de consultas frecuentes",
    ],
  },
];

export function PlatformOverview() {
  return (
    <section className="mb-12">
      <h2 className="font-display text-h2 mb-2">
        Funcionalidades de la Plataforma
      </h2>
      <p className="text-muted-foreground mb-6">
        Descripción detallada de las capacidades que ofrecerá la plataforma,
        tanto para Katherin (administradora) como para sus estudiantes.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {capabilities.map((cap) => (
          <div
            key={cap.area}
            className="rounded-lg border border-border p-5 bg-card"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-accent text-foreground text-xs font-bold">
                {cap.icon}
              </span>
              <h3 className="font-semibold">{cap.area}</h3>
            </div>
            <ul className="space-y-1.5">
              {cap.items.map((item) => (
                <li
                  key={item}
                  className="text-sm text-muted-foreground flex items-start gap-2"
                >
                  <span className="text-foreground mt-1 shrink-0">—</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
