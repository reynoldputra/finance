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
import { DialogProps } from "@radix-ui/react-dialog";

type ButtonVariant =
  | "outline"
  | "link"
  | "default"
  | "destructive"
  | "secondary"
  | "ghost";

interface IModalsProps extends DialogProps {
  buttonTitle: string;
  buttonVariant?: ButtonVariant;
  modalTitle?: string;
  description?: string;
  children: ReactNode;
  buttonProps ?: React.ButtonHTMLAttributes<HTMLButtonElement>
}

export default function Modal({
  buttonTitle,
  buttonVariant = "outline",
  modalTitle,
  description,
  children,
  buttonProps,
  ...rest
}: IModalsProps) {
  return (
    <>
      <Dialog {...rest}>
        <DialogTrigger asChild>
          <Button {...buttonProps} variant={buttonVariant}>{buttonTitle}</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            {modalTitle && <DialogTitle>{modalTitle}</DialogTitle>}
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
          <hr />
          {children}
        </DialogContent>
      </Dialog>
    </>
  );
}
