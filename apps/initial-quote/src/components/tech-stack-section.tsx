const stack = [
  {
    category: "Interfaz",
    items: [
      "TanStack Start",
      "TanStack Form + Zod",
      "React Query",
      "Tailwind CSS v4",
      "shadcn/ui + Base UI",
      "Motion",
    ],
  },
  {
    category: "Servidor",
    items: ["Convex (base de datos + funciones + tiempo real)"],
  },
  {
    category: "Autenticación",
    items: ["Better Auth (correo, Google, Apple)"],
  },
  {
    category: "Pagos",
    items: [
      "Bold.co (compras individuales)",
      "Wompi (suscripciones — por evaluar)",
    ],
  },
  {
    category: "Video",
    items: ["Bunny Stream (bajo demanda + en vivo + DRM)"],
  },
  { category: "Correo", items: ["Resend + React Email"] },
  {
    category: "Observabilidad",
    items: ["Sentry (errores)", "PostHog (analítica)"],
  },
  {
    category: "Infraestructura",
    items: ["Vercel (alojamiento)", "Turborepo + pnpm (monorrepo)"],
  },
  { category: "Idiomas", items: ["Bilingüe ES/EN (i18next)"] },
];

export function TechStackSection() {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-normal mb-6">Arquitectura Tecnológica</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stack.map((group) => (
          <div
            key={group.category}
            className="rounded-lg border border-border p-4 bg-card"
          >
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-2">
              {group.category}
            </h3>
            <ul className="space-y-1">
              {group.items.map((item) => (
                <li key={item} className="text-sm text-muted-foreground">
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
