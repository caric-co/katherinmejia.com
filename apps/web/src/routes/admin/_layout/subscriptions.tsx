import { useState } from "react";

import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "convex/react";
import { CreditCard, Search, Settings2, SlidersHorizontal, X } from "lucide-react";

import { api } from "@convex/_generated/api";
import type { Doc } from "@convex/_generated/dataModel";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { type ColumnDef, DataTable } from "@repo/ui/components/data-table";
import { DataTableColumnHeader } from "@repo/ui/components/data-table-column-header";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Input } from "@repo/ui/components/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/components/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@repo/ui/components/sheet";
import { formatDate } from "@repo/utils";

export const Route = createFileRoute("/admin/_layout/subscriptions")({
  component: SubscriptionsPage,
});

type Subscription = Doc<"subscriptions"> & { userName: string; userEmail: string };

const planLabels: Record<string, string> = {
  monthly: "Mensual",
  annual: "Anual",
};

const statusLabels: Record<string, string> = {
  active: "Activa",
  cancelled: "Cancelada",
  past_due: "Vencida",
  expired: "Expirada",
};

const providerLabels: Record<string, string> = {
  wompi: "Wompi",
  bold: "Bold",
  manual: "Manual",
};

const statusVariant: Record<string, "default" | "outline" | "destructive" | "secondary"> = {
  active: "default",
  cancelled: "outline",
  past_due: "destructive",
  expired: "secondary",
};

const columnLabels: Record<string, string> = {
  userName: "Usuario",
  plan: "Plan",
  status: "Estado",
  provider: "Proveedor",
  currentPeriodEnd: "Vence",
  createdAt: "Creada",
};

interface Filters {
  status: string;
  plan: string;
}

const statusItems = {
  all: "Todos",
  active: "Activa",
  cancelled: "Cancelada",
  past_due: "Vencida",
  expired: "Expirada",
};

const planItems = {
  all: "Todos los planes",
  monthly: "Mensual",
  annual: "Anual",
};

function FilterSelects({ filters, onChange }: { filters: Filters; onChange: (filters: Filters) => void }) {
  return (
    <>
      <Select
        items={statusItems}
        value={filters.status}
        onValueChange={(v) => onChange({ ...filters, status: v ?? "" })}
      >
        <SelectTrigger className="w-36 h-8 text-xs">
          <SelectValue placeholder="Estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="active">Activa</SelectItem>
          <SelectItem value="cancelled">Cancelada</SelectItem>
          <SelectItem value="past_due">Vencida</SelectItem>
          <SelectItem value="expired">Expirada</SelectItem>
        </SelectContent>
      </Select>
      <Select items={planItems} value={filters.plan} onValueChange={(v) => onChange({ ...filters, plan: v ?? "" })}>
        <SelectTrigger className="w-36 h-8 text-xs">
          <SelectValue placeholder="Plan" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los planes</SelectItem>
          <SelectItem value="monthly">Mensual</SelectItem>
          <SelectItem value="annual">Anual</SelectItem>
        </SelectContent>
      </Select>
    </>
  );
}

