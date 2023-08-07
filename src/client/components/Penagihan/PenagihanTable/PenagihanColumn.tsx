import { DataTableColumnHeader } from "@client/components/table/DataTableColumnHeader";
import { Checkbox } from "@client/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { TPenagihanTable } from "./data/schema";
import { idr } from "@client/lib/idr";
import { RowAction } from "./RowAction";

export const PenagihanColumn : ColumnDef<TPenagihanTable>[] = [
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
    accessorKey: "transaksiId",
    id : "Id Transaksi",
    header: ({ column, table }) => <DataTableColumnHeader table={table} column={column} title="Id Transaksi" />,
    cell: ({ row }) => <div className="w-[180px]">{row.getValue("Id Transaksi")}</div>,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },

  },
  {
    accessorKey: "namaKolektor",
    id : "Nama Kolektor",
    header: ({ column, table }) => <DataTableColumnHeader table={table} column={column} title="Nama Kolektor" />,
    cell: ({ row }) => <div className="w-[180px]">{row.getValue("Nama Kolektor")}</div>,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },

  },
  {
    accessorKey: "tanggalTagihan",
    id : "Tanggal Tagihan",
    header: ({ column, table }) => <DataTableColumnHeader table={table} column={column} title="Tanggal Tagihan" />,
    cell: ({ row }) => <div className="w-[180px]">{(new Date(row.getValue("Tanggal Tagihan"))).toLocaleDateString()}</div>,
  },
  {
    accessorKey: "namaCustomer",
    id : "Nama Customer",
    header: ({ column, table }) => <DataTableColumnHeader table={table} column={column} title="Nama Customer" />,
    cell: ({ row }) => <div className="w-[180px]">{row.getValue("Nama Customer")}</div>,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },

  },
  {
    accessorKey: "status",
    id : "Status",
    header: ({ column, table }) => <DataTableColumnHeader table={table} column={column} title="Status" />,
    cell: ({ row }) => <div className="w-[180px]">{row.getValue("Status")}</div>,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "sisa",
    id : "sisa",
    header: ({ column, table }) => <DataTableColumnHeader table={table} column={column} title="Sisa" />,
    cell: ({ row }) => <div className="w-[180px]">{idr(row.getValue("sisa"))}</div>,
  },
  // {
  //   id : "Pembayaran",
  //   header: () => <p className="font-bold text-black">Pembayaran</p>,
  //   cell: ({ row }) => (
  //     <div className="w-[180px]">
  //       {row.original.cash ? `${row.original.cash} Cash` : ""}
  //       {row.original.giro ? ` ${row.original.giro} Giro` : ""}
  //       {row.original.transfer ? ` ${row.original.transfer} Transfer` : ""}
  //     </div>
  //   ),
  // },
  {
    id: "actions",
    cell: ({ row }) => <RowAction row={row} />,
  },
]
