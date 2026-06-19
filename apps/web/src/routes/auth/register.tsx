import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { useForm } from "@tanstack/react-form"
import { z } from "zod"
import { Button } from "@repo/ui/components/button"
import { Separator } from "@repo/ui/components/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@repo/ui/components/tooltip"
import { toast } from "sonner"
import { authClient } from "#/lib/auth-client"
import { useState, useEffect } from "react"
import { FormField, fieldAnimations } from "#/components/form-field"
import { motion, useAnimationControls, AnimatePresence } from "motion/react"

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

function RegisterPage() {
  const navigate = useNavigate()
  const [serverError, setServerError] = useState("")
  const submitControls = useAnimationControls()

  useEffect(() => {
    fieldAnimations.set(SUBMIT_ID, () => {
      submitControls.start({
        scale: [1, 1.04, 1],
        transition: { duration: 0.35, ease: "easeOut" },
      })
    })
    return () => { fieldAnimations.delete(SUBMIT_ID) }
  }, [submitControls])

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
              const fieldLabels: Record<string, string> = {
                firstName: "Nombre",
                lastName: "Apellido",
                email: "Correo electrónico",
                password: "Contraseña",
              }
              const emptyFields = Object.entries(values as Record<string, string>)
                .filter(([, v]) => !v)
                .map(([k]) => fieldLabels[k] ?? k)

              const isReady = !isDisabled && !emptyFields.length

              const submitButton = (
                <motion.div animate={submitControls}>
                  <Button id={SUBMIT_ID} type="submit" className="w-full h-11" disabled={isDisabled}>
                    {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
                  </Button>
                </motion.div>
              )

              if (isReady) {
                return (
                  <div>
                    {submitButton}
                    <AnimatePresence>
                      <motion.p
                        key="hint"
                        initial={{ height: 0, opacity: 0, clipPath: "inset(0 100% 0 0)" }}
                        animate={{ height: "auto", opacity: 1, clipPath: "inset(0 0% 0 0)" }}
                        transition={{ height: { duration: 0.3 }, opacity: { duration: 0.2 }, clipPath: { duration: 0.4, delay: 0.15 } }}
                        className="text-xs text-muted-foreground text-center mt-2 overflow-hidden"
                      >
                        Presiona Enter para finalizar el registro
                      </motion.p>
                    </AnimatePresence>
                  </div>
                )
              }

              if (emptyFields.length) {
                return (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger render={<div className="w-full" />}>
                        {submitButton}
                      </TooltipTrigger>
                      <TooltipContent className="block">
                        <p className="mb-1">Completa los campos:</p>
                        <ul className="list-disc pl-4">
                          {emptyFields.map((f) => <li key={f}>{f}</li>)}
                        </ul>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )
              }

              return submitButton
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
