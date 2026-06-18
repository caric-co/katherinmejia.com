import { createFileRoute } from "@tanstack/react-router"
import { useQuery, useMutation } from "convex/react"
import { api } from "@convex/_generated/api"
import { Badge } from "@repo/ui/components/badge"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@repo/ui/components/table"
import { Button } from "@repo/ui/components/button"
import { Users } from "lucide-react"

export const Route = createFileRoute("/admin/_layout/users/")({
  component: UsersListPage,
})

function UsersListPage() {
  const users = useQuery(api.users.list, {})
  const blockUser = useMutation(api.users.blockUser)

  return (
    <div>
      <h1 className="font-display text-h2 mb-6">Usuarios</h1>

      {users === undefined ? (
        <p className="text-muted-foreground">Cargando...</p>
      ) : users.length === 0 ? (
        <div className="text-center py-16">
          <Users className="size-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">No hay usuarios registrados</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="bg-muted hover:bg-muted">
              <TableHead>Nombre</TableHead>
              <TableHead>Correo</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>
                  <Link to={`/admin/users/${user._id}`} className="font-medium hover:opacity-70 transition-opacity">
                    {user.name}
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.role === "admin" ? "default" : "outline"}>
                    {user.role === "admin" ? "Admin" : "Estudiante"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {user.isBlocked && (
                    <Badge variant="destructive">Bloqueado</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => blockUser({ userId: user._id, isBlocked: !user.isBlocked })}
                  >
                    {user.isBlocked ? "Desbloquear" : "Bloquear"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
