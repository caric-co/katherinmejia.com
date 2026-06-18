import { Button } from "@repo/ui/components/button"
import { Input } from "@repo/ui/components/input"
import { Label } from "@repo/ui/components/label"

export function Contact() {
  return (
    <section id="contact" className="py-24 md:py-32 px-6 md:px-10">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] tracking-tight mb-3">
          ¿Lista para comenzar?
        </h2>
        <p className="text-muted-foreground mb-12">
          Escríbeme y te responderé en menos de 24 horas.
        </p>

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

          <div>
            <Label className="text-xs uppercase tracking-wider font-medium mb-3 block">
              Cuéntame sobre lo que buscas
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
    </section>
  )
}
