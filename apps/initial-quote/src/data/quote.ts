export interface QuoteFeature {
  id: string;
  name: string;
  description: string;
  phase: 1 | 2 | 3;
  estimatedHours: { min: number; max: number };
  complexity: "low" | "medium" | "high";
  dependencies: string[];
}

export interface ServiceCost {
  name: string;
  description: string;
  freeTier: string | null;
  monthlyCost: Record<number, number>;
  currency: "USD" | "COP";
  unit: string;
  required: boolean;
  notes?: string;
}

export const features: QuoteFeature[] = [
  {
    id: "landing",
    name: "Sitio de Marca Personal",
    description:
      "Página de presentación de alto impacto visual con animaciones, galería, portafolio, testimonios y optimización para motores de búsqueda",
    phase: 1,
    estimatedHours: { min: 60, max: 80 },
    complexity: "high",
    dependencies: [],
  },
  {
    id: "i18n",
    name: "Internacionalización (ES/EN)",
    description:
      "Soporte bilingüe completo con cambio de idioma y contenido traducible desde el panel de administración",
    phase: 1,
    estimatedHours: { min: 16, max: 24 },
    complexity: "medium",
    dependencies: ["landing"],
  },
  {
    id: "auth",
    name: "Autenticación",
    description:
      "Registro, inicio de sesión y recuperación de contraseña. Proveedores: correo electrónico, Google y Apple",
    phase: 1,
    estimatedHours: { min: 24, max: 32 },
    complexity: "medium",
    dependencies: [],
  },
  {
    id: "course-catalog",
    name: "Catálogo de Cursos",
    description:
      "Listado, detalle, filtros, búsqueda y vista previa de cursos. Vistas pública y protegida",
    phase: 1,
    estimatedHours: { min: 24, max: 32 },
    complexity: "medium",
    dependencies: ["auth"],
  },
  {
    id: "video-player",
    name: "Reproducción de Video",
    description:
      "Integración con Bunny Stream (o Mux). Reproductor adaptativo (HLS), protección de contenido (DRM) básica",
    phase: 1,
    estimatedHours: { min: 20, max: 30 },
    complexity: "high",
    dependencies: ["course-catalog"],
  },
  {
    id: "payments-individual",
    name: "Pagos — Compra Individual",
    description:
      "Integración con Bold.co para compra única de cursos. Tarjetas, PSE, Nequi, Daviplata. Notificaciones automáticas de estado",
    phase: 1,
    estimatedHours: { min: 24, max: 36 },
    complexity: "high",
    dependencies: ["course-catalog"],
  },
  {
    id: "admin-panel",
    name: "Panel de Administración",
    description:
      "Gestión completa de cursos y lecciones, carga de videos, edición de textos del sitio y administración de imágenes",
    phase: 1,
    estimatedHours: { min: 40, max: 56 },
    complexity: "high",
    dependencies: ["course-catalog", "video-player"],
  },
  {
    id: "progress-tracking",
    name: "Seguimiento de Progreso",
    description:
      "Registro del avance por lección y módulo, porcentaje de completitud y última lección visualizada",
    phase: 2,
    estimatedHours: { min: 16, max: 24 },
    complexity: "medium",
    dependencies: ["video-player"],
  },
  {
    id: "email-transactional",
    name: "Correos Transaccionales",
    description:
      "Confirmación de compra, bienvenida, restablecimiento de contraseña y recordatorios. Mediante Resend + React Email",
    phase: 1,
    estimatedHours: { min: 12, max: 18 },
    complexity: "low",
    dependencies: ["auth", "payments-individual"],
  },
  {
    id: "subscriptions",
    name: "Sistema de Suscripción",
    description:
      "Plan mensual y anual con acceso a todos los cursos. Integración con Wompi (o Bold según disponibilidad). Gestión de estados",
    phase: 2,
    estimatedHours: { min: 32, max: 48 },
    complexity: "high",
    dependencies: ["payments-individual", "auth"],
  },
  {
    id: "live-streaming",
    name: "Transmisiones en Vivo",
    description:
      "Transmisión en vivo mediante Bunny Stream (RTMP, compatible con OBS), grabación automática y calendario de eventos",
    phase: 2,
    estimatedHours: { min: 24, max: 36 },
    complexity: "high",
    dependencies: ["video-player"],
  },
  {
    id: "live-chat",
    name: "Chat en Vivo",
    description:
      "Chat en tiempo real durante las transmisiones en vivo, construido sobre Convex",
    phase: 2,
    estimatedHours: { min: 12, max: 18 },
    complexity: "medium",
    dependencies: ["live-streaming"],
  },
  {
    id: "analytics-setup",
    name: "Analítica y Monitoreo",
    description:
      "PostHog (analítica de usuario) + Sentry (monitoreo de errores). Planes gratuitos",
    phase: 1,
    estimatedHours: { min: 8, max: 12 },
    complexity: "low",
    dependencies: [],
  },
  {
    id: "social-bot",
    name: "Asistente de Redes Sociales",
    description:
      "Asistente automático de respuestas para WhatsApp, Instagram y Facebook mediante la API de Meta para desarrolladores",
    phase: 3,
    estimatedHours: { min: 60, max: 90 },
    complexity: "high",
    dependencies: [],
  },
  {
    id: "certificates",
    name: "Certificados de Curso",
    description:
      "Generación automática de certificado en PDF al completar un curso",
    phase: 3,
    estimatedHours: { min: 12, max: 18 },
    complexity: "medium",
    dependencies: ["progress-tracking"],
  },
  {
    id: "referrals",
    name: "Programa de Referidos",
    description:
      "Sistema de referidos con códigos, seguimiento y recompensas o descuentos",
    phase: 3,
    estimatedHours: { min: 20, max: 30 },
    complexity: "medium",
    dependencies: ["auth", "subscriptions"],
  },
];

