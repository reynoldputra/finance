import { Row } from "@tanstack/react-table";
import { DataTableRowActions } from "@client/components/table/DataTableRowActions";
import { useState } from "react";
import { toast } from "@client/components/ui/use-toast";
import { trpc } from "@client/lib/trpc";
import { TPembayaranSchema } from "./data/schema";
import ConfirmDeleteForm from "@client/components/form/ConfirmDeleteForm";
import DetailDistribusi from "./DetailDistribusi";
import { UpdatePembayaranForm } from "../PembayaranForm/UpdatePembayaranForm";
import ModalDropdownItem from "@client/components/modal/ModalDropdownItem";

interface RowActionsProps<TData> {
  row: Row<TData>;
}

export function RowAction({ row }: RowActionsProps<TPembayaranSchema>) {
  const [openEdit, setOpenEdit] = useState(false);

  const deleteCarabayarMutation = trpc.carabayar.deleteCarabayar.useMutation();

  const utils = trpc.useContext();

  const handleDelete = async () => {
    const res = await deleteCarabayarMutation.mutateAsync(row.original.id);

    if (res.status) {
      toast({
        description: "Success delete item",
        variant: "success",
        className: "text-white text-base font-semibold",
      });
      utils.carabayar.invalidate();
    } else {
      toast({
        description: `Failed to delete pembayaran, please try again`,
        variant: "destructive",
        className: "text-white text-base font-semibold",
      });
    }
  };

  return (
    <>
      <DataTableRowActions>
        <ModalDropdownItem triggerChildren="Detail Distribusi" modalTitle="Detail Distribusi">
            <DetailDistribusi row={row} />
        </ModalDropdownItem>
        <ModalDropdownItem triggerChildren="Edit" open={openEdit} onOpenChange={setOpenEdit}>
          <UpdatePembayaranForm carabayarId={row.original.id} setOpen={setOpenEdit} />
        </ModalDropdownItem>
        <ModalDropdownItem triggerChildren="Delete">
          <div className="flex flex-col w-full h-full">
            <div className="flex flex-col">
              <span className="font-bold text-xl">Are you sure ?</span>
              <span className=" text-base mt-3">
                This action
                <span className="text-base font-semibold"> CANNOT</span> be undone. This will
                permanently delete the
                <span className="font-semibold"> "{row.original.id}" </span>
                pembayaran.
              </span>
            </div>
            <div className="flex flex-col text-lg mt-2">
              <span className=" text-base font-semibold">
                Please type pembayaran's id "{row.original.id}" to confirm the delete.
              </span>
              <ConfirmDeleteForm handleDelete={handleDelete} currName={row.original.id} />
            </div>
          </div>
        </ModalDropdownItem>
      </DataTableRowActions>
    </>
  );
}
