import { Table } from "@tanstack/react-table";
import { ReactNode } from "react";
import { DataTableViewOptions } from "./DataTableViewOptions";

interface DataTableToolbarProps<TData> {
  children: ReactNode;
  table: Table<TData>;
}

export function DataTableToolbar<TData>({ children, table }: DataTableToolbarProps<TData>) {

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">{children}</div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
