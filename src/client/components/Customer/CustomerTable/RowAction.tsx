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

interface RowActionsProps<TData> {
  row: Row<TData>;
}

export function RowAction({ row }: RowActionsProps<ICustomerTable>) {
  const { toast } = useToast();
  const deleteCustomerMutation = trpc.customer.deleteCustomer.useMutation();
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
      <DropdownMenuItem>Edit</DropdownMenuItem>
      <DropdownMenuItem
        onClick={() => navigator.clipboard.writeText(row.original.id)}
      >
        Copy Customer ID
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={handleDelete}>
        Delete
        <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
      </DropdownMenuItem>
    </DataTableRowActions>
  );
}
