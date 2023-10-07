import { Row } from "@tanstack/react-table";
import { DataTableRowActions } from "@client/components/table/DataTableRowActions";
import { TInvoiceSchema } from "./data/schema";
import ModalDropdownItem from "@client/components/modal/ModalDropdownItem";
import { UpdateInvoiceForm } from "../invoiceForm/UpdateInvoiceForm";
import { useState } from "react";
import { toast } from "@client/components/ui/use-toast";
import { trpc } from "@client/lib/trpc";
import ConfirmDeleteForm from "@client/components/form/ConfirmDeleteForm";
import { Button } from "@client/components/ui/button";

interface RowActionsProps<TData> {
  row: Row<TData>;
}

export function RowAction({ row }: RowActionsProps<TInvoiceSchema>) {
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const handleCloseDelete = () => {
    setOpenDelete(!openDelete);
  };

  const deleteInvoiceMutation = trpc.invoice.deleteInvoice.useMutation();

  const utils = trpc.useContext();

  const handleDelete = async () => {
    const res = await deleteInvoiceMutation.mutateAsync(row.original.id);

    if (res.status) {
      toast({
        description: "Success delete item",
        variant: "success",
        className: "text-white text-base font-semibold",
      });
      handleCloseDelete();
      utils.invoice.invalidate();
    } else {
      toast({
        description: `Failed to delete invoice, please try again`,
        variant: "destructive",
        className: "text-white text-base font-semibold",
      });
    }
  };

  return (
    <>
      <DataTableRowActions>
        <ModalDropdownItem
          triggerChildren="Edit"
          open={openEdit}
          onOpenChange={setOpenEdit}
        >
          <UpdateInvoiceForm setOpen={setOpenEdit} row={row} />
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
                <span className="font-semibold"> "{row.original.transaksiId}" </span>
                Invoice.
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
