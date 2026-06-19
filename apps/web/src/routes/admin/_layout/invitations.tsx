import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { Link2 } from "lucide-react";

import { api } from "@convex/_generated/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@repo/ui/components/table";

export const Route = createFileRoute("/admin/_layout/invitations")({
  component: InvitationsPage,
});

function InvitationsPage() {
  const invitations = useQuery(api.invitations.listAll);

  return (
    <div>
      <h1 className="font-display text-h2 mb-6">Enlaces de Invitación</h1>

      {invitations === undefined ? (
        <p className="text-muted-foreground">Cargando...</p>
      ) : invitations.length === 0 ? (
        <div className="text-center py-16">
          <Link2 className="size-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">No hay enlaces de invitación. Crea uno desde la página de un curso.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="bg-muted hover:bg-muted">
              <TableHead>Código</TableHead>
              <TableHead className="text-center">Usos</TableHead>
              <TableHead>Expira</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invitations.map((inv) => (
              <TableRow key={inv._id}>
                <TableCell className="font-mono font-medium">{inv.code}</TableCell>
                <TableCell className="text-center">
                  {inv.usedCount} / {inv.maxUses}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {inv.expiresAt ? new Date(inv.expiresAt).toLocaleDateString("es-CO") : "Sin expiración"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
