import {
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@client/components/ui/dropdown-menu"
import { Row } from "@tanstack/react-table"
import { DataTableRowActions } from "@client/components/table/DataTableRowActions"

import { labels } from "./data/data"
import { taskSchema } from "./data/schema"

interface RowActionsProps<TData> {
  row: Row<TData>
}

export function RowAction<TData>({
  row,
}: RowActionsProps<TData>) {
  const task = taskSchema.parse(row.original)
  return (
    <DataTableRowActions>
      <DropdownMenuItem>Edit</DropdownMenuItem>
      <DropdownMenuItem>Make a copy</DropdownMenuItem>
      <DropdownMenuItem>Favorite</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>Labels</DropdownMenuSubTrigger>
        <DropdownMenuSubContent>
          <DropdownMenuRadioGroup value={task.label}>
            {labels.map((label) => (
              <DropdownMenuRadioItem key={label.value} value={label.value}>
                {label.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuSubContent>
      </DropdownMenuSub>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        Delete
        <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
      </DropdownMenuItem>
    </DataTableRowActions>
  );
}
