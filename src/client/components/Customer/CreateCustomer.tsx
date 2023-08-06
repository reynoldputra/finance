import { useState } from "react";
import Modal from "../modal/Modal";
import CreateCustomerForm from "./CustomerForm/CreateCustomerForm";

export default function CreateCustomer() {
  const [open, setOpen] = useState(false);
  return (
    <Modal open={open} onOpenChange={setOpen} buttonTitle="New Customer">
      <CreateCustomerForm setOpen={setOpen} />
    </Modal>
  );
}
