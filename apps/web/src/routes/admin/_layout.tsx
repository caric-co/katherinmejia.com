import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
  useMatches,
} from "@tanstack/react-router"
import { useTranslation } from "react-i18next"
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
