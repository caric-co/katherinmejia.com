import { Button } from "@repo/ui/components/button"
import { Input } from "@repo/ui/components/input"
import { Label } from "@repo/ui/components/label"

export function Contact() {
  return (
    <section id="contact" className="py-24 md:py-32 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
          {/* Left: heading */}
          <div>
            <p className="text-sm uppercase tracking-widest text-muted-foreground mb-4">
              Contacto
            </p>
            <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] tracking-tight mb-4">
              ¿Lista para comenzar?
            </h2>
            <p className="text-muted-foreground leading-relaxed max-w-md">
              Escríbeme y te responderé en menos de 24 horas.
              También puedes contactarme directamente por Instagram.
            </p>
          </div>

          {/* Right: form */}
          <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <Label className="text-xs uppercase tracking-wider font-medium mb-3 block">
                  Nombre
                </Label>
                <Input placeholder="Tu nombre aquí" />
              </div>
              <div>
                <Label className="text-xs uppercase tracking-wider font-medium mb-3 block">
                  Correo electrónico
                </Label>
                <Input type="email" placeholder="tu@correo.com" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <Label className="text-xs uppercase tracking-wider font-medium mb-3 block">
                  Tipo de servicio
                </Label>
                <select className="w-full h-10 rounded-none border-0 border-b border-input bg-transparent px-0 py-2 transition-colors outline-none text-muted-foreground/60 focus-visible:border-foreground/40 cursor-pointer">
                  <option value="">Seleccionar...</option>
                  <option value="curso">Cursos en línea</option>
                  <option value="evento">Maquillaje para evento</option>
                  <option value="editorial">Sesión editorial</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
              <div>
                <Label className="text-xs uppercase tracking-wider font-medium mb-3 block">
                  Fecha del evento
                </Label>
                <Input type="date" />
              </div>
            </div>

            <div>
              <Label className="text-xs uppercase tracking-wider font-medium mb-3 block">
                Mensaje
              </Label>
              <textarea
                placeholder="Escríbeme tus preguntas o comentarios."
                className="flex field-sizing-content min-h-24 w-full rounded-none border-0 border-b border-input bg-transparent px-0 py-2 transition-colors outline-none placeholder:text-muted-foreground/60 focus-visible:border-foreground/40"
              />
            </div>

            <Button variant="outline" type="submit" className="uppercase tracking-wider text-sm px-10">
              Enviar
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}
