import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@client/components/ui/dialog";

import { Button } from "@client/components/ui/button";
import { ReactNode } from "react";

type ButtonVariant = "outline" | "link" | "default" | "destructive" | "secondary" | "ghost";

interface IModalsProps {
  buttonTitle: string;
  buttonVariant?: ButtonVariant;
  modalTitle?: string;
  description?: string;
  children : ReactNode
}

export default function Modal({
  buttonTitle,
  buttonVariant = "outline",
  modalTitle,
  description,
  children
}: IModalsProps ) {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant={buttonVariant}>{buttonTitle}</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            {modalTitle && <DialogTitle>{modalTitle}</DialogTitle>}
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
    </>
  );
}