function SubscriptionsPage() {
  const { data: subscriptions } = useQuery(convexQuery(api.subscriptions.list, {}));
  const cancelSub = useMutation(api.subscriptions.cancel);
  const reactivateSub = useMutation(api.subscriptions.reactivate);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Filters>({ status: "all", plan: "all" });
  const [sheetOpen, setSheetOpen] = useState(false);

  const activeFilters = Object.entries(filters).filter(([, v]) => v !== "all");
  const hasActiveFilters = activeFilters.length > 0;

  const clearFilter = (key: keyof Filters) => {
    setFilters((prev) => ({ ...prev, [key]: "all" }));
  };

  const clearAllFilters = () => {
    setFilters({ status: "all", plan: "all" });
  };

  const handleCancel = (sub: Subscription) => {
    if (!confirm(`¿Cancelar suscripción de ${sub.userName}?`)) return;
    cancelSub({ subscriptionId: sub._id });
  };

  const handleReactivate = (sub: Subscription) => {
    const now = Date.now();
    const periodMs = sub.plan === "annual" ? 365 * 24 * 60 * 60 * 1000 : 30 * 24 * 60 * 60 * 1000;
    reactivateSub({
      subscriptionId: sub._id,
      currentPeriodStart: now,
      currentPeriodEnd: now + periodMs,
    });
  };

  const columns: ColumnDef<Subscription, any>[] = [
    {
      accessorKey: "userName",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Usuario" />,
      cell: ({ row }) => (
        <div>
          <span className="font-medium">{row.original.userName}</span>
          <span className="block text-xs text-muted-foreground">{row.original.userEmail}</span>
        </div>
      ),
    },
    {
      accessorKey: "plan",
      size: 120,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Plan" />,
      cell: ({ row }) => <Badge variant="outline">{planLabels[row.original.plan] ?? row.original.plan}</Badge>,
    },
    {
      accessorKey: "status",
      size: 120,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Estado" />,
      cell: ({ row }) => (
        <Badge variant={statusVariant[row.original.status] ?? "outline"}>
          {statusLabels[row.original.status] ?? row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: "provider",
      size: 120,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Proveedor" />,
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">
          {providerLabels[row.original.provider] ?? row.original.provider}
        </span>
      ),
      enableHiding: true,
    },
    {
      accessorKey: "currentPeriodEnd",
      size: 160,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Vence" />,
      cell: ({ row }) => {
        const isExpired = row.original.currentPeriodEnd < Date.now();
        return (
          <span className={`text-sm whitespace-nowrap ${isExpired ? "text-destructive" : "text-muted-foreground"}`}>
            {formatDate(row.original.currentPeriodEnd, "d MMM yyyy")}
          </span>
        );
      },
    },
    {
      accessorKey: "createdAt",
      size: 160,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Creada" />,
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm whitespace-nowrap">
          {formatDate(row.original.createdAt, "d MMM yyyy")}
        </span>
      ),
    },
    {
      id: "actions",
      header: ({ table }) => {
        const toggleable = table.getAllColumns().filter((c) => c.getCanHide());
        const hasHidden = toggleable.some((c) => !c.getIsVisible());
        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center justify-center size-7 rounded-md hover:bg-background/50 transition-colors">
                <Settings2 className={`size-3.5 ${hasHidden ? "text-foreground" : "text-muted-foreground"}`} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {toggleable.map((col) => (
                  <DropdownMenuItem key={col.id} onClick={() => col.toggleVisibility(!col.getIsVisible())}>
                    <span className={col.getIsVisible() ? "opacity-100" : "opacity-30"}>
                      {columnLabels[col.id] ?? col.id}
                    </span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
      cell: ({ row }) => {
        const sub = row.original;
        if (sub.status === "active" || sub.status === "past_due") {
          return (
            <div className="flex justify-end">
              <Button variant="ghost" size="sm" onClick={() => handleCancel(sub)}>
                Cancelar
              </Button>
            </div>
          );
        }
        return (
          <div className="flex justify-end">
            <Button variant="ghost" size="sm" onClick={() => handleReactivate(sub)}>
              Reactivar
            </Button>
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
  ];

  const filteredData = (subscriptions ?? []).filter((sub) => {
    if (filters.status !== "all" && sub.status !== filters.status) return false;
    if (filters.plan !== "all" && sub.plan !== filters.plan) return false;
    if (search) {
      const term = search.toLowerCase();
      if (!sub.userName.toLowerCase().includes(term) && !sub.userEmail.toLowerCase().includes(term)) return false;
    }
    return true;
  });

  const filterLabels: Record<string, Record<string, string>> = {
    status: { label: "Estado", ...statusLabels },
    plan: { label: "Plan", ...planLabels },
  };

  return (
    <div className="flex flex-col h-full">
      <h1 className="font-display text-h2 mb-6 shrink-0">Suscripciones</h1>

      {subscriptions === undefined ? (
        <p className="text-muted-foreground">Cargando...</p>
      ) : subscriptions.length === 0 ? (
        <div className="text-center py-16">
          <CreditCard className="size-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">No hay suscripciones registradas</p>
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
                <SheetTrigger render={<Button variant="outline" size="sm" className="relative" />}>
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
                      <span className="text-xs font-medium text-muted-foreground">Estado</span>
                      <Select
                        items={statusItems}
                        value={filters.status}
                        onValueChange={(v) => setFilters((p) => ({ ...p, status: v ?? "" }))}
                      >
                        <SelectTrigger className="h-10 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="active">Activa</SelectItem>
                          <SelectItem value="cancelled">Cancelada</SelectItem>
                          <SelectItem value="past_due">Vencida</SelectItem>
                          <SelectItem value="expired">Expirada</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-xs font-medium text-muted-foreground">Plan</span>
                      <Select
                        items={planItems}
                        value={filters.plan}
                        onValueChange={(v) => setFilters((p) => ({ ...p, plan: v ?? "" }))}
                      >
                        <SelectTrigger className="h-10 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos los planes</SelectItem>
                          <SelectItem value="monthly">Mensual</SelectItem>
                          <SelectItem value="annual">Anual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          clearAllFilters();
                          setSheetOpen(false);
                        }}
                      >
                        Limpiar
                      </Button>
                      <Button size="sm" className="flex-1" onClick={() => setSheetOpen(false)}>
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
            emptyMessage="No se encontraron suscripciones"
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
  );
}
