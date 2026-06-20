import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
  useLocation,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { BookOpen, FileText, LayoutDashboard, Link2, LogOut, PenLine, Settings, Users } from "lucide-react";

import { api } from "@convex/_generated/api";
import { Avatar, AvatarFallback } from "@repo/ui/components/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Progress } from "@repo/ui/components/progress";
import { Separator } from "@repo/ui/components/separator";
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
} from "@repo/ui/components/sidebar";

import { authClient } from "#/lib/auth-client";

export const Route = createFileRoute("/admin/_layout")({
  beforeLoad: async ({ context }) => {
    if (!context.isAuthenticated && typeof window === "undefined") {
      throw redirect({ to: "/auth/login" });
    }
  },
  component: AdminLayout,
});

const navGroups = [
  {
    label: "General",
    items: [{ to: "/admin", label: "Tablero", icon: LayoutDashboard }],
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
] as const;

function AdminLayout() {
  const { data: session } = authClient.useSession();
  const navigate = useNavigate();
  const currentPath = useLocation({ select: (l) => l.pathname });
  const userProfile = useQuery(api.users.getByEmail, session?.user?.email ? { email: session.user.email } : "skip");

  if (userProfile === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  if (userProfile?.role !== "admin") {
    navigate({ to: "/" });
    return null;
  }

  const initials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

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
                <span className="font-display text-sm tracking-tight">KMakeup Admin</span>
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
                            disabled={currentPath === item.to}
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
                    <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left leading-tight">
                    <span className="truncate text-sm font-medium">{session?.user?.name ?? "Admin"}</span>
                    <span className="truncate text-xs text-muted-foreground">{session?.user?.email}</span>
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
        <div className="min-h-0 flex-1 p-6 flex flex-col overflow-auto">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
}

function RouteProgressBar() {
  const isLoading = useRouterState({ select: (s) => s.isLoading });

  if (!isLoading) return null;

  return <Progress value={80} className="absolute top-0 left-0 right-0 z-50 h-0.5 rounded-none bg-transparent" />;
}
