import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { Button } from "@repo/ui/components/button"
import { Input } from "@repo/ui/components/input"
import { Label } from "@repo/ui/components/label"
import { Separator } from "@repo/ui/components/separator"
import { authClient } from "#/lib/auth-client"
import { useState } from "react"

export const Route = createFileRoute("/auth/register")({
  component: RegisterPage,
})

function RegisterPage() {
  const navigate = useNavigate()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    const result = await authClient.signUp.email({
      name: `${firstName} ${lastName}`.trim(),
      email,
      password,
      callbackURL: "/",
    })
    if (result.error) {
      setError(result.error.message ?? "Error al crear cuenta")
    } else {
      navigate({ to: "/" })
    }
    setLoading(false)
  }

  const handleGoogleLogin = async () => {
    await authClient.signIn.social({ provider: "google", callbackURL: "/" })
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-h2 tracking-tight mb-2 text-center">
          Crear cuenta
        </h1>
        <p className="text-muted-foreground text-center mb-8">
          Regístrate para acceder a los cursos de maquillaje
        </p>

        <Button
          variant="outline"
          className="w-full mb-6"
          onClick={handleGoogleLogin}
        >
          Continuar con Google
        </Button>

        <div className="flex items-center gap-3 mb-6">
          <Separator className="flex-1" />
          <span className="text-sm text-muted-foreground">o</span>
          <Separator className="flex-1" />
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs uppercase tracking-wider font-medium mb-2 block">
                Nombre
              </Label>
              <Input
                type="text"
                placeholder="Katherin"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider font-medium mb-2 block">
                Apellido
              </Label>
              <Input
                type="text"
                placeholder="Mejia"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>
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
              placeholder="Mínimo 8 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          ¿Ya tienes cuenta?{" "}
          <Link
            to="/auth/login"
            className="text-foreground underline underline-offset-2 hover:opacity-70"
          >
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
