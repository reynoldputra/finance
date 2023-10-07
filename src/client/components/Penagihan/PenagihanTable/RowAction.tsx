import { Row } from "@tanstack/react-table";
import { DataTableRowActions } from "@client/components/table/DataTableRowActions";
import ModalDropdownItem from "@client/components/modal/ModalDropdownItem";
import { useState } from "react";
import { toast } from "@client/components/ui/use-toast";
import { trpc } from "@client/lib/trpc";
import { TPenagihanTable } from "./data/schema";
import { UpdatePenagihanForm } from "../penagihanForm/UpdatePenagihanForm";
import ConfirmDeleteForm from "@client/components/form/ConfirmDeleteForm";
import DetailPenagihan from "./DetailPenagihan";
import { Button } from "@client/components/ui/button";

interface RowActionsProps<TData> {
  row: Row<TData>;
}

export function RowAction({ row }: RowActionsProps<TPenagihanTable>) {
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const handleCloseDelete = () => {
    setOpenDelete(!openDelete);
  };

  const handleCloseEdit = () => {
    setOpenEdit(!openEdit);
  };

  const deletePenagihanMutation = trpc.penagihan.deletePenagihan.useMutation();
  const utils = trpc.useContext();

  const handleDelete = async () => {
    const res = await deletePenagihanMutation.mutateAsync(row.original.id);

    if (res.status) {
      toast({
        description: "Success delete item",
        variant: "success",
        className: "text-white text-base font-semibold",
      });
      utils.penagihan.invalidate();
      handleCloseDelete();
    } else {
      toast({
        description: "Failed to delete penagihan, please try again",
        variant: "destructive",
        className: "text-white text-base font-semibold",
      });
    }
  };

  const updateStatusToNihilMutation =
    trpc.penagihan.updateStatusToNihil.useMutation();

  const handleUpdateStatus = async () => {
    const res = await updateStatusToNihilMutation.mutateAsync(row.original.id);
    if (res.status) {
      toast({
        description: `Success update ${row.original.transaksiId} to NIHIL`,
        variant: "success",
        className: "text-white text-base font-semibold",
      });
      utils.penagihan.invalidate();
    } else {
      toast({
        description: "Failed to update penagihan, please try again",
        variant: "destructive",
        className: "text-white text-base font-semibold",
      });
    }
  };

  return (
    <>
      <DataTableRowActions>
        {row.original.status === "WAITING" && (
          <ModalDropdownItem triggerChildren="Change to NIHIL">
            <div className="flex flex-col w-full h-full">
              <div className="flex flex-col">
                <span className="font-bold text-xl">Are you sure ?</span>
                <span className=" text-base mt-3">
                  This action
                  <span className="text-base font-semibold"> CANNOT</span> be
                  undone. This will permanently change status
                  <span className="font-semibold">
                    {" "}
                    "{row.original.transaksiId}"{" "}
                  </span>
                  Penagihan to NIHIL.
                </span>
              </div>
              <div className="flex text-lg gap-x-3 mt-2">
                <Button
                  variant={"outline"}
                  className="text-base font-semibold px-10"
                >
                  No
                </Button>
                <Button
                  variant={"destructive"}
                  onClick={handleUpdateStatus}
                  className="text-base font-semibold px-10"
                >
                  Yes
                </Button>
              </div>
            </div>
          </ModalDropdownItem>
        )}
        <ModalDropdownItem
          triggerChildren="Edit"
          open={openEdit}
          onOpenChange={setOpenEdit}
        >
          <UpdatePenagihanForm setOpen={setOpenEdit} row={row} />
        </ModalDropdownItem>
        <ModalDropdownItem
          triggerChildren="Detail Pembayaran"
          modalTitle="Detail Pembayaran"
        >
          <DetailPenagihan penagihanId={row.original.id} />
        </ModalDropdownItem>
        <ModalDropdownItem
          open={openDelete}
          onOpenChange={setOpenDelete}
          triggerChildren="Delete"
        >
          <div className="flex flex-col w-full h-full">
            <div className="flex flex-col">
              <span className="font-bold text-xl">Are you sure ?</span>
              <span className=" text-base mt-3">
                This action
                <span className="text-base font-semibold"> CANNOT</span> be
                undone. This will permanently delete the
                <span className="font-semibold"> "{row.original.id}" </span>
                Penagihan.
              </span>
            </div>
            <div className="flex text-lg gap-x-3 mt-2">
              <Button
                variant={"outline"}
                onClick={handleCloseDelete}
                className="text-base font-semibold px-10"
              >
                No
              </Button>
              <Button
                variant={"destructive"}
                onClick={handleDelete}
                className="text-base font-semibold px-10"
              >
                Yes
              </Button>
            </div>
          </div>
        </ModalDropdownItem>
      </DataTableRowActions>
    </>
  );
}
