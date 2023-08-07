import { Row } from "@tanstack/react-table";
import { DataTableRowActions } from "@client/components/table/DataTableRowActions";
import ModalDropdownItem from "@client/components/modal/ModalDropdownItem";
import { useState } from "react";
import { Button } from "@client/components/ui/button";
import { DialogClose } from "@radix-ui/react-dialog";
import { toast } from "@client/components/ui/use-toast";
import { trpc } from "@client/lib/trpc";
import { TPenagihanTable } from "./data/schema";
import { UpdatePenagihanForm } from "../penagihanForm/UpdatePenagihanForm";
import DetailPenagihan from "./DetailPenagihan";

interface RowActionsProps<TData> {
  row: Row<TData>;
}

export function RowAction({ row }: RowActionsProps<TPenagihanTable>) {
  const [openEdit, setOpenEdit] = useState(false);

  const deletePenagihanMutation = trpc.penagihan.deletePenagihan.useMutation();
  const utils = trpc.useContext();

  const handleDelete = async (id: string) => {
    const res = await deletePenagihanMutation.mutateAsync(id);

    if (res.status) {
      toast({
        description: "Success delete item",
      });
      utils.penagihan.invalidate();
    } else {
      toast({
        description: "Failed delete message",
      });
    }
  };

  return (
    <>
      <DataTableRowActions>
        <ModalDropdownItem triggerChildren="Edit" open={openEdit} onOpenChange={setOpenEdit}>
          <UpdatePenagihanForm setOpen={setOpenEdit} row={row} />
        </ModalDropdownItem>
        <ModalDropdownItem triggerChildren="Detail Pembayaran" modalTitle="Detail Pembayaran">
          <DetailPenagihan penagihanId={row.original.id} />
        </ModalDropdownItem>
        <ModalDropdownItem triggerChildren="Delete">
          <p>Are you sure want to delete this item ?</p>
          <div className="flex gap-4">
            <DialogClose>
              <Button>No</Button>
            </DialogClose>
            <DialogClose onClick={() => handleDelete(row.original.id)}>
              <Button>Yes</Button>
            </DialogClose>
          </div>
        </ModalDropdownItem>
      </DataTableRowActions>
    </>
  );
}
