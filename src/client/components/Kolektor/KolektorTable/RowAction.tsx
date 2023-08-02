import {
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from "@client/components/ui/dropdown-menu";
import * as Dialog from "@radix-ui/react-dialog";
import { Row } from "@tanstack/react-table";
import { DataTableRowActions } from "@client/components/table/DataTableRowActions";
import { TKolektorTable } from "../../../../server/collections/kolektor/kolektorSchema";
import { trpc } from "@client/lib/trpc";
import { useToast } from "@client/components/ui/use-toast";
import ModalDropdownItem from "@client/components/modal/ModalDropdownItem";
import { Button } from "@client/components/ui/button";
import EditKolektorForm from "../KolektorForm/EditKolektorForm";

interface RowActionsProps<TData> {
  row: Row<TData>;
}

export function RowAction({ row }: RowActionsProps<TKolektorTable>) {
  const { toast } = useToast();
  const utils = trpc.useContext();

  const deleteKolektorMutation = trpc.kolektor.deleteKolektor.useMutation({
    onSuccess: () => {
      utils.kolektor.invalidate();
    },
  });

  async function handleDelete() {
    try {
      const { data } = await deleteKolektorMutation.mutateAsync(
        row.original.id
      );
      if (data) {
        toast({
          description: `Kolektor ${data.nama} successfully deleted`,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <DataTableRowActions>
      <ModalDropdownItem triggerChildren="Edit">
        <EditKolektorForm kolektorData={row.original} />
      </ModalDropdownItem>
      <ModalDropdownItem triggerChildren="Delete">
        <Dialog.Close>
          <Button>Cancel</Button>
        </Dialog.Close>
        <Dialog.Close>
          <Button onClick={handleDelete}>Delete</Button>
        </Dialog.Close>
      </ModalDropdownItem>
      {/* <DropdownMenuItem>Edit</DropdownMenuItem>
      <DropdownMenuItem
        onClick={() => navigator.clipboard.writeText(row.original.id)}
      >
        Copy Kolektor ID
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={handleDelete}>
        Delete
        <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
      </DropdownMenuItem> */}
    </DataTableRowActions>
  );
}
