import {
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
  } from "@client/components/ui/dropdown-menu"
  import { Row } from "@tanstack/react-table"
  import { DataTableRowActions } from "@client/components/table/DataTableRowActions"
  
  interface RowActionsProps<TData> {
    row: Row<TData>
  }
  
  export function RowAction<TData>({
    row,
  }: RowActionsProps<TData>) {
    return (
      <DataTableRowActions>
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          Delete
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DataTableRowActions>
    );
  }
  