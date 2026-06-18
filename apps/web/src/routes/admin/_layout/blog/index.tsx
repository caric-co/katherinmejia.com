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
import { Plus, MoreHorizontal, Eye, EyeOff, Trash2, Pencil, PenLine } from "lucide-react"

export const Route = createFileRoute("/admin/_layout/blog/")({
  component: BlogListPage,
})

function BlogListPage() {
  const posts = useQuery(api.blogPosts.listAll)
  const publishPost = useMutation(api.blogPosts.publish)
  const unpublishPost = useMutation(api.blogPosts.unpublish)
  const removePost = useMutation(api.blogPosts.remove)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-h2">Blog</h1>
        <Link to="/admin/blog/new">
          <Button>
            <Plus data-icon="inline-start" className="size-4" />
            Nuevo artículo
          </Button>
        </Link>
      </div>

      {posts === undefined ? (
        <p className="text-muted-foreground">Cargando...</p>
      ) : posts.length === 0 ? (
        <div className="text-center py-16">
          <PenLine className="size-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">No hay artículos</p>
          <Link to="/admin/blog/new">
            <Button variant="outline">Escribir primer artículo</Button>
          </Link>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="bg-muted hover:bg-muted">
              <TableHead>Título</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post._id}>
                <TableCell>
                  <div className="font-medium">{post.title.es}</div>
                  <div className="text-sm text-muted-foreground">/{post.slug.es}</div>
                </TableCell>
                <TableCell>
                  <Badge variant={post.status === "published" ? "default" : "outline"}>
                    {post.status === "published" ? "Publicado" : "Borrador"}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(post.createdAt).toLocaleDateString("es-CO")}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
                      <MoreHorizontal className="size-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem render={<Link to={`/admin/blog/${post._id}`} />}>
                        <Pencil className="size-4" />
                        Editar
                      </DropdownMenuItem>
                      {post.status === "draft" ? (
                        <DropdownMenuItem onClick={() => publishPost({ postId: post._id })}>
                          <Eye className="size-4" />
                          Publicar
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => unpublishPost({ postId: post._id })}>
                          <EyeOff className="size-4" />
                          Despublicar
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem variant="destructive" onClick={() => removePost({ postId: post._id })}>
                        <Trash2 className="size-4" />
                        Eliminar
                      </DropdownMenuItem>
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
