import { useState } from "react";

import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";
import { ArrowLeft, Plus, Shield, ShieldOff, Trash2 } from "lucide-react";

import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Separator } from "@repo/ui/components/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@repo/ui/components/table";

export const Route = createFileRoute("/admin/_layout/users/$id")({
  component: UserDetailPage,
});

function UserDetailPage() {
  const { id } = Route.useParams();
  const userId = id as Id<"users">;
  const user = useQuery(api.users.getById, { userId });
  const setStatus = useMutation(api.users.setStatus);
  const setRole = useMutation(api.users.setRole);

  const courses = useQuery(api.courses.listAll);
  const purchases = useQuery(api.purchases.listByUser, { userId: user?.email ?? "" });

  const grantAccess = useMutation(api.purchases.grantAccess);
  const revokeAccess = useMutation(api.purchases.revokeAccess);

  const [granting, setGranting] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("");

  if (user === undefined) return <p className="text-muted-foreground">Cargando...</p>;
  if (user === null) return <p className="text-destructive">Usuario no encontrado</p>;

  const handleGrant = async () => {
    if (!selectedCourse) return;
    setGranting(true);
    await grantAccess({
      userId: user.email,
      courseId: selectedCourse as Id<"courses">,
    });
    setSelectedCourse("");
    setGranting(false);
  };

  const purchasedCourseIds = new Set((purchases ?? []).filter((p) => p.status === "completed").map((p) => p.courseId));

  const availableCourses = (courses ?? []).filter((c) => !purchasedCourseIds.has(c._id));

  return (
    <div className="max-w-3xl">
      <Link to="/admin/users">
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft data-icon="inline-start" className="size-3.5" />
          Usuarios
        </Button>
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-h2">{user.name}</h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={user.role === "admin" ? "default" : "outline"}>
            {user.role === "admin" ? "Admin" : "Estudiante"}
          </Badge>
          {user.status === "blocked" && <Badge variant="destructive">Bloqueado</Badge>}
        </div>
      </div>

      <div className="flex gap-3 mb-8">
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setStatus({
              userId,
              status: user.status === "blocked" ? "active" : "blocked",
            })
          }
        >
          {user.status === "blocked" ? (
            <>
              <ShieldOff data-icon="inline-start" className="size-3.5" /> Desbloquear
            </>
          ) : (
            <>
              <Shield data-icon="inline-start" className="size-3.5" /> Bloquear
            </>
          )}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setRole({ userId, role: user.role === "admin" ? "student" : "admin" })}
        >
          {user.role === "admin" ? "Cambiar a estudiante" : "Hacer admin"}
        </Button>
      </div>

      <Separator className="mb-8" />

      <h2 className="font-display text-h3 mb-4">Cursos con acceso</h2>

      {purchases === undefined ? (
        <p className="text-muted-foreground">Cargando...</p>
      ) : purchases.filter((p) => p.status === "completed").length === 0 ? (
        <p className="text-muted-foreground mb-6">Sin cursos adquiridos</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="bg-muted hover:bg-muted">
              <TableHead>Curso</TableHead>
              <TableHead>Otorgado por</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {purchases
              .filter((p) => p.status === "completed")
              .map((purchase) => {
                const course = courses?.find((c) => c._id === purchase.courseId);
                return (
                  <TableRow key={purchase._id}>
                    <TableCell className="font-medium">{course?.title.es ?? "Curso eliminado"}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{purchase.grantedBy}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => revokeAccess({ purchaseId: purchase._id })}>
                        <Trash2 className="size-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      )}

      <div className="mt-6 flex gap-3 items-end">
        <div className="flex-1">
          <p className="text-xs uppercase tracking-wider font-medium mb-2">Otorgar acceso a curso</p>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full h-10 rounded-none border-0 border-b border-input bg-transparent px-0 py-2 outline-none text-foreground cursor-pointer"
          >
            <option value="">Seleccionar curso...</option>
            {availableCourses.map((c) => (
              <option key={c._id} value={c._id}>
                {c.title.es}
              </option>
            ))}
          </select>
        </div>
        <Button onClick={handleGrant} disabled={!selectedCourse || granting} size="sm">
          <Plus data-icon="inline-start" className="size-3.5" />
          Otorgar
        </Button>
      </div>
    </div>
  );
}
