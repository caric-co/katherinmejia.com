import { internalMutation } from "./_generated/server";

export const seedTestData = internalMutation({
  args: {},
  handler: async (ctx) => {
    const existingCourses = await ctx.db.query("courses").first();
    if (existingCourses) return "courses already seeded";

    const existingAdmin = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", "admin@kmakeup.com"))
      .first();

    if (!existingAdmin) {
      await ctx.db.insert("users", {
        email: "admin@kmakeup.com",
        name: "Katherin Mejia",
        role: "admin",
        authProvider: "email",
        locale: "es",
        status: "active",
        createdAt: Date.now(),
      });

      await ctx.db.insert("users", {
        email: "student@test.com",
        name: "María García",
        role: "student",
        authProvider: "email",
        locale: "es",
        status: "active",
        createdAt: Date.now(),
      });
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
    });

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
    });

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
    });

    await ctx.db.insert("lessons", {
      courseId: course1,
      title: { es: "Preparación de la piel", en: "Skin preparation" },
      description: {
        es: "Limpieza, hidratación y primer para una base perfecta.",
        en: "Cleansing, moisturizing and primer for a perfect base.",
      },
      videoId: "placeholder-1",
      duration: 720,
      order: 1,
      isFree: true,
    });

    await ctx.db.insert("lessons", {
      courseId: course1,
      title: { es: "Base y corrector", en: "Foundation and concealer" },
      description: {
        es: "Técnicas de aplicación para un acabado natural e impecable.",
        en: "Application techniques for a natural, flawless finish.",
      },
      videoId: "placeholder-2",
      duration: 900,
      order: 2,
      isFree: false,
    });

    await ctx.db.insert("lessons", {
      courseId: course1,
      title: { es: "Ojos y labios naturales", en: "Natural eyes and lips" },
      description: {
        es: "Sombras suaves, delineado sutil y labios nude.",
        en: "Soft shadows, subtle liner and nude lips.",
      },
      videoId: "placeholder-3",
      duration: 1080,
      order: 3,
      isFree: false,
    });

    await ctx.db.insert("lessons", {
      courseId: course2,
      title: { es: "Fundamentos del contorno", en: "Contour fundamentals" },
      description: {
        es: "Entender las formas del rostro y cómo trabajar con ellas.",
        en: "Understanding face shapes and how to work with them.",
      },
      videoId: "placeholder-4",
      duration: 840,
      order: 1,
      isFree: true,
    });

    await seedSiteContent(ctx);

    return "seeded successfully";
  },
});

