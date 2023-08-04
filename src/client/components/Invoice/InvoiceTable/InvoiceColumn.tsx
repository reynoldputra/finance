import { DataTableColumnHeader } from "@client/components/table/DataTableColumnHeader";
import { Checkbox } from "@client/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { TInvoiceSchema } from "./data/schema";
import { RowAction } from "./RowAction";

export const InvoiceColumn : ColumnDef<TInvoiceSchema>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "namaCustomer",
    id : "Nama Customer",
    header: ({ column, table }) => <DataTableColumnHeader table={table} column={column} title="Nama Customer" />,
    cell: ({ row }) => <div className="w-[180px]">{row.getValue("Nama Customer")}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => <RowAction row={row} />,
  },
]
