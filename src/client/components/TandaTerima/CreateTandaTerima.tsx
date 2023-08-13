import { useState } from "react";
import Modal from "../modal/Modal";
import CreateTandaTerimaForm from "./tandaTerimaForm/CreateTandaTerimaForm";

export default function CreateTandaTerima() {
  const [open, setOpen] = useState(false)

  return (
    <Modal open={open} onOpenChange={setOpen} buttonTitle="New Tanda Terima">
      <CreateTandaTerimaForm setOpen={setOpen} />
    </Modal>
  );
}
