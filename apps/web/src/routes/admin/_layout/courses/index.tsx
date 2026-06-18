import { createFileRoute, Link } from "@tanstack/react-router"
import { useQuery, useMutation } from "convex/react"
import { api } from "@convex/_generated/api"
import { Button } from "@repo/ui/components/button"
import { Badge } from "@repo/ui/components/badge"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@repo/ui/components/table"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu"
import { Plus, MoreHorizontal, Eye, Pencil, Archive, BookOpen } from "lucide-react"

export const Route = createFileRoute("/admin/_layout/courses/")({
  component: CoursesListPage,
})

const statusLabel = { draft: "Borrador", published: "Publicado", archived: "Archivado" }
const statusVariant = {
  draft: "outline" as const,
  published: "default" as const,
  archived: "secondary" as const,
}

function CoursesListPage() {
  const courses = useQuery(api.courses.listAll)
  const updateStatus = useMutation(api.courses.updateStatus)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
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
        <Table>
          <TableHeader>
            <TableRow className="bg-muted hover:bg-muted">
              <TableHead>Curso</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-center">Lecciones</TableHead>
              <TableHead className="text-right">Precio (COP)</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course._id}>
                <TableCell>
                  <div className="font-medium">{course.title.es}</div>
                  <div className="text-sm text-muted-foreground">/{course.slug.es}</div>
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant[course.status]}>
                    {statusLabel[course.status]}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">{course.lessonCount}</TableCell>
                <TableCell className="text-right font-mono">
                  ${course.price.toLocaleString("es-CO")}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
                      <MoreHorizontal className="size-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem render={<Link to={`/admin/courses/${course._id}`} />}>
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
