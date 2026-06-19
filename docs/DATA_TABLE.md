# DataTable — Admin Tables Pattern

Reusable data table built on TanStack Table + shadcn primitives for all admin list views.

## Components

| Component | Package | Purpose |
|---|---|---|
| `DataTable` | `@repo/ui/components/data-table` | Table shell: sorting, filtering, pagination, column visibility |
| `DataTableColumnHeader` | `@repo/ui/components/data-table-column-header` | Sortable header with dropdown (asc/desc/clear/hide) |

## Features

### Multi-sort
Enabled by default (`enableMultiSort: true`). Selecting sort on a column adds it as a secondary criterion instead of replacing. Priority numbers (1, 2, 3...) appear next to sort arrows. "Quitar orden" removes a single column from the sort stack.

### Column visibility
Each sortable column header includes "Ocultar" in its dropdown. To restore hidden columns, add a `Settings2` toggle in the actions column header that lists all toggleable columns with checkmarks.

### Pagination
Client-side via `getPaginationRowModel()`. Pass `showPagination` and `pageSize` props. Pagination bar is sticky at the bottom with `shrink-0`.

### Layout
- Table body scrolls independently (`flex-1 min-h-0 overflow-auto`)
- Column headers are sticky (`sticky top-0 z-10 bg-muted`)
- Pagination stays anchored at bottom
- Parent page uses `flex flex-col h-full` to fill available viewport

### Fixed column widths
Use `size` on column defs to prevent layout shift when interacting with headers:
```tsx
{ accessorKey: "status", size: 150, header: ... }
```
The DataTable applies `size` as inline `width` on `<th>` elements.

### Default sort
Pass via `tableOptions.initialState.sorting`:
```tsx
<DataTable
  tableOptions={{
    initialState: {
      sorting: [{ id: "createdAt", desc: true }],
    },
  }}
/>
```

## Toolbar Pattern (Notion-style)

- **Left:** search input with `Search` icon, `flex-1 min-w-0`
- **Right (desktop):** filter `Select` components, `hidden md:flex`
- **Right (mobile):** `SlidersHorizontal` icon button opening a `Sheet` from bottom with filter selects + Apply/Clear buttons. Badge shows active filter count.
- **Second row:** active filter chips with `X` to remove individually + "Limpiar todo"

## Column Toggle in Actions Header

When a column has `id: "actions"`, use its header to render the `Settings2` visibility toggle:
```tsx
{
  id: "actions",
  header: ({ table }) => {
    const toggleable = table.getAllColumns().filter((c) => c.getCanHide())
    const hasHidden = toggleable.some((c) => !c.getIsVisible())
    return (
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger ...>
            <Settings2 className={hasHidden ? "text-foreground" : "text-muted-foreground"} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {toggleable.map((col) => (
              <DropdownMenuItem key={col.id} onClick={() => col.toggleVisibility(!col.getIsVisible())}>
                <Check className={col.getIsVisible() ? "opacity-100" : "opacity-0"} />
                <span>{columnLabels[col.id] ?? col.id}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  },
  enableSorting: false,
  enableHiding: false,
}
```

## Applied In

- `/admin/users` — user management (search, role/status filters, soft delete)
- `/admin/blog` — blog post management (search, status filter, publish/unpublish actions)
- `/admin/courses` — course management (search, status filter, lesson count, price, publish/archive actions)
