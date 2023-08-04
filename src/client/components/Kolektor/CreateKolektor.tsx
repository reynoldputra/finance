import { useState } from "react";
import Modal from "../modal/Modal";
import { CreateKolektorForm } from "./KolektorForm/CreateKolektorForm";

export default function CreateKolektor() {
  const [open, setOpen] = useState(false)
  return (
    <Modal open={open} onOpenChange={setOpen} buttonTitle="New Kolektor">
      <CreateKolektorForm setOpen={setOpen} />
    </Modal>
  );
}