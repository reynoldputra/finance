import { Row } from "@tanstack/react-table";
import { DataTableRowActions } from "@client/components/table/DataTableRowActions";
import { ICustomerTable } from "@server/types/customer";
import { trpc } from "@client/lib/trpc";
import { useToast } from "@client/components/ui/use-toast";
import ModalDropdownItem from "@client/components/modal/ModalDropdownItem";
import EditCustomerForm from "../CustomerForm/EditCustomerForm";
import ConfirmDeleteForm from "@client/components/form/ConfirmDeleteForm";
import { useState } from "react";

interface RowActionsProps<TData> {
  row: Row<TData>;
}

export function RowAction({ row }: RowActionsProps<ICustomerTable>) {
  const { toast } = useToast();
  const utils = trpc.useContext();
  const [openEdit, setOpenEdit] = useState(false);

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
          variant: "success",
          className: "text-white text-base font-semibold",
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        description: `Failed to delete customer, please try again`,
        variant: "destructive",
        className: "text-white text-base font-semibold",
      });
    }
  }
  return (
    <DataTableRowActions>
      <ModalDropdownItem
        open={openEdit}
        onOpenChange={setOpenEdit}
        triggerChildren="Edit"
      >
        <EditCustomerForm setOpen={setOpenEdit} customerData={row.original} />
      </ModalDropdownItem>
      <ModalDropdownItem triggerChildren="Delete">
        <div className="flex flex-col w-full h-full">
          <div className="flex flex-col">
            <span className="font-bold text-xl">Are you sure ?</span>
            <span className=" text-base mt-3">
              This action
              <span className="text-base font-semibold"> CANNOT</span> be
              undone. This will permanently delete the
              <span className="font-semibold"> "{row.original.nama}" </span>
              customer.
            </span>
          </div>
          <div className="flex flex-col text-lg mt-2">
            <span className=" text-base font-semibold">
              Please type Customer's name "{row.original.nama}" to confirm the
              delete.
            </span>
            <ConfirmDeleteForm
              handleDelete={handleDelete}
              currName={row.original.nama}
            />
          </div>
        </div>
      </ModalDropdownItem>
    </DataTableRowActions>
  );
}
