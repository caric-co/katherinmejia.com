import { createFileRoute, Link } from "@tanstack/react-router"
import { useQuery, useMutation } from "convex/react"
import { api } from "@convex/_generated/api"
import type { Doc } from "@convex/_generated/dataModel"
import { Badge } from "@repo/ui/components/badge"
import { Button } from "@repo/ui/components/button"
import { Input } from "@repo/ui/components/input"
import { DataTable, type ColumnDef } from "@repo/ui/components/data-table"
import { DataTableColumnHeader } from "@repo/ui/components/data-table-column-header"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu"
import {
  Tooltip, TooltipTrigger, TooltipContent, TooltipProvider,
} from "@repo/ui/components/tooltip"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@repo/ui/components/select"
import {
  Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle,
} from "@repo/ui/components/sheet"
import { Users, Trash2, Search, SlidersHorizontal, X, Settings2, Check } from "lucide-react"
import { useState } from "react"
import { formatDate } from "@repo/utils"

export const Route = createFileRoute("/admin/_layout/users/")({
  component: UsersListPage,
})

type User = Doc<"users">

const roleLabels: Record<string, string> = {
  admin: "Admin",
  student: "Estudiante",
}

const statusLabels: Record<string, string> = {
  active: "Activo",
  blocked: "Bloqueado",
}

const columnLabels: Record<string, string> = {
  name: "Nombre",
  email: "Correo",
  role: "Rol",
  status: "Estado",
  createdAt: "Registrado el",
}

interface Filters {
  role: string
  status: string
}

const roleItems = {
  all: "Todos los roles",
  admin: "Admin",
  student: "Estudiante",
}

const statusItems = {
  all: "Todos",
  active: "Activo",
  blocked: "Bloqueado",
}

function FilterSelects({ filters, onChange }: {
  filters: Filters
  onChange: (filters: Filters) => void
}) {
  return (
    <>
      <Select items={roleItems} value={filters.role} onValueChange={(v) => onChange({ ...filters, role: v })}>
        <SelectTrigger className="w-36 h-8 text-xs">
          <SelectValue placeholder="Rol" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los roles</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="student">Estudiante</SelectItem>
        </SelectContent>
      </Select>
      <Select items={statusItems} value={filters.status} onValueChange={(v) => onChange({ ...filters, status: v })}>
        <SelectTrigger className="w-36 h-8 text-xs">
          <SelectValue placeholder="Estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="active">Activo</SelectItem>
          <SelectItem value="blocked">Bloqueado</SelectItem>
        </SelectContent>
      </Select>
    </>
  )
}