export const serviceCosts: ServiceCost[] = [
  {
    name: "Vercel",
    description: "Alojamiento, despliegue, CDN y renderizado en servidor",
    freeTier: "Hobby: gratuito (uso personal)",
    monthlyCost: {
      10: 0,
      20: 0,
      50: 0,
      100: 0,
      500: 20,
      1000: 20,
      5000: 20,
      10000: 150,
      50000: 400,
      100000: 400,
      500000: 2500,
      1000000: 5000,
    },
    currency: "USD",
    unit: "USD/mes",
    required: true,
    notes:
      "Plan Hobby gratuito para iniciar. Pro a USD 20/mes. Enterprise a partir de ~50K usuarios con tráfico elevado",
  },
  {
    name: "Convex",
    description: "Base de datos, funciones en la nube, tiempo real y tareas programadas",
    freeTier: "Gratuito: 1M llamadas a funciones, 1 GB de almacenamiento",
    monthlyCost: {
      10: 0,
      20: 0,
      50: 0,
      100: 0,
      500: 0,
      1000: 25,
      5000: 25,
      10000: 25,
      50000: 100,
      100000: 250,
      500000: 800,
      1000000: 1500,
    },
    currency: "USD",
    unit: "USD/mes",
    required: true,
    notes: "Plan gratuito generoso. Pro a USD 25/mes. Escala según consumo",
  },
  {
    name: "Bunny Stream",
    description: "Alojamiento de video, transmisión, DRM y en vivos",
    freeTier: null,
    monthlyCost: {
      10: 3,
      20: 5,
      50: 12,
      100: 23,
      500: 113,
      1000: 226,
      5000: 1126,
      10000: 2251,
      50000: 11255,
      100000: 22510,
      500000: 112550,
      1000000: 225100,
    },
    currency: "USD",
    unit: "USD/mes",
    required: true,
    notes:
      "Pago por consumo. Almacenamiento a USD 0,005/GB + ancho de banda LATAM a USD 0,045/GB. DRM básico incluido",
  },
  {
    name: "Mux (alternativa)",
    description: "Alojamiento de video de gama alta con analítica",
    freeTier: "100K minutos de entrega al mes gratuitos",
    monthlyCost: {
      10: 0,
      20: 0,
      50: 0,
      100: 7,
      500: 27,
      1000: 147,
      5000: 1087,
      10000: 2167,
      50000: 10835,
      100000: 21670,
      500000: 108350,
      1000000: 216700,
    },
    currency: "USD",
    unit: "USD/mes",
    required: false,
    notes: "Plan gratuito cubre ~100 usuarios. DRM adicional a USD 100/mes",
  },
  {
    name: "Bold.co",
    description: "Pasarela de pagos (tarjetas, PSE, Nequi, Daviplata)",
    freeTier: "Sin costo fijo — solo comisión por transacción",
    monthlyCost: {
      10: 0,
      20: 0,
      50: 0,
      100: 0,
      500: 0,
      1000: 0,
      5000: 0,
      10000: 0,
      50000: 0,
      100000: 0,
      500000: 0,
      1000000: 0,
    },
    currency: "COP",
    unit: "comisión/tx",
    required: true,
    notes:
      "~2,89 % + $300 COP por transacción con tarjeta; 1,50 % con Nequi/Daviplata. Sin costo fijo mensual",
  },
  {
    name: "Resend",
    description: "Correo electrónico transaccional",
    freeTier: "3.000 correos al mes gratuitos",
    monthlyCost: {
      10: 0,
      20: 0,
      50: 0,
      100: 0,
      500: 0,
      1000: 0,
      5000: 20,
      10000: 20,
      50000: 50,
      100000: 50,
      500000: 200,
      1000000: 400,
    },
    currency: "USD",
    unit: "USD/mes",
    required: true,
    notes: "Plan gratuito suficiente para el MVP. Pro a USD 20/mes hasta 50K correos",
  },
  {
    name: "Better Auth",
    description: "Autenticación (autoalojada)",
    freeTier: "Código abierto — gratuito",
    monthlyCost: {
      10: 0,
      20: 0,
      50: 0,
      100: 0,
      500: 0,
      1000: 0,
      5000: 0,
      10000: 0,
      50000: 0,
      100000: 0,
      500000: 0,
      1000000: 0,
    },
    currency: "USD",
    unit: "gratuito",
    required: true,
    notes: "Autoalojada, sin costo de servicio. El costo se refleja en horas de desarrollo",
  },
  {
    name: "Sentry",
    description: "Monitoreo de errores",
    freeTier: "5K eventos al mes, 1 usuario",
    monthlyCost: {
      10: 0,
      20: 0,
      50: 0,
      100: 0,
      500: 0,
      1000: 0,
      5000: 26,
      10000: 26,
      50000: 80,
      100000: 80,
      500000: 160,
      1000000: 320,
    },
    currency: "USD",
    unit: "USD/mes",
    required: true,
    notes: "Plan gratuito suficiente para el MVP. Plan Team a USD 26/mes",
  },
  {
    name: "PostHog",
    description: "Analítica de producto y funcionalidades condicionales",
    freeTier: "1M eventos al mes gratuitos",
    monthlyCost: {
      10: 0,
      20: 0,
      50: 0,
      100: 0,
      500: 0,
      1000: 0,
      5000: 0,
      10000: 0,
      50000: 45,
      100000: 90,
      500000: 450,
      1000000: 900,
    },
    currency: "USD",
    unit: "USD/mes",
    required: true,
    notes: "Plan gratuito muy generoso. Solo genera costo a partir de 1M eventos al mes",
  },
  {
    name: "Dominio",
    description: "katherinmejia.com (o similar)",
    freeTier: null,
    monthlyCost: {
      10: 1,
      20: 1,
      50: 1,
      100: 1,
      500: 1,
      1000: 1,
      5000: 1,
      10000: 1,
      50000: 1,
      100000: 1,
      500000: 1,
      1000000: 1,
    },
    currency: "USD",
    unit: "USD/mes",
    required: true,
    notes: "Aproximadamente USD 12 al año",
  },
];

export const userScales = [
  10, 20, 50, 100, 500, 1000, 5000, 10000, 50000, 100000, 500000, 1000000,
] as const;

export type UserScale = (typeof userScales)[number];
