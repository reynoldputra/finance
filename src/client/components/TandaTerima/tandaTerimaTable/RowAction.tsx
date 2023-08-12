import { TTandaTerimaTable } from "./data/schema";
import { Row } from "@tanstack/react-table";
import { DataTableRowActions } from "@client/components/table/DataTableRowActions";
import ModalDropdownItem from "@client/components/modal/ModalDropdownItem";
import DetailTandaTerima from "./DetailTandaTerima";
import ConfirmDeleteForm from "@client/components/form/ConfirmDeleteForm";
import { trpc } from "@client/lib/trpc";
import { useToast } from "@client/components/ui/use-toast";
import { useState } from "react";
import UpdateTandaTerimaForm from "../tandaTerimaForm/UpdateTandaTerimaForm";

interface RowActionsProps<TData> {
  row: Row<TData>;
}

export function RowAction({ row }: RowActionsProps<TTandaTerimaTable>) {
  const [openEdit, setOpenEdit] = useState(false);
  const { toast } = useToast();
  const utils = trpc.useContext();

  const deleteTandaTerimaMutation =
    trpc.tandaTerima.deleteTandaTerima.useMutation();

  const handleDelete = async () => {
    try {
      const { data, status } = await deleteTandaTerimaMutation.mutateAsync(
        row.original.id
      );
      if (data && status) {
        toast({
          description: "Tanda Terima successfully deleted",
          variant: "success",
          className: "text-white text-base font-semibold",
        });
        utils.tandaTerima.invalidate();
      }
    } catch (err) {
      toast({
        description: `Failed to delete customer, please try again err : ${err}`,
        variant: "destructive",
        className: "text-white text-base font-semibold",
      });
    }
  };

  return (
    <>
      <DataTableRowActions>
        <ModalDropdownItem
          triggerChildren="Detail Tanda Terima"
          modalTitle="Detail Tanda Terima"
        >
          <DetailTandaTerima row={row} id={row.original.id} />
        </ModalDropdownItem>
        <ModalDropdownItem
          open={openEdit}
          onOpenChange={setOpenEdit}
          triggerChildren="Edit"
        >
          <UpdateTandaTerimaForm setOpen={setOpenEdit} row={row} />
        </ModalDropdownItem>
        <ModalDropdownItem triggerChildren="Delete">
          <div className="flex flex-col w-full h-full">
            <div className="flex flex-col">
              <span className="font-bold text-xl">Are you sure ?</span>
              <span className=" text-base mt-3">
                This action
                <span className="text-base font-semibold"> CANNOT</span> be
                undone. This will permanently delete the
                <span className="font-semibold"> "{row.original.id}" </span>
                Tanda Terima.
              </span>
            </div>
            <div className="flex flex-col text-lg mt-2">
              <span className=" text-base font-semibold">
                Please type Tanda Terima's id "{row.original.id}" to confirm the
                delete.
              </span>
              <ConfirmDeleteForm
                handleDelete={handleDelete}
                currName={row.original.id}
              />
            </div>
          </div>
        </ModalDropdownItem>
      </DataTableRowActions>
    </>
  );
}
