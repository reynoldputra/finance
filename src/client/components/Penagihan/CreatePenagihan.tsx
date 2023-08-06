import { useState } from "react";
import Modal from "../modal/Modal";
import { CreatePenagihanForm } from "./penagihanForm/CreatePenagihanForm";

export default function CreatePenagihan() {
  const [open, setOpen] = useState(false)

  return (
    <Modal open={open} onOpenChange={setOpen} buttonTitle="New Penagihan">
      <CreatePenagihanForm setOpen={setOpen} />
    </Modal>
  );
}
