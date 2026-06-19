import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router"
import { useState, useEffect, useRef } from "react"
import { useQuery } from "convex/react"
import { api } from "@convex/_generated/api"
import { Progress } from "@repo/ui/components/progress"
import {
  LayoutDashboard,
  BookOpen,
  Users,
  FileText,
  Link2,
  PenLine,
  Settings,
  LogOut,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@repo/ui/components/sidebar"
import { Avatar, AvatarFallback } from "@repo/ui/components/avatar"
import { Separator } from "@repo/ui/components/separator"
import { ScrollArea } from "@repo/ui/components/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu"
import { authClient } from "#/lib/auth-client"

export const Route = createFileRoute("/admin/_layout")({
  beforeLoad: async ({ context }) => {
    if (!context.isAuthenticated) {
      throw redirect({ to: "/auth/login" })
    }
  },
  component: AdminLayout,
})

const navGroups = [
  {
    label: "General",
    items: [
      { to: "/admin", label: "Tablero", icon: LayoutDashboard },
    ],
  },
  {
    label: "Contenido",
    items: [
      { to: "/admin/courses", label: "Cursos", icon: BookOpen },
      { to: "/admin/blog", label: "Blog", icon: PenLine },
      { to: "/admin/content", label: "Contenido del Sitio", icon: FileText },
    ],
  },
  {
    label: "Gestión",
    items: [
      { to: "/admin/users", label: "Usuarios", icon: Users },
      { to: "/admin/invitations", label: "Invitaciones", icon: Link2 },
    ],
  },
] as const

function AdminLayout() {
  const { data: session } = authClient.useSession()
  const navigate = useNavigate()
  const userProfile = useQuery(
    api.users.getByEmail,
    session?.user?.email ? { email: session.user.email } : "skip"
  )

  if (userProfile === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    )
  }

  if (!userProfile || userProfile.role !== "admin") {
    navigate({ to: "/" })
    return null
  }

  const initials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?"

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" render={<Link to="/admin" />}>
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent">
                  <Settings className="h-4 w-4 text-foreground" />
                </div>
                <span className="font-display text-sm tracking-tight">
                  KMakeup Admin
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          {navGroups.map((group) => (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.to}>
                      <SidebarMenuButton
                        render={
                          <Link
                            to={item.to}
                            activeProps={{ "data-active": true } as any}
                          />
                        }
                      >
                        <item.icon />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger render={<SidebarMenuButton size="lg" />}>
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="text-xs">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left leading-tight">
                    <span className="truncate text-sm font-medium">
                      {session?.user?.name ?? "Admin"}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {session?.user?.email}
                    </span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" align="start" className="w-56">
                  <DropdownMenuItem render={<Link to="/" />}>
                    <FileText />
                    <span>Ver sitio</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      authClient.signOut({
                        fetchOptions: {
                          onSuccess: () => location.reload(),
                        },
                      })
                    }
                  >
                    <LogOut />
                    <span>Cerrar sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <main className="flex h-dvh flex-1 flex-col overflow-hidden">
        <RouteProgressBar />
        <header className="flex shrink-0 items-center border-b px-4 py-2">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mx-2 h-4" />
          <span className="text-sm font-medium">Administración</span>
        </header>
        <div className="min-h-0 flex-1">
          <ScrollArea className="h-full">
            <div className="p-6">
              <Outlet />
            </div>
          </ScrollArea>
        </div>
      </main>
    </SidebarProvider>
  )
}

function RouteProgressBar() {
  const { isLoading, location } = useRouterState({ select: (s) => ({ isLoading: s.isLoading, location: s.location.pathname }) })
  const [progress, setProgress] = useState(0)
  const prevLocationRef = useRef(location)

  useEffect(() => {
    if (!isLoading) {
      if (prevLocationRef.current !== location) {
        setProgress(100)
        const t = setTimeout(() => setProgress(0), 300)
        prevLocationRef.current = location
        return () => clearTimeout(t)
      }
      setProgress(0)
      return
    }
    setProgress(20)
    const t1 = setTimeout(() => setProgress(50), 200)
    const t2 = setTimeout(() => setProgress(80), 600)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [isLoading, location])

  if (!isLoading && progress === 0) return null

  return (
    <Progress value={progress} className="absolute top-0 left-0 right-0 z-50 h-0.5 rounded-none bg-transparent" />
  )
}
