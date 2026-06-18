import { Link } from "@tanstack/react-router"

export function Footer() {
  return (
    <footer className="border-t border-border">
      {/* Brand watermark */}
      <div className="py-16 md:py-24 px-6 md:px-10 overflow-hidden">
        <p className="font-display text-[clamp(4rem,15vw,12rem)] leading-none text-foreground/5 tracking-tight select-none">
          kmakeup
        </p>
      </div>

      {/* Footer bar */}
      <div className="border-t border-border px-6 md:px-10 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <span>©KMakeup</span>
          <Link
            to="/"
            className="hover:text-foreground transition-colors"
          >
            Política de privacidad
          </Link>
          <Link
            to="/"
            className="hover:text-foreground transition-colors"
          >
            Términos y condiciones
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://www.instagram.com/kmakeup_c"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Instagram
          </a>
        </div>
      </div>
    </footer>
  )
}
