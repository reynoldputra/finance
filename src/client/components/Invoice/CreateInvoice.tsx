import { useState } from "react";
import Modal from "../modal/Modal";
import { CreateInvoiceForm } from "./invoiceForm/CreateInvoiceForm";

export default function CreateInvoice() {
  const [open, setOpen] = useState(false)
  return (
    <Modal open={open} onOpenChange={setOpen} buttonTitle="New Invoice">
      <CreateInvoiceForm setOpen={setOpen} />
    </Modal>
  );
}
