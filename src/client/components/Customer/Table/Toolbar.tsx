import { Button } from "@client/components/ui/button";
import { Input } from "@client/components/ui/input";
import { Cross2Icon } from "@radix-ui/react-icons";
import { DataTableFacetedFilter } from "@client/components/table/DataTable/data-table-faceted-filter";
import { priorities, statuses } from "./data/data";
import { Table } from "@tanstack/react-table";

interface ToolbarProps<TData> {
  table: Table<TData>;
}

export default function Toolbar<TData>({ table }: ToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <>
      <Input
        placeholder="Filter tasks..."
        value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
        onChange={(event) => {
          table.getColumn("title")?.setFilterValue(event.target.value);
        }}
        className="h-8 w-[150px] lg:w-[250px]"
      />
      {table.getColumn("status") && (
        <DataTableFacetedFilter
          column={table.getColumn("status")}
          title="Status"
          options={statuses}
        />
      )}
      {table.getColumn("priority") && (
        <DataTableFacetedFilter
          column={table.getColumn("priority")}
          title="Priority"
          options={priorities}
        />
      )}
      {isFiltered && (
        <Button
          variant="ghost"
          onClick={() => table.resetColumnFilters()}
          className="h-8 px-2 lg:px-3"
        >
          Reset
          <Cross2Icon className="ml-2 h-4 w-4" />
        </Button>
      )}
    </>
  );
}
