import { Row } from "@tanstack/react-table";
import { DataTableRowActions } from "@client/components/table/DataTableRowActions";
import ModalDropdownItem from "@client/components/modal/ModalDropdownItem";
import { useState } from "react";
import { Button } from "@client/components/ui/button";
import { DialogClose } from "@radix-ui/react-dialog";
import { toast } from "@client/components/ui/use-toast";
import { trpc } from "@client/lib/trpc";
import { TPenagihanTable } from "./data/schema";
import { CreatePembayaran } from "../pembayaranForm/CreatePembayaranForm";

interface RowActionsProps<TData> {
  row: Row<TData>;
}

export function RowAction({ row }: RowActionsProps<TPenagihanTable>) {
  const [openEdit, setOpenEdit] = useState(false);

  const deleteInvoiceMutation = trpc.invoice.deleteInvoice.useMutation();

  const utils = trpc.useContext();

  const handleDelete = async (id: string) => {
    const res = await deleteInvoiceMutation.mutateAsync(id);

    if (res.status) {
      toast({
        description: "Success delete item",
      });
      utils.invoice.invalidate();
    } else {
      toast({
        description: res.message ?? "Failed delete message",
      });
    }
  };

  return (
    <>
      <DataTableRowActions>
        <ModalDropdownItem triggerChildren="Input Pembayaran" open={openEdit} onOpenChange={setOpenEdit}>
          <CreatePembayaran setOpen={setOpenEdit} row={row} />
          {/* <UpdateInvoiceForm setOpen={setOpenEdit} row={row} /> */}
        </ModalDropdownItem>
        <ModalDropdownItem triggerChildren="Delete">
          <p>Are you sure want to delete this item ?</p>
          <div className="flex gap-4">
            <DialogClose>
              <Button>No</Button>
            </DialogClose>
            {/* <DialogClose onClick={() => handleDelete(row.original.id)}> */}
            {/*   <Button>Yes</Button> */}
            {/* </DialogClose> */}
          </div>
        </ModalDropdownItem>
      </DataTableRowActions>
    </>
  );
}
