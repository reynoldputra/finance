import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@client/components/ui/badge";
import { Checkbox } from "@client/components/ui/checkbox";

import { labels } from "./data/data";
import { DataTableColumnHeader } from "@client/components/table/DataTableColumnHeader";
import { ICustomerTable } from "@server/types/customer";

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
    header: ({ column, table }) => <DataTableColumnHeader table={table} column={column} title="Nama" />,
    cell: ({ row }) => <div className="w-[180px]">{row.getValue("nama")}</div>,
  },
  {
    accessorKey: "kolektorNama",
    header: ({ column, table }) => <DataTableColumnHeader table={table} column={column} title="Kolektor Nama" />,
    cell: ({ row }) => <div className="w-[180px]">{row.getValue("kolektorNama")}</div>,
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
          <span className="max-w-[500px] truncate font-medium">{row.getValue("jumlahTagihan")}</span>
        </div>
      );
    },
  },
  // {
  //   id: "actions",
  //   cell: ({ row }) => <RowAction row={row} />,
  // },
];
