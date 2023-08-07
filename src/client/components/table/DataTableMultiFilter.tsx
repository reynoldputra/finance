import { Table } from "@tanstack/react-table";
import { DataTableFacetedFilter } from "./DataTable/DataTableFacatedFilter";

interface DataTableMultiFilter<TData, TValue> {
  table: Table<TData>;
  options: {
    label: string;
    value: string;
  }[];
  columnId: string;
}

export default function DataTableMultiFilter<TData, TValue>({
  options,
  columnId,
  table,
}: DataTableMultiFilter<TData, TValue>) {
  return (
    <>
      {table.getColumn(`${columnId}`) && (
        <DataTableFacetedFilter
          column={table.getColumn(`${columnId}`)}
          title={columnId}
          options={options}
        />
      )}
    </>
  );
}
