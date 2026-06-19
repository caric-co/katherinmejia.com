import { createFileRoute, Link } from "@tanstack/react-router"
import { useQuery, useMutation } from "convex/react"
import { api } from "@convex/_generated/api"
import type { Doc } from "@convex/_generated/dataModel"
import { Button } from "@repo/ui/components/button"
import { Badge } from "@repo/ui/components/badge"
import { Input } from "@repo/ui/components/input"
import { DataTable, type ColumnDef } from "@repo/ui/components/data-table"
import { DataTableColumnHeader } from "@repo/ui/components/data-table-column-header"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@repo/ui/components/select"
import {
  Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle,
} from "@repo/ui/components/sheet"
import {
  Plus, MoreHorizontal, Eye, Pencil, Archive, BookOpen,
  Search, SlidersHorizontal, X, Settings2, Check,
} from "lucide-react"
import { useState } from "react"
import { formatCOP, formatDate } from "@repo/utils"

export const Route = createFileRoute("/admin/_layout/courses/")({
  component: CoursesListPage,
})

type Course = Doc<"courses"> & { lessonCount: number }

const statusLabels: Record<string, string> = {
  draft: "Borrador",
  published: "Publicado",
  archived: "Archivado",
}

const statusVariant: Record<string, "default" | "outline" | "secondary"> = {
  draft: "outline",
  published: "default",
  archived: "secondary",
}

const statusItems = {
  all: "Todos",
  draft: "Borrador",
  published: "Publicado",
  archived: "Archivado",
}

const columnLabels: Record<string, string> = {
  title: "Curso",
  status: "Estado",
  lessonCount: "Lecciones",
  price: "Precio",
  createdAt: "Creado el",
}

function CoursesListPage() {
  const courses = useQuery(api.courses.listAll)
  const updateStatus = useMutation(api.courses.updateStatus)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sheetOpen, setSheetOpen] = useState(false)

  const isFiltered = statusFilter !== "all"

  const columns: ColumnDef<Course, any>[] = [
    {
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Curso" />
      ),
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.title.es}</div>
          <div className="text-sm text-muted-foreground">/{row.original.slug.es}</div>
        </div>
      ),
      sortingFn: (a, b) => a.original.title.es.localeCompare(b.original.title.es),
    },
    {
      accessorKey: "status",
      size: 140,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Estado" />
      ),
      cell: ({ row }) => (
        <Badge variant={statusVariant[row.original.status] ?? "outline"}>
          {statusLabels[row.original.status] ?? row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: "lessonCount",
      size: 120,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Lecciones" />
      ),
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.lessonCount}</span>
      ),
    },
    {
      accessorKey: "price",
      size: 150,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Precio" />
      ),
      cell: ({ row }) => (
        <span className="font-mono text-sm">{formatCOP(row.original.price)}</span>
      ),
    },
    {
      accessorKey: "createdAt",
      size: 200,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Creado el" />
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
        const course = row.original
        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
                <MoreHorizontal className="size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem render={<Link to={`/admin/courses/${course.slug.es}`} />}>
                  <Pencil className="size-4" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem render={<Link to={`/admin/courses/${course._id}/lessons`} />}>
                  <BookOpen className="size-4" />
                  Lecciones
                </DropdownMenuItem>
                {course.status === "draft" && (
                  <DropdownMenuItem onClick={() => updateStatus({ courseId: course._id, status: "published" })}>
                    <Eye className="size-4" />
                    Publicar
                  </DropdownMenuItem>
                )}
                {course.status === "published" && (
                  <DropdownMenuItem onClick={() => updateStatus({ courseId: course._id, status: "archived" })}>
                    <Archive className="size-4" />
                    Archivar
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
      enableSorting: false,
      enableHiding: false,
    },
  ]

  const filteredData = ((courses as Course[] | undefined) ?? []).filter((c) => {
    if (statusFilter !== "all" && c.status !== statusFilter) return false
    if (search) {
      const term = search.toLowerCase()
      if (!c.title.es.toLowerCase().includes(term) && !c.slug.es.toLowerCase().includes(term)) return false
    }
    return true
  })

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <h1 className="font-display text-h2">Cursos</h1>
        <Link to="/admin/courses/new">
          <Button>
            <Plus data-icon="inline-start" className="size-4" />
            Nuevo curso
          </Button>
        </Link>
      </div>

      {courses === undefined ? (
        <p className="text-muted-foreground">Cargando...</p>
      ) : courses.length === 0 ? (
        <div className="text-center py-16">
          <BookOpen className="size-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">No hay cursos creados</p>
          <Link to="/admin/courses/new">
            <Button variant="outline">Crear primer curso</Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3 mb-1 shrink-0">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
              <Input
                placeholder="Buscar por título o slug..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-6"
              />
            </div>

            <div className="hidden md:flex items-center gap-2">
              <Select items={statusItems} value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-36 h-8 text-xs">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="draft">Borrador</SelectItem>
                  <SelectItem value="published">Publicado</SelectItem>
                  <SelectItem value="archived">Archivado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:hidden">
              <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger
                  render={
                    <Button variant="outline" size="sm" className="relative" />
                  }
                >
                  <SlidersHorizontal className="size-4" />
                  {isFiltered && (
                    <span className="absolute -top-1 -right-1 size-4 rounded-full bg-foreground text-background text-[10px] flex items-center justify-center">
                      1
                    </span>
                  )}
                </SheetTrigger>
                <SheetContent side="bottom">
                  <SheetHeader>
                    <SheetTitle>Filtros</SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-4 p-4">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-xs font-medium text-muted-foreground">Estado</span>
                      <Select
                        items={statusItems}
                        value={statusFilter}
                        onValueChange={setStatusFilter}
                      >
                        <SelectTrigger className="h-10 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="draft">Borrador</SelectItem>
                          <SelectItem value="published">Publicado</SelectItem>
                          <SelectItem value="archived">Archivado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => { setStatusFilter("all"); setSheetOpen(false) }}
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

          {isFiltered && (
            <div className="flex items-center gap-2 flex-wrap py-2 shrink-0">
              <button
                onClick={() => setStatusFilter("all")}
                className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs text-foreground transition-colors hover:bg-muted/70"
              >
                <span className="text-muted-foreground">Estado:</span>
                {statusLabels[statusFilter] ?? statusFilter}
                <X className="size-3 text-muted-foreground" />
              </button>
            </div>
          )}

          <DataTable
            columns={columns}
            data={filteredData}
            showPagination
            pageSize={10}
            emptyMessage="No se encontraron cursos"
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
