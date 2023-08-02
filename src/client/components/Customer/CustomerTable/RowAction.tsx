import {
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from "@client/components/ui/dropdown-menu";
import { Row } from "@tanstack/react-table";
import { DataTableRowActions } from "@client/components/table/DataTableRowActions";
import { ICustomerTable } from "../../../../server/types/customer";
import { trpc } from "@client/lib/trpc";
import { useToast } from "@client/components/ui/use-toast";
import ModalDropdownItem from "@client/components/modal/ModalDropdownItem";
import { Button } from "@client/components/ui/button";
import * as Dialog from "@radix-ui/react-dialog";
import EditCustomerForm from "../customerForm/EditCustomerForm";

interface RowActionsProps<TData> {
  row: Row<TData>;
}

export function RowAction({ row }: RowActionsProps<ICustomerTable>) {
  const { toast } = useToast();
  const utils = trpc.useContext();

  const deleteCustomerMutation = trpc.customer.deleteCustomer.useMutation({
    onSuccess: () => {
      utils.customer.invalidate();
    },
  });

  async function handleDelete() {
    try {
      const { data } = await deleteCustomerMutation.mutateAsync(
        row.original.id
      );
      if (data) {
        toast({
          description: `Customer ${data.nama} successfully deleted`,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <DataTableRowActions>
      <ModalDropdownItem triggerChildren="Edit">
        <EditCustomerForm customerData={row.original} />
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
        Copy Customer ID
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={handleDelete}>
        Delete
        <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
      </DropdownMenuItem> */}
    </DataTableRowActions>
  );
}
