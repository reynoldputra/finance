import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@client/components/ui/checkbox";
import { TTandaTerimaTable } from "./data/schema";
import { DataTableColumnHeader } from "@client/components/table/DataTableColumnHeader";
import { RowAction } from "./RowAction";

export const TandaTerimaColumn: ColumnDef<TTandaTerimaTable>[] = [
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
    id: "Nama Customer",
    header: ({ column, table }) => (
      <DataTableColumnHeader
        table={table}
        column={column}
        title="Nama Customer"
      />
    ),
    cell: ({ row }) => (
      <div className="w-[180px]">{row.getValue("Nama Customer")}</div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "jumlahInvoice",
    id: "Jumlah Invoice",
    header: ({ column, table }) => (
      <DataTableColumnHeader
        table={table}
        column={column}
        title="Jumlah Invoice"
      />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {row.getValue("Jumlah Invoice")}
        </span>
      </div>
    ),
    filterFn: "inNumberRange",
  },
  {
    id: "actions",
    cell: ({ row }) => <RowAction row={row} />,
  },
];
