import { Link } from "@tanstack/react-router"
import { useTranslation } from "react-i18next"
import { useState, useEffect } from "react"
import { Button } from "@repo/ui/components/button"
import { Menu, X } from "lucide-react"

const navLinks = [
  { labelKey: "nav.courses", href: "#courses" },
  { labelKey: "nav.about", href: "#about" },
  { labelKey: "nav.blog", href: "/blog" },
  { labelKey: "nav.contact", href: "#contact" },
] as const

export function Navigation() {
  const { t, i18n } = useTranslation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleLocale = () => {
    i18n.changeLanguage(i18n.language === "es" ? "en" : "es")
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/85 backdrop-blur-xl border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between h-14">
        <Link to="/" className="font-display text-xl tracking-tight">
          Katherin Mejia
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.labelKey}
              href={link.href}
              className="text-sm uppercase tracking-wider text-foreground/70 hover:text-foreground transition-colors"
            >
              {t(link.labelKey)}
            </a>
          ))}
          <button
            onClick={toggleLocale}
            className="text-xs uppercase tracking-wider text-foreground/50 hover:text-foreground transition-colors cursor-pointer"
          >
            {i18n.language === "es" ? "EN" : "ES"}
          </button>
          <Link to="/auth/login">
            <Button variant="outline" size="sm">
              {t("nav.login")}
            </Button>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden cursor-pointer"
        >
          {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border px-6 pb-6 pt-2">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.labelKey}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-lg font-display"
              >
                {t(link.labelKey)}
              </a>
            ))}
            <div className="flex items-center gap-4 pt-4 border-t border-border">
              <button
                onClick={toggleLocale}
                className="text-sm text-foreground/50 cursor-pointer"
              >
                {i18n.language === "es" ? "English" : "Español"}
              </button>
              <Link to="/auth/login" onClick={() => setMenuOpen(false)}>
                <Button variant="outline" size="sm">
                  {t("nav.login")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
