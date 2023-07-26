type ButtonVariant =
  | "outline"
  | "link"
  | "default"
  | "destructive"
  | "secondary"
  | "ghost";

interface IModalsProps {
  buttonTitle: string;
  buttonVariant?: ButtonVariant;
  modalTitle: string;
  description?: string;
}

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

import { Button } from "./ui/button";

export const Modal: React.FC<IModalsProps> = ({
  buttonTitle,
  buttonVariant = "outline",
  modalTitle,
  description,
}) => {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant={buttonVariant}>{buttonTitle}</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{modalTitle}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};
