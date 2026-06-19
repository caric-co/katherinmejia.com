import { useState } from "react";

import { useForm } from "@tanstack/react-form";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@repo/ui/components/button";
import { Separator } from "@repo/ui/components/separator";

import { FormField } from "#/components/form-field";
import { SmartSubmit } from "#/components/smart-submit";
import { authClient } from "#/lib/auth-client";
import { useSubmitPulse } from "#/lib/form-primitives";

export const Route = createFileRoute("/auth/login")({
  component: LoginPage,
});

const loginSchema = z.object({
  email: z.string().email("Correo no válido"),
  password: z.string().min(1, "Ingresa tu contraseña"),
});

const SUBMIT_ID = "login-submit";

const fieldLabels: Record<string, string> = {
  email: "Correo electrónico",
  password: "Contraseña",
};

function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const submitControls = useSubmitPulse(SUBMIT_ID);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onChange: loginSchema,
    },
    onSubmit: async ({ value }) => {
      setServerError("");
      const result = await authClient.signIn.email({
        email: value.email,
        password: value.password,
        callbackURL: "/",
      });
      if (result.error) {
        setServerError(t("auth.invalidCredentials"));
        return;
      }
      toast.success("Sesión iniciada");
      navigate({ to: "/" });
    },
  });

  const handleGoogleLogin = async () => {
    await authClient.signIn.social({ provider: "google", callbackURL: "/" });
  };

  const handleAppleLogin = async () => {
    await authClient.signIn.social({ provider: "apple", callbackURL: "/" });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-h2 tracking-tight mb-2 text-center">{t("nav.login")}</h1>
        <p className="text-muted-foreground text-center mb-8">Ingresa a tu cuenta para acceder a los cursos</p>

        <div className="space-y-3 mb-6">
          <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
            Continuar con Google
          </Button>
          <Button variant="outline" className="w-full" onClick={handleAppleLogin}>
            Continuar con Apple
          </Button>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <Separator className="flex-1" />
          <span className="text-sm text-muted-foreground">o</span>
          <Separator className="flex-1" />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-5"
        >
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isPristine] as const}
            children={([canSubmit, isPristine]) => {
              const isFormValid = canSubmit && !isPristine;

              return (
                <>
                  <form.Field
                    name="email"
                    children={(field) => (
                      <FormField
                        field={field}
                        label="Correo electrónico"
                        type="email"
                        placeholder="tu@correo.com"
                        autoFocus
                        nextFieldId="password"
                        submitId={SUBMIT_ID}
                        isFormValid={isFormValid}
                      />
                    )}
                  />

                  <form.Field
                    name="password"
                    children={(field) => (
                      <FormField
                        field={field}
                        label="Contraseña"
                        type="password"
                        placeholder="••••••••"
                        submitId={SUBMIT_ID}
                        isFormValid={isFormValid}
                      />
                    )}
                  />
                </>
              );
            }}
          />

          <form.Subscribe
            selector={(state) => [state.isSubmitting, state.canSubmit, state.isPristine, state.values] as const}
            children={([isSubmitting, canSubmit, isPristine, values]) => {
              const isDisabled = isSubmitting || !canSubmit || isPristine;
              const emptyFields = Object.entries(values as Record<string, string>)
                .filter(([, v]) => !v)
                .map(([k]) => fieldLabels[k] ?? k);

              return (
                <SmartSubmit
                  id={SUBMIT_ID}
                  controls={submitControls}
                  isSubmitting={isSubmitting}
                  isDisabled={isDisabled}
                  emptyFieldLabels={emptyFields}
                  label="Iniciar sesión"
                  submittingLabel="Ingresando..."
                  hint="Presiona Enter para iniciar sesión"
                />
              );
            }}
          />

          <p className={`text-sm text-center min-h-5 ${serverError ? "text-destructive" : "text-transparent"}`}>
            {serverError || " "}
          </p>
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
            <Link to="/auth/register" className="text-foreground underline underline-offset-2 hover:opacity-70">
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
