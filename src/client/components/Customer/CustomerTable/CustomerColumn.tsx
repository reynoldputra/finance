import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@client/components/ui/badge";
import { Checkbox } from "@client/components/ui/checkbox";

import { labels } from "./data/data";
import { DataTableColumnHeader } from "@client/components/table/DataTableColumnHeader";
import { ICustomerTable } from "@server/types/customer";
import { RowAction } from "./RowAction";
import { idr } from "@client/lib/idr";

export const CustomerColumn: ColumnDef<ICustomerTable>[] = [
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
    id: "Nama Customer",
    header: ({ column, table }) => <DataTableColumnHeader table={table} column={column} title="Nama" />,
    cell: ({ row }) => <div className="w-[180px]">{row.getValue("Nama Customer")}</div>,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "kolektorNama",
    id: "Nama Kolektor",
    header: ({ column, table }) => <DataTableColumnHeader table={table} column={column} title="Nama Kolektor" />,
    cell: ({ row }) => <div className="w-[180px]">{row.getValue("Nama Kolektor")}</div>,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "invoiceAktif",
    header: ({ column, table }) => <DataTableColumnHeader table={table} column={column} title="Invoice Aktif" />,
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">{row.getValue("invoiceAktif")}</span>
        </div>
      );
    },
    filterFn: 'inNumberRange'
  },
  {
    accessorKey: "jumlahTagihan",
    header: ({ column, table }) => <DataTableColumnHeader table={table} column={column} title="Jumlah Tagihan" />,
    cell: ({ row }) => {
      const label = labels.find((label) => label.value === row.original.jumlahTagihan.toString());

      return (
        <div className="flex space-x-2">
          {label && <Badge variant="outline">{label.label}</Badge>}
          <span className="max-w-[500px] truncate font-medium">Rp {idr(parseInt(row.getValue("jumlahTagihan")))}</span>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <RowAction row={row} />,
  },
];