async function seedSiteContent(ctx: any) {
  const existing = await ctx.db.query("siteContent").first();
  if (existing) return;

  const content: Array<{ key: string; value: { es: string; en: string }; type: "text" | "image" }> = [
    // Hero
    { key: "hero.title", value: { es: "Katherin Mejia", en: "Katherin Mejia" }, type: "text" },
    {
      key: "hero.subtitle",
      value: {
        es: "Maquilladora profesional. Cursos en línea y servicios de maquillaje para eventos, editoriales y más.",
        en: "Professional makeup artist. Online courses and makeup services for events, editorials and more.",
      },
      type: "text",
    },
    { key: "hero.cta", value: { es: "Ver cursos", en: "View courses" }, type: "text" },
    {
      key: "hero.image",
      value: {
        es: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1920&q=80",
        en: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1920&q=80",
      },
      type: "image",
    },

    // About
    { key: "about.label", value: { es: "Sobre mí", en: "About me" }, type: "text" },
    { key: "about.title", value: { es: "Katherin Mejia", en: "Katherin Mejia" }, type: "text" },
    {
      key: "about.bio",
      value: {
        es: "Maquilladora profesional con más de 5 años de experiencia en el sector de la belleza. Especializada en maquillaje para eventos, sesiones fotográficas y contenido editorial.",
        en: "Professional makeup artist with over 5 years of experience in the beauty industry. Specialized in makeup for events, photo shoots and editorial content.",
      },
      type: "text",
    },
    {
      key: "about.bio2",
      value: {
        es: "Con una comunidad de más de 20.000 seguidores en Instagram, Katherin comparte su conocimiento a través de cursos en línea diseñados para que cualquier persona pueda aprender técnicas de maquillaje profesional desde casa.",
        en: "With a community of over 20,000 followers on Instagram, Katherin shares her knowledge through online courses designed so anyone can learn professional makeup techniques from home.",
      },
      type: "text",
    },
    {
      key: "about.image",
      value: {
        es: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&q=80",
        en: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&q=80",
      },
      type: "image",
    },

    // Services
    { key: "services.label", value: { es: "Servicios", en: "Services" }, type: "text" },
    {
      key: "services.heading",
      value: {
        es: "Transforma tu look con maquillaje profesional",
        en: "Transform your look with professional makeup",
      },
      type: "text",
    },
    { key: "services.1.title", value: { es: "Maquillaje Natural", en: "Natural Makeup" }, type: "text" },
    {
      key: "services.1.description",
      value: {
        es: "Técnicas para realzar tu belleza natural con productos de alta calidad y acabado profesional.",
        en: "Techniques to enhance your natural beauty with high-quality products and a professional finish.",
      },
      type: "text",
    },
    {
      key: "services.1.image",
      value: {
        es: "https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=600&q=80",
        en: "https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=600&q=80",
      },
      type: "image",
    },
    { key: "services.2.title", value: { es: "Maquillaje Editorial", en: "Editorial Makeup" }, type: "text" },
    {
      key: "services.2.description",
      value: {
        es: "Looks creativos y de alto impacto visual para sesiones fotográficas, campañas y portafolios.",
        en: "Creative, high-impact looks for photo shoots, campaigns and portfolios.",
      },
      type: "text",
    },
    {
      key: "services.2.image",
      value: {
        es: "https://images.unsplash.com/photo-1503236823255-94609f598e71?w=600&q=80",
        en: "https://images.unsplash.com/photo-1503236823255-94609f598e71?w=600&q=80",
      },
      type: "image",
    },
    { key: "services.3.title", value: { es: "Maquillaje para Eventos", en: "Event Makeup" }, type: "text" },
    {
      key: "services.3.description",
      value: {
        es: "Preparación completa para bodas, quinceañeros, graduaciones y eventos especiales.",
        en: "Complete preparation for weddings, quinceañeras, graduations and special events.",
      },
      type: "text",
    },
    {
      key: "services.3.image",
      value: {
        es: "https://images.unsplash.com/photo-1457972729786-0411a3b2b626?w=600&q=80",
        en: "https://images.unsplash.com/photo-1457972729786-0411a3b2b626?w=600&q=80",
      },
      type: "image",
    },

    // Courses
    { key: "courses.label", value: { es: "Cursos", en: "Courses" }, type: "text" },
    {
      key: "courses.heading",
      value: {
        es: "Aprende a tu ritmo con cursos profesionales",
        en: "Learn at your own pace with professional courses",
      },
      type: "text",
    },

    // Testimonials
    { key: "testimonials.label", value: { es: "Testimonios", en: "Testimonials" }, type: "text" },
    {
      key: "testimonials.heading",
      value: { es: "Lo que dicen nuestras clientas", en: "What our clients say" },
      type: "text",
    },
    { key: "testimonials.1.name", value: { es: "María García", en: "María García" }, type: "text" },
    {
      key: "testimonials.1.text",
      value: {
        es: "Los cursos de Katherin transformaron mi manera de maquillarme. Las técnicas son claras y los resultados son increíbles.",
        en: "Katherin's courses transformed the way I do my makeup. The techniques are clear and the results are incredible.",
      },
      type: "text",
    },
    { key: "testimonials.2.name", value: { es: "Laura Rodríguez", en: "Laura Rodríguez" }, type: "text" },
    {
      key: "testimonials.2.text",
      value: {
        es: "Aprendí más en un curso de Katherin que en años intentando por mi cuenta. Su método es práctico y directo.",
        en: "I learned more in one of Katherin's courses than in years of trying on my own. Her method is practical and direct.",
      },
      type: "text",
    },
    { key: "testimonials.3.name", value: { es: "Camila Torres", en: "Camila Torres" }, type: "text" },
    {
      key: "testimonials.3.text",
      value: {
        es: "El maquillaje para mi boda quedó espectacular. Katherin entiende exactamente lo que necesitas y lo ejecuta a la perfección.",
        en: "The makeup for my wedding was spectacular. Katherin understands exactly what you need and executes it to perfection.",
      },
      type: "text",
    },

    // Contact
    { key: "contact.label", value: { es: "Contacto", en: "Contact" }, type: "text" },
    { key: "contact.heading", value: { es: "¿Lista para comenzar?", en: "Ready to get started?" }, type: "text" },
    {
      key: "contact.description",
      value: {
        es: "Escríbeme y te responderé en menos de 24 horas. También puedes contactarme directamente por Instagram.",
        en: "Write to me and I'll respond within 24 hours. You can also contact me directly on Instagram.",
      },
      type: "text",
    },
  ];

  for (const item of content) {
    await ctx.db.insert("siteContent", {
      ...item,
      updatedAt: Date.now(),
    });
  }
}

export const seedSiteContentOnly = internalMutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("siteContent").collect();
    for (const item of existing) {
      await ctx.db.delete(item._id);
    }
    await seedSiteContent(ctx);
    return "site content seeded";
  },
});
