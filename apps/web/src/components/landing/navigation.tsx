import { Link } from "@tanstack/react-router"
import { useTranslation } from "react-i18next"
import { useState, useEffect, useRef } from "react"
import { Button } from "@repo/ui/components/button"
import { Avatar, AvatarFallback } from "@repo/ui/components/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu"
import { Menu, X, Settings, LogOut, User } from "lucide-react"
import { useQuery } from "convex/react"
import { api } from "@convex/_generated/api"
import { authClient } from "#/lib/auth-client"
import { usePreviewMode } from "#/lib/use-site-content"

const navLinks = [
  { labelKey: "nav.courses", href: "/courses" },
  { labelKey: "nav.about", href: "/#about" },
  { labelKey: "nav.blog", href: "/blog" },
  { labelKey: "nav.contact", href: "/#contact" },
] as const

export function Navigation() {
  const { t, i18n } = useTranslation()
  const { data: realSession } = authClient.useSession()
  const isPreview = usePreviewMode()
  const session = isPreview ? null : realSession
  const userProfile = useQuery(
    api.users.getByEmail,
    session?.user?.email ? { email: session.user.email } : "skip"
  )
  const isAdmin = userProfile?.role === "admin"
  const navRef = useRef<HTMLElement>(null)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (isPreview) {
      const scrollParent = navRef.current?.closest("[data-scroll-container]")
      if (!scrollParent) return
      const handleScroll = () => setScrolled(scrollParent.scrollTop > 50)
      scrollParent.addEventListener("scroll", handleScroll, { passive: true })
      return () => scrollParent.removeEventListener("scroll", handleScroll)
    }
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isPreview])

  const toggleLocale = () => {
    i18n.changeLanguage(i18n.language === "es" ? "en" : "es")
  }

  const initials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : ""

  return (
    <nav
      ref={navRef}
      className={`${isPreview ? "sticky" : "fixed"} top-0 ${isPreview ? "" : "left-0 right-0"} z-50 px-6 md:px-10 transition-all duration-300 ${
        scrolled
          ? "bg-background/85 backdrop-blur-xl border-b border-border"
          : "bg-gradient-to-b from-background/60 via-background/25 to-transparent pb-10"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between h-14">
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

          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="cursor-pointer">
                <Avatar className="size-8">
                  <AvatarFallback className="text-xs">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5 mb-1">
                  <p className="text-sm font-medium truncate">{session.user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
                </div>
                {isAdmin && (
                  <DropdownMenuItem render={<Link to="/admin" />}>
                    <Settings className="size-4" />
                    Admin
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem render={<Link to="/courses" />}>
                  <User className="size-4" />
                  Mis cursos
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    authClient.signOut({
                      fetchOptions: { onSuccess: () => location.reload() },
                    })
                  }
                >
                  <LogOut className="size-4" />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth/login">
              <Button variant="outline" size="sm">
                {t("nav.login")}
              </Button>
            </Link>
          )}
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

            <div className="pt-4 border-t border-border">
              <button
                onClick={toggleLocale}
                className="text-sm text-foreground/50 cursor-pointer mb-4 block"
              >
                {i18n.language === "es" ? "English" : "Español"}
              </button>

              {session?.user ? (
                <div className="space-y-3">
                  <p className="text-sm font-medium">{session.user.name}</p>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setMenuOpen(false)} className="text-sm text-muted-foreground hover:text-foreground block">
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={() => authClient.signOut({ fetchOptions: { onSuccess: () => location.reload() } })}
                    className="text-sm text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    Cerrar sesión
                  </button>
                </div>
              ) : (
                <Link to="/auth/login" onClick={() => setMenuOpen(false)}>
                  <Button variant="outline" size="sm">
                    {t("nav.login")}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
