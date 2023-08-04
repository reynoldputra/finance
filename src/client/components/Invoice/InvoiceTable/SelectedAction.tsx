import { Table } from "@tanstack/react-table";
import { DataTableRowActions } from "@client/components/table/DataTableRowActions";
import { TInvoiceSchema } from "./data/schema";
import ModalDropdownItem from "@client/components/modal/ModalDropdownItem";
import { useState } from "react";
import { AddPenagihanForm } from "../invoiceForm/AddPenagihanForm";

interface SelectedActionProps<TData> {
  table: Table<TData>;
}

export default function SelectedAction ({table} : SelectedActionProps<TInvoiceSchema>) {
  const [openPenagihanForm, setOpenPenagihanForm] = useState(false)

  return (
      <DataTableRowActions>
        <ModalDropdownItem triggerChildren="Add Penagihan" open={openPenagihanForm} onOpenChange={setOpenPenagihanForm}>
          <div className="flex gap-4">
            <AddPenagihanForm table={table} setOpen={setOpenPenagihanForm} />
          </div>
        </ModalDropdownItem>
      </DataTableRowActions>
  )
}