function UsersListPage() {
  const users = useQuery(api.users.list, {})
  const setStatus = useMutation(api.users.setStatus)
  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState<Filters>({ role: "all", status: "all" })
  const [sheetOpen, setSheetOpen] = useState(false)

  const handleDelete = (userId: string, userName: string) => {
    if (!confirm(`¿Eliminar a ${userName}? Esta acción no se puede deshacer.`)) return
    setStatus({ userId: userId as any, status: "deleted" })
  }

  const activeFilters = Object.entries(filters).filter(([, v]) => v !== "all")
  const hasActiveFilters = activeFilters.length > 0

  const clearFilter = (key: keyof Filters) => {
    setFilters((prev) => ({ ...prev, [key]: "all" }))
  }

  const clearAllFilters = () => {
    setFilters({ role: "all", status: "all" })
  }

  const columns: ColumnDef<User, any>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nombre" />
      ),
      cell: ({ row }) => (
        <Link
          to={`/admin/users/${row.original._id}`}
          className="font-medium hover:opacity-70 transition-opacity"
        >
          {row.original.name} {row.original.lastName ?? ""}
        </Link>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Correo" />
      ),
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.email}</span>
      ),
    },
    {
      accessorKey: "role",
      size: 120,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Rol" />
      ),
      cell: ({ row }) => (
        <Badge variant={row.original.role === "admin" ? "default" : "outline"}>
          {roleLabels[row.original.role] ?? row.original.role}
        </Badge>
      ),
    },
    {
      accessorKey: "status",
      size: 150,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Estado" />
      ),
      cell: ({ row }) => {
        if (row.original.status === "blocked") return <Badge variant="destructive">Bloqueado</Badge>
        return <span className="text-muted-foreground text-sm">Activo</span>
      },
    },
    {
      accessorKey: "createdAt",
      size: 200,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Registrado el" />
      ),
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm whitespace-nowrap">
          {formatDate(row.original.createdAt, "d MMM yyyy, h:mm a")}
        </span>
      ),
    },
    {
      id: "actions",
      header: ({ table }) => {
        const toggleable = table.getAllColumns().filter((c) => c.getCanHide())
        const hasHidden = toggleable.some((c) => !c.getIsVisible())
        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger
                className="flex items-center justify-center size-7 rounded-md hover:bg-background/50 transition-colors"
              >
                <Settings2 className={`size-3.5 ${hasHidden ? "text-foreground" : "text-muted-foreground"}`} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {toggleable.map((col) => (
                  <DropdownMenuItem
                    key={col.id}
                    onClick={() => col.toggleVisibility(!col.getIsVisible())}
                  >
                    <Check className={`size-3.5 ${col.getIsVisible() ? "opacity-100" : "opacity-0"}`} />
                    <span>{columnLabels[col.id] ?? col.id}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
      cell: ({ row }) => {
        const user = row.original
        return (
          <div className="flex justify-end gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStatus({
                userId: user._id,
                status: user.status === "blocked" ? "active" : "blocked",
              })}
            >
              {user.status === "blocked" ? "Desbloquear" : "Bloquear"}
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(user._id, user.name)}
                    />
                  }
                >
                  <Trash2 className="size-4" />
                </TooltipTrigger>
                <TooltipContent>Eliminar usuario</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )
      },
      enableSorting: false,
      enableHiding: false,
    },
  ]

  const filteredData = (users ?? []).filter((u) => {
    if (filters.role !== "all" && u.role !== filters.role) return false
    if (filters.status !== "all" && u.status !== filters.status) return false
    if (search) {
      const term = search.toLowerCase()
      const fullName = `${u.name} ${u.lastName ?? ""}`.toLowerCase()
      if (!fullName.includes(term) && !u.email.toLowerCase().includes(term)) return false
    }
    return true
  })

  const filterLabels: Record<string, Record<string, string>> = {
    role: { label: "Rol", ...roleLabels },
    status: { label: "Estado", ...statusLabels },
  }

  return (
    <div className="flex flex-col h-full">
      <h1 className="font-display text-h2 mb-6 shrink-0">Usuarios</h1>

      {users === undefined ? (
        <p className="text-muted-foreground">Cargando...</p>
      ) : users.length === 0 ? (
        <div className="text-center py-16">
          <Users className="size-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">No hay usuarios registrados</p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3 mb-1">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
              <Input
                placeholder="Buscar por nombre o correo..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-6"
              />
            </div>

            <div className="hidden md:flex items-center gap-2">
              <FilterSelects filters={filters} onChange={setFilters} />
            </div>

            <div className="md:hidden">
              <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger
                  render={
                    <Button variant="outline" size="sm" className="relative" />
                  }
                >
                  <SlidersHorizontal className="size-4" />
                  {hasActiveFilters && (
                    <span className="absolute -top-1 -right-1 size-4 rounded-full bg-foreground text-background text-[10px] flex items-center justify-center">
                      {activeFilters.length}
                    </span>
                  )}
                </SheetTrigger>
                <SheetContent side="bottom">
                  <SheetHeader>
                    <SheetTitle>Filtros</SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-4 p-4">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-xs font-medium text-muted-foreground">Rol</span>
                      <Select
                        items={roleItems}
                        value={filters.role}
                        onValueChange={(v) => setFilters((p) => ({ ...p, role: v }))}
                      >
                        <SelectTrigger className="h-10 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos los roles</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="student">Estudiante</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-xs font-medium text-muted-foreground">Estado</span>
                      <Select
                        items={statusItems}
                        value={filters.status}
                        onValueChange={(v) => setFilters((p) => ({ ...p, status: v }))}
                      >
                        <SelectTrigger className="h-10 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="active">Activo</SelectItem>
                          <SelectItem value="blocked">Bloqueado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          clearAllFilters()
                          setSheetOpen(false)
                        }}
                      >
                        Limpiar
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => setSheetOpen(false)}
                      >
                        Aplicar
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex items-center gap-2 flex-wrap py-2">
              {activeFilters.map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => clearFilter(key as keyof Filters)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs text-foreground transition-colors hover:bg-muted/70"
                >
                  <span className="text-muted-foreground">{filterLabels[key]?.label}:</span>
                  {filterLabels[key]?.[value] ?? value}
                  <X className="size-3 text-muted-foreground" />
                </button>
              ))}
              <button
                onClick={clearAllFilters}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Limpiar todo
              </button>
            </div>
          )}

          <DataTable
            columns={columns}
            data={filteredData}
            showPagination
            pageSize={10}
            emptyMessage="No se encontraron usuarios"
            className="flex-1 min-h-0"
            tableOptions={{
              initialState: {
                sorting: [{ id: "createdAt", desc: true }],
              },
            }}
          />
        </>
      )}
    </div>
  )
}
