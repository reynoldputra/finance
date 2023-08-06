import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@client/components/ui/checkbox";
import { DataTableColumnHeader } from "@client/components/table/DataTableColumnHeader";
import { RowAction } from "./RowAction";
import { TKolektorTable } from "../../../../server/collections/kolektor/kolektorSchema";

export const KolektorColumn: ColumnDef<TKolektorTable>[] = [
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
    accessorKey: "nama",
    id: "Nama Kolektor",
    header: ({ column, table }) => (
      <DataTableColumnHeader table={table} column={column} title="Nama" />
    ),
    cell: ({ row }) => <div className="w-[180px]">{row.getValue("Nama Kolektor")}</div>,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },

  },
  {
    accessorKey: "penagihanWaiting",
    header: ({ column, table }) => (
      <DataTableColumnHeader
        table={table}
        column={column}
        title="Penagihan Waiting"
      />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("penagihanWaiting")}
          </span>
        </div>
      );
    },
    filterFn: "inNumberRange",
  },
  {
    id: "actions",
    cell: ({ row }) => <RowAction row={row} />,
  },
];
