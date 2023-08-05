import { Table } from "@tanstack/react-table";
import { TInvoiceSchema } from "./data/schema";
import { useState } from "react";
import { AddPenagihanForm } from "../invoiceForm/AddPenagihanForm";
import Modal from "@client/components/modal/Modal";

interface SelectedActionProps<TData> {
  table: Table<TData>;
}

export default function SelectedAction({ table }: SelectedActionProps<TInvoiceSchema>) {
  const [openPenagihanForm, setOpenPenagihanForm] = useState(false);

  return (
    <>
        <Modal
          buttonTitle="Add Penagihan"
          open={openPenagihanForm}
          onOpenChange={setOpenPenagihanForm}
          buttonProps={{
            disabled : !table.getIsSomeRowsSelected()
          }}
        >
          <div className="flex gap-4">
            <AddPenagihanForm table={table} setOpen={setOpenPenagihanForm} />
          </div>
        </Modal>
    </>
  );
}
