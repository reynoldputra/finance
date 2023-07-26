import { ColumnDef, flexRender, Table as TableType } from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@client/components/ui/table";

import { DataTablePagination } from "./DataTablePagination";
import { ReactTableProvider } from "@client/provider/ReactTableProvider";
import { Button } from "@client/components/ui/button";
import { Cross2Icon } from "@radix-ui/react-icons";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  table: TableType<TData>;
}

export function DataTable<TData, TValue>({ columns, table }: DataTableProps<TData, TValue>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const isSorted = table.getState().sorting.length > 0;
  return (
    <ReactTableProvider table={table}>
      <div className="space-y-4 p-8">
        <div className="rounded-md border">
          <div className="px-4 py-2 flex justify-end">
            {isSorted && (
              <Button
                variant="ghost"
                onClick={() => table.resetSorting()}
                className="h-8 px-2 lg:px-3 bg-slate-100"
              >
                Reset Sort
                <Cross2Icon className="ml-2 h-4 w-4" />
              </Button>
            )}
            {isFiltered && (
              <Button
                variant="ghost"
                onClick={() => table.resetColumnFilters()}
                className="h-8 px-2 lg:px-3 bg-slate-100"
              >
                Reset Filter
                <Cross2Icon className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <DataTablePagination table={table} />
      </div>
    </ReactTableProvider>
  );
}
