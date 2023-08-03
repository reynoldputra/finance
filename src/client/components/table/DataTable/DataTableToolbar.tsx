import { Button } from "@client/components/ui/button";
import { Table } from "@tanstack/react-table";
import { DataTableViewOptions } from "./DataTableViewOptions";
import { Cross2Icon } from "@radix-ui/react-icons";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const isSorted = table.getState().sorting.length > 0;

  return (
    <div className="flex items-center justify-between px-4 py-2 hover:bg-slate-50">
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
      <DataTableViewOptions table={table} />
    </div>
  );
}
