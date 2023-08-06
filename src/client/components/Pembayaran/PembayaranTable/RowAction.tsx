import { Row } from "@tanstack/react-table";
import { DataTableRowActions } from "@client/components/table/DataTableRowActions";
import ModalDropdownItem from "@client/components/modal/ModalDropdownItem";
import { useState } from "react";
import { Button } from "@client/components/ui/button";
import { DialogClose } from "@radix-ui/react-dialog";
import { toast } from "@client/components/ui/use-toast";
import { trpc } from "@client/lib/trpc";
import { TPembayaranSchema } from "./data/schema";
import DetailDistribusi from "./DetailDistribusi";

interface RowActionsProps<TData> {
  row: Row<TData>;
}

export function RowAction({ row }: RowActionsProps<TPembayaranSchema>) {
  const [openEdit, setOpenEdit] = useState(false);

  const deleteCarabayarMutation = trpc.carabayar.deleteCarabayar.useMutation();

  const utils = trpc.useContext();

  const handleDelete = async (id: string) => {
    const res = await deleteCarabayarMutation.mutateAsync(id);

    if (res.status) {
      toast({
        description: "Success delete item",
      });
      utils.carabayar.invalidate();
    } else {
      toast({
        description: "Failed delete message",
      });
    }
  };

  return (
    <>
      <DataTableRowActions>
        <ModalDropdownItem triggerChildren="Detail Distribusi" modalTitle="Detail Distribusi">
          <div>
            <DetailDistribusi row={row} />
            <DialogClose>
              <Button>Close</Button>
            </DialogClose>
          </div>
        </ModalDropdownItem>
        <ModalDropdownItem triggerChildren="Edit" open={openEdit} onOpenChange={setOpenEdit}>
          {/* <UpdateInvoiceForm setOpen={setOpenEdit} row={row} /> */}
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
