import {
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from "@client/components/ui/dropdown-menu";
import { Row } from "@tanstack/react-table";
import { DataTableRowActions } from "@client/components/table/DataTableRowActions";
import { TKolektorTable } from "../../../../server/collections/kolektor/kolektorSchema";
import { trpc } from "@client/lib/trpc";

interface RowActionsProps<TData> {
  row: Row<TData>;
}

export function RowAction({ row }: RowActionsProps<TKolektorTable>) {
  const deleteKolektorMutation = trpc.kolektor.deleteKolektor.useMutation();
  async function handleDelete() {
    try {
      const { data } = await deleteKolektorMutation.mutateAsync(
        row.original.id
      );
      if (data) {
        console.log("Kolektor berhasil dihapus:", data);
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <DataTableRowActions>
      <DropdownMenuItem>Edit</DropdownMenuItem>
      <DropdownMenuItem
        onClick={() => navigator.clipboard.writeText(row.original.id)}
      >
        Copy Kolektor ID
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={handleDelete}>
        Delete
        <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
      </DropdownMenuItem>
    </DataTableRowActions>
  );
}
