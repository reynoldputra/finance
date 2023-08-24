import { useState } from "react";
import Modal from "../modal/Modal";
import { CreateReturForm } from "./returForm/CreateReturForm";

export default function CreateRetur() {
  const [open, setOpen] = useState(false);
  return (
    <Modal open={open} onOpenChange={setOpen} buttonTitle="New Retur">
      <CreateReturForm setOpen={setOpen} />
    </Modal>
  );
}
