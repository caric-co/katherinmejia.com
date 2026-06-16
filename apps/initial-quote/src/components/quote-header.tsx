export function QuoteHeader() {
  return (
    <header className="border-b border-border pb-8 mb-10">
      <p className="text-sm text-brand uppercase tracking-widest mb-2">
        Cotización de Proyecto
      </p>
      <h1 className="text-4xl font-extrabold tracking-tight mb-3">
        KMakeup Platform
      </h1>
      <p className="text-text-muted max-w-2xl">
        Plataforma de marca personal y cursos en línea para{" "}
        <strong className="text-text">Katherin Mejia</strong> (<a href="https://www.instagram.com/kmakeup_c" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">@kmakeup_c</a>).
        Sitio web de alto impacto visual complementado con un sistema integral
        de comercialización y consumo de cursos de maquillaje profesional,
        transmisión de video y sesiones en vivo.
      </p>
    </header>
  );
}
