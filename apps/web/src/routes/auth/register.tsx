import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { useForm } from "@tanstack/react-form"
import { z } from "zod"
import { Button } from "@repo/ui/components/button"
import { Separator } from "@repo/ui/components/separator"
import { toast } from "sonner"
import { authClient } from "#/lib/auth-client"
import { useState } from "react"
import { useSubmitPulse } from "#/lib/form-primitives"
import { FormField } from "#/components/form-field"
import { SmartSubmit } from "#/components/smart-submit"

export const Route = createFileRoute("/auth/register")({
  component: RegisterPage,
})

const registerSchema = z.object({
  firstName: z.string().min(2, "Mínimo 2 caracteres"),
  lastName: z.string().min(2, "Mínimo 2 caracteres"),
  email: z.string().email("Correo no válido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
})

const SUBMIT_ID = "register-submit"

const fieldLabels: Record<string, string> = {
  firstName: "Nombre",
  lastName: "Apellido",
  email: "Correo electrónico",
  password: "Contraseña",
}

function RegisterPage() {
  const navigate = useNavigate()
  const [serverError, setServerError] = useState("")
  const submitControls = useSubmitPulse(SUBMIT_ID)

  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
    validators: {
      onChange: registerSchema,
    },
    onSubmit: async ({ value }) => {
      setServerError("")
      const result = await authClient.signUp.email({
        name: `${value.firstName} ${value.lastName}`,
        email: value.email,
        password: value.password,
        callbackURL: "/",
      })
      if (result.error) {
        setServerError(result.error.message ?? "Error al crear cuenta")
        toast.error("No se pudo crear la cuenta")
        return
      }
      toast.success(`Bienvenida, ${value.firstName}`)
      navigate({ to: "/" })
    },
  })

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

        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
          className="space-y-5"
        >
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isPristine] as const}
            children={([canSubmit, isPristine]) => {
              const isFormValid = canSubmit && !isPristine

              return (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <form.Field
                      name="firstName"
                      children={(field) => (
                        <FormField field={field} label="Nombre" placeholder="Katherin" autoFocus nextFieldId="lastName" submitId={SUBMIT_ID} isFormValid={isFormValid} />
                      )}
                    />
                    <form.Field
                      name="lastName"
                      children={(field) => (
                        <FormField field={field} label="Apellido" placeholder="Mejia" nextFieldId="email" submitId={SUBMIT_ID} isFormValid={isFormValid} />
                      )}
                    />
                  </div>

                  <form.Field
                    name="email"
                    children={(field) => (
                      <FormField field={field} label="Correo electrónico" type="email" placeholder="tu@correo.com" nextFieldId="password" submitId={SUBMIT_ID} isFormValid={isFormValid} />
                    )}
                  />

                  <form.Field
                    name="password"
                    children={(field) => (
                      <FormField field={field} label="Contraseña" type="password" placeholder="Mínimo 8 caracteres" submitId={SUBMIT_ID} isFormValid={isFormValid} />
                    )}
                  />
                </>
              )
            }}
          />

          {serverError && <p className="text-sm text-destructive">{serverError}</p>}

          <form.Subscribe
            selector={(state) => [state.isSubmitting, state.canSubmit, state.isPristine, state.values] as const}
            children={([isSubmitting, canSubmit, isPristine, values]) => {
              const isDisabled = isSubmitting || !canSubmit || isPristine
              const emptyFields = Object.entries(values as Record<string, string>)
                .filter(([, v]) => !v)
                .map(([k]) => fieldLabels[k] ?? k)

              return (
                <SmartSubmit
                  id={SUBMIT_ID}
                  controls={submitControls}
                  isSubmitting={isSubmitting}
                  isDisabled={isDisabled}
                  emptyFieldLabels={emptyFields}
                  label="Crear cuenta"
                  submittingLabel="Creando cuenta..."
                  hint="Presiona Enter para finalizar el registro"
                />
              )
            }}
          />
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
