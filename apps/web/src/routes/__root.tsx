import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useRouteContext,
} from "@tanstack/react-router"
import * as React from "react"
import { createServerFn } from "@tanstack/react-start"
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react"
import type { ConvexQueryClient } from "@convex-dev/react-query"
import type { QueryClient } from "@tanstack/react-query"
import { authClient } from "#/lib/auth-client"
import { getToken } from "#/lib/auth-server"
import "#/lib/i18n"
import appCss from "#/styles.css?url"

const getAuth = createServerFn({ method: "GET" }).handler(async () => {
  try {
    return await getToken()
  } catch {
    return undefined
  }
})

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
  convexQueryClient: ConvexQueryClient
}>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Katherin Mejia — Maquilladora Profesional" },
      {
        name: "description",
        content:
          "Cursos de maquillaje profesional y marca personal de Katherin Mejia (@kmakeup_c)",
      },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap",
      },
    ],
  }),
  beforeLoad: async (ctx) => {
    const token = await getAuth()
    if (token) {
      ctx.context.convexQueryClient.serverHttpClient?.setAuth(token)
    }
    return { isAuthenticated: !!token, token }
  },
  component: RootComponent,
})

function RootComponent() {
  const context = useRouteContext({ from: Route.id })
  return (
    <ConvexBetterAuthProvider
      client={context.convexQueryClient.convexClient}
      authClient={authClient}
      initialToken={context.token}
    >
      <RootDocument>
        <Outlet />
      </RootDocument>
    </ConvexBetterAuthProvider>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen antialiased font-body">
        {children}
        <Scripts />
        {import.meta.env.DEV && typeof window !== "undefined" && (
          <React.Suspense>
            <DevTools />
          </React.Suspense>
        )}
      </body>
    </html>
  )
}

function DevTools() {
  const [Comp, setComp] = React.useState<React.ComponentType | null>(null)
  React.useEffect(() => {
    Promise.all([
      import("@tanstack/react-devtools"),
      import("@tanstack/react-router-devtools"),
      import("@tanstack/react-query-devtools"),
    ]).then(([devtools, router, query]) => {
      setComp(() =>
        function Loaded() {
          return (
            <devtools.TanStackDevtools
              config={{ position: "bottom-right" }}
              plugins={[
                { name: "Router", render: <router.TanStackRouterDevtoolsPanel /> },
                { name: "React Query", render: <query.ReactQueryDevtoolsPanel /> },
              ]}
            />
          )
        }
      )
    })
  }, [])
  return Comp ? <Comp /> : null
}
