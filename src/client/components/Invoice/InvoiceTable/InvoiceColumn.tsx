import { DataTableColumnHeader } from "@client/components/table/DataTableColumnHeader";
import { Checkbox } from "@client/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { TInvoiceSchema } from "./data/schema";
import { RowAction } from "./RowAction";
import { idr } from "@client/lib/idr";
import { dateBetweenFilterFn, DatePickerWithRangeFilter } from "@client/components/table/DateFilter";
import { dmyDate } from "@client/lib/dmyDate";

export const InvoiceColumn: ColumnDef<TInvoiceSchema>[] = [
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
    id: "Id Transaksi",
    header: ({ column, table }) => (
      <>
        <DataTableColumnHeader
          table={table}
          column={column}
          title="Id Transaksi"
        />
      </>
    ),
    cell: ({ row }) => (
      <div className="w-[180px]">{row.getValue("Id Transaksi")}</div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
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
    filterFn : dateBetweenFilterFn,
    cell: ({ row }) => (
      <div className="w-[180px]">
        {dmyDate(new Date(row.getValue("Tanggal Transaksi")))}
      </div>
    ),
  },
  {
    accessorKey: "namaSales",
    id: "Nama Sales",
    header: ({ column, table }) => (
      <DataTableColumnHeader table={table} column={column} title="Nama Sales" />
    ),
    cell: ({ row }) => (
      <div className="w-[180px]">{row.getValue("Nama Sales")}</div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "total",
    id: "Total Tagihan",
    header: ({ column, table }) => (
      <DataTableColumnHeader
        table={table}
        column={column}
        title="Total Tagihan"
      />
    ),
    cell: ({ row }) => (
      <div className="w-[180px]">Rp {idr(row.getValue("Total Tagihan"))}</div>
    ),
  },
  {
    accessorKey: "sisa",
    id: "Sisa",
    header: ({ column, table }) => (
      <DataTableColumnHeader table={table} column={column} title="Sisa" />
    ),
    cell: ({ row }) => (
      <div className="w-[180px]">Rp {idr(parseInt(row.getValue("Sisa")))}</div>
    ),
  },
  {
    accessorKey: "status",
    id: "Status",
    header: ({ column, table }) => (
      <DataTableColumnHeader table={table} column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <div className="w-[180px]">{row.getValue("Status")}</div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <RowAction row={row} />,
  },
];
