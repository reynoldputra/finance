import { ColumnDef } from "@tanstack/react-table";
import { TReturSchema } from "./data/schema";
import { Checkbox } from "@client/components/ui/checkbox";
import { DataTableColumnHeader } from "@client/components/table/DataTableColumnHeader";
import { dateBetweenFilterFn } from "@client/components/table/DateFilter";
import { idr } from "@client/lib/idr";
import { dmyDate } from "@client/lib/dmyDate";
import { RowAction } from "./RowAction";

export const ReturColumn: ColumnDef<TReturSchema>[] = [
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
    accessorKey: "noRetur",
    id: "No Retur",
    header: ({ column, table }) => (
      <>
        <DataTableColumnHeader table={table} column={column} title="No Retur" />
      </>
    ),
    cell: ({ row }) => (
      <div className="w-[180px]">{row.getValue("No Retur")}</div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "customerName",
    id: "Customer Name",
    header: ({ column, table }) => (
      <>
        <DataTableColumnHeader
          table={table}
          column={column}
          title="Customer Name"
        />
      </>
    ),
    cell: ({ row }) => (
      <div className="w-[180px]">{row.getValue("Customer Name")}</div>
    ),
  },
  {
    accessorKey: "banyakInvoice",
    id: "Banyak Invoice",
    header: ({ column, table }) => (
      <>
        <DataTableColumnHeader
          table={table}
          column={column}
          title="Banyak Invoice"
        />
      </>
    ),
    cell: ({ row }) => (
      <div className="w-[180px]">{row.original.invoice.length}</div>
    )
  },
  {
    accessorKey: "tanggalTransaksi",
    id: "Tanggal Transaksi",
    header: ({ column, table }) => (
      <>
        <DataTableColumnHeader
          table={table}
          column={column}
          title="Tanggal Transaksi"
        />
      </>
    ),
    filterFn: dateBetweenFilterFn,
    cell: ({ row }) => (
      <div className="w-[180px]">
        {dmyDate(new Date(row.getValue("Tanggal Transaksi")))}
      </div>
    ),
  },
  {
    accessorKey: "total",
    id: "Total Retur",
    header: ({ column, table }) => (
      <DataTableColumnHeader
        table={table}
        column={column}
        title="Total Retur"
      />
    ),
    cell: ({ row }) => (
      <div className="w-[180px]">Rp {idr(row.getValue("Total Retur"))}</div>
    ),
  },
  {
    accessorKey: "type",
    id: "Tipe",
    header: ({ column, table }) => (
      <DataTableColumnHeader table={table} column={column} title="Tipe" />
    ),
    cell: ({ row }) => <div className="w-[180px]">{row.getValue("Tipe")}</div>,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <RowAction row={row} />,
  },
];
