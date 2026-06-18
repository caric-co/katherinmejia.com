import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { useTranslation } from "react-i18next"
import { Button } from "@repo/ui/components/button"
import { Input } from "@repo/ui/components/input"
import { Label } from "@repo/ui/components/label"
import { Separator } from "@repo/ui/components/separator"
import { authClient } from "#/lib/auth-client"
import { useState } from "react"

export const Route = createFileRoute("/auth/login")({
  component: LoginPage,
})

function LoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    const result = await authClient.signIn.email({
      email,
      password,
      callbackURL: "/",
    })
    if (result.error) {
      setError(result.error.message ?? "Error al iniciar sesión")
    } else {
      navigate({ to: "/" })
    }
    setLoading(false)
  }

  const handleGoogleLogin = async () => {
    await authClient.signIn.social({ provider: "google", callbackURL: "/" })
  }

  const handleAppleLogin = async () => {
    await authClient.signIn.social({ provider: "apple", callbackURL: "/" })
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-h2 tracking-tight mb-2 text-center">
          {t("nav.login")}
        </h1>
        <p className="text-muted-foreground text-center mb-8">
          Ingresa a tu cuenta para acceder a los cursos
        </p>

        <div className="space-y-3 mb-6">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleLogin}
          >
            Continuar con Google
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleAppleLogin}
          >
            Continuar con Apple
          </Button>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <Separator className="flex-1" />
          <span className="text-sm text-muted-foreground">o</span>
          <Separator className="flex-1" />
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-5">
          <div>
            <Label className="text-xs uppercase tracking-wider font-medium mb-2 block">
              Correo electrónico
            </Label>
            <Input
              type="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Label className="text-xs uppercase tracking-wider font-medium mb-2 block">
              Contraseña
            </Label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </Button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <Link
            to="/auth/forgot-password"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ¿Olvidaste tu contraseña?
          </Link>
          <p className="text-sm text-muted-foreground">
            ¿No tienes cuenta?{" "}
            <Link
              to="/auth/register"
              className="text-foreground underline underline-offset-2 hover:opacity-70"
            >
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
