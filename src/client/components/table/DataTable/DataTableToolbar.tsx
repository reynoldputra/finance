import { Button } from "@client/components/ui/button";
import { Table } from "@tanstack/react-table";
import { DataTableViewOptions } from "./DataTableViewOptions";
import { Cross2Icon } from "@radix-ui/react-icons";
import { ReactNode } from "react";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  toolbar?: ReactNode;
}

export function DataTableToolbar<TData>({ table, toolbar }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const isSorted = table.getState().sorting.length > 0;

  return (
    <div className="flex h-full items-center justify-between">
      <div className="flex justify-end gap-4">
        {isSorted && (
          <Button
            variant="ghost"
            onClick={() => table.resetSorting()}
            className="h-8 px-2 lg:px-3 bg-red-100"
          >
            Reset Sort
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3 bg-red-100"
          >
            Reset Filter
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-4">
        {toolbar}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
