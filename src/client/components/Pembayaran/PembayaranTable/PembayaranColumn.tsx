import { DataTableColumnHeader } from "@client/components/table/DataTableColumnHeader";
import { ColumnDef } from "@tanstack/react-table";
import { TPembayaranSchema } from "./data/schema";
import { RowAction } from "./RowAction";
import { idr } from "@client/lib/idr";

export const pembayaranColumn : ColumnDef<TPembayaranSchema>[] = [
  {
    accessorKey: "id",
    id : "Kode Pembayaran",
    header: ({ column, table }) => <DataTableColumnHeader table={table} column={column} title="Kode Pembayaran" />,
    cell: ({ row }) => <div className="w-[180px]">{row.getValue("Kode Pembayaran")}</div>,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "namaCustomer",
    id : "Nama Customer",
    header: ({ column, table }) => <DataTableColumnHeader table={table} column={column} title="Customer" />,
    cell: ({ row }) => <div className="w-[180px]">{row.getValue("Nama Customer")}</div>,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "metodePembayaran",
    id : "Metode",
    header: ({ column, table }) => <DataTableColumnHeader table={table} column={column} title="Metode" />,
    cell: ({ row }) => <div className="w-[180px]">{row.getValue("Metode")}</div>,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "tanggalPembayaran",
    id : "Tanggal",
    header: ({ column, table }) => <DataTableColumnHeader table={table} column={column} title="Tanggal" />,
    cell: ({ row }) => {
      const date = new Date(row.getValue("Tanggal"))
      const d = date.getDate()
      const m = date.getMonth() + 1
      const y = date.getFullYear()
      return <div className="w-[180px]">{`${d}-${m}-${y}`}</div>
    },
  },
  {
    accessorKey: "total",
    id : "Total",
    header: ({ column, table }) => <DataTableColumnHeader table={table} column={column} title="Total" />,
    cell: ({ row }) => <div className="w-[180px]">Rp {idr(row.getValue("Total"))}</div>,
  },
  {
    accessorKey: "jumlahDistribusi",
    id : "Distribusi",
    header: ({ column, table }) => <DataTableColumnHeader table={table} column={column} title="Distribusi (invoice)" />,
    cell: ({ row }) => <div className="w-[180px]">{(row.getValue("Distribusi"))}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => <RowAction row={row} />,
  },
]
