import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/_layout/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  return (
    <div>
      <h1 className="font-display text-h2 mb-4">Tablero</h1>
      <p className="text-muted-foreground">Panel de administración de KMakeup.</p>
    </div>
  );
}
