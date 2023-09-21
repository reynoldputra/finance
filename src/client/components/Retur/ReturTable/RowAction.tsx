import { Row } from "@tanstack/react-table";
import { DataTableRowActions } from "@client/components/table/DataTableRowActions";
import ModalDropdownItem from "@client/components/modal/ModalDropdownItem";
import { useState } from "react";
import { toast } from "@client/components/ui/use-toast";
import { trpc } from "@client/lib/trpc";
import { TReturSchema } from "./data/schema";
import ConfirmDeleteForm from "@client/components/form/ConfirmDeleteForm";
import { UpdateReturForm } from "../returForm/UpdateReturForm";
import DetailRetur from "./DetailRetur";

interface RowActionsProps<TData> {
  row: Row<TData>;
}

export function RowAction({ row }: RowActionsProps<TReturSchema>) {
  const [openEdit, setOpenEdit] = useState(false);

  const deleteReturMutation = trpc.retur.deleteRetur.useMutation();
  const utils = trpc.useContext();

  const handleDelete = async () => {
    const res = await deleteReturMutation.mutateAsync(row.original.id);
    if (res.status) {
      toast({
        description: "Success delete item",
        variant: "success",
        className: "text-white text-base font-semibold",
      });
      utils.retur.invalidate();
    } else {
      toast({
        description: `Failed to delete retur, please try again`,
        variant: "destructive",
        className: "text-white text-base font-semibold",
      });
    }
  };

  return (
    <>
      <DataTableRowActions>
        <ModalDropdownItem triggerChildren="Detail">
          <DetailRetur invoice={row.original.invoice} />
        </ModalDropdownItem>
        <ModalDropdownItem
          triggerChildren="Edit"
          open={openEdit}
          onOpenChange={setOpenEdit}
        >
          <UpdateReturForm setOpen={setOpenEdit} row={row} />
        </ModalDropdownItem>
        <ModalDropdownItem triggerChildren="Delete">
          <div className="flex flex-col w-full h-full">
            <div className="flex flex-col">
              <span className="font-bold text-xl">Are you sure ?</span>
              <span className=" text-base mt-3">
                This action
                <span className="text-base font-semibold"> CANNOT</span> be
                undone. This will permanently delete the
                <span className="font-semibold">
                  {" "}
                  "{row.original.noRetur}"{" "}
                </span>
                Retur.
              </span>
            </div>
            <div className="flex flex-col text-lg mt-2">
              <span className=" text-base font-semibold">
                Please type Retur's ID Transaksi "{row.original.noRetur}" to
                confirm the delete.
              </span>
              <ConfirmDeleteForm
                handleDelete={handleDelete}
                currName={row.original.noRetur}
              />
            </div>
          </div>
        </ModalDropdownItem>
      </DataTableRowActions>
    </>
  );
}
