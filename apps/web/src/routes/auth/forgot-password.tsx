import { createFileRoute, Link } from "@tanstack/react-router"
import { Button } from "@repo/ui/components/button"
import { Input } from "@repo/ui/components/input"
import { Label } from "@repo/ui/components/label"
import { authClient } from "#/lib/auth-client"
import { useState } from "react"

export const Route = createFileRoute("/auth/forgot-password")({
  component: ForgotPasswordPage,
})

function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await authClient.forgetPassword({ email, redirectTo: "/auth/login" })
    setSent(true)
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="w-full max-w-sm text-center">
          <h1 className="font-display text-h2 tracking-tight mb-4">
            Revisa tu correo
          </h1>
          <p className="text-muted-foreground mb-6">
            Si existe una cuenta con <strong className="text-foreground">{email}</strong>,
            recibirás un enlace para restablecer tu contraseña.
          </p>
          <Link to="/auth/login">
            <Button variant="outline">Volver al inicio de sesión</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-h2 tracking-tight mb-2 text-center">
          Recuperar contraseña
        </h1>
        <p className="text-muted-foreground text-center mb-8">
          Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
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

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Enviando..." : "Enviar enlace"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link
            to="/auth/login"
            className="text-foreground underline underline-offset-2 hover:opacity-70"
          >
            Volver al inicio de sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
