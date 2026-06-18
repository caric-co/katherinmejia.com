import { internalMutation } from "./_generated/server"

export const seedTestData = internalMutation({
  args: {},
  handler: async (ctx) => {
    const existingCourses = await ctx.db.query("courses").first()
    if (existingCourses) return "courses already seeded"

    const existingAdmin = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", "admin@kmakeup.com"))
      .first()

    if (!existingAdmin) {
      await ctx.db.insert("users", {
        email: "admin@kmakeup.com",
        name: "Katherin Mejia",
        role: "admin",
        authProvider: "email",
        locale: "es",
        isBlocked: false,
        createdAt: Date.now(),
      })

      await ctx.db.insert("users", {
        email: "student@test.com",
        name: "María García",
        role: "student",
        authProvider: "email",
        locale: "es",
        isBlocked: false,
        createdAt: Date.now(),
      })
    }

    const course1 = await ctx.db.insert("courses", {
      title: { es: "Maquillaje Natural de Día", en: "Natural Day Makeup" },
      description: {
        es: "Aprende a crear un look fresco y natural perfecto para el día a día con productos accesibles.",
        en: "Learn to create a fresh, natural look perfect for everyday with accessible products.",
      },
      slug: { es: "maquillaje-natural-de-dia", en: "natural-day-makeup" },
      thumbnailUrl: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&q=80",
      price: 149900,
      currency: "COP",
      status: "published",
      order: 1,
      createdAt: Date.now(),
    })

    const course2 = await ctx.db.insert("courses", {
      title: { es: "Contorno y Corrección Profesional", en: "Professional Contour and Correction" },
      description: {
        es: "Domina las técnicas de contorno para esculpir y definir tu rostro como las profesionales.",
        en: "Master contouring techniques to sculpt and define your face like the pros.",
      },
      slug: { es: "contorno-y-correccion", en: "contour-and-correction" },
      thumbnailUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80",
      price: 199900,
      currency: "COP",
      status: "published",
      order: 2,
      createdAt: Date.now(),
    })

    await ctx.db.insert("courses", {
      title: { es: "Maquillaje para Eventos Especiales", en: "Special Events Makeup" },
      description: {
        es: "Looks de alto impacto para bodas, galas, quinceañeros y graduaciones.",
        en: "High-impact looks for weddings, galas, quinceañeras and graduations.",
      },
      slug: { es: "maquillaje-para-eventos", en: "special-events-makeup" },
      thumbnailUrl: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&q=80",
      price: 249900,
      currency: "COP",
      status: "draft",
      order: 3,
      createdAt: Date.now(),
    })

    await ctx.db.insert("lessons", {
      courseId: course1,
      title: { es: "Preparación de la piel", en: "Skin preparation" },
      description: { es: "Limpieza, hidratación y primer para una base perfecta.", en: "Cleansing, moisturizing and primer for a perfect base." },
      videoId: "placeholder-1",
      duration: 720,
      order: 1,
      isFree: true,
    })

    await ctx.db.insert("lessons", {
      courseId: course1,
      title: { es: "Base y corrector", en: "Foundation and concealer" },
      description: { es: "Técnicas de aplicación para un acabado natural e impecable.", en: "Application techniques for a natural, flawless finish." },
      videoId: "placeholder-2",
      duration: 900,
      order: 2,
      isFree: false,
    })

    await ctx.db.insert("lessons", {
      courseId: course1,
      title: { es: "Ojos y labios naturales", en: "Natural eyes and lips" },
      description: { es: "Sombras suaves, delineado sutil y labios nude.", en: "Soft shadows, subtle liner and nude lips." },
      videoId: "placeholder-3",
      duration: 1080,
      order: 3,
      isFree: false,
    })

    await ctx.db.insert("lessons", {
      courseId: course2,
      title: { es: "Fundamentos del contorno", en: "Contour fundamentals" },
      description: { es: "Entender las formas del rostro y cómo trabajar con ellas.", en: "Understanding face shapes and how to work with them." },
      videoId: "placeholder-4",
      duration: 840,
      order: 1,
      isFree: true,
    })

    return "seeded successfully"
  },
})
