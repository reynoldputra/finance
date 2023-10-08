import React from "react";
import { Table } from "@tanstack/react-table";
import { TPenagihanTable } from "./data/schema";
import Modal from "@client/components/modal/Modal";
import { Button } from "@client/components/ui/button";
import { useToast } from "@client/components/ui/use-toast";
import { trpc } from "@client/lib/trpc";

interface SelectedActionProps<TData> {
  table: Table<TData>;
}

export default function SelectedAction({
  table,
}: SelectedActionProps<TPenagihanTable>) {
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();

  const handleClose = () => {
    setOpen(!open);
  };

  const selectedRows = table.getGroupedSelectedRowModel().rows;
  const id = selectedRows.map((i) => i.original.id);

  const changeManyToNihilMutation =
    trpc.penagihan.changeManyStatusToNihil.useMutation();
  const utils = trpc.useContext();

  const handleChangeNihil = async () => {
    const res = await changeManyToNihilMutation.mutateAsync(id);
    if (res.status) {
      toast({
        description: "Success Change item",
        variant: "success",
        className: "text-white text-base font-semibold",
      });
      utils.penagihan.invalidate();
      handleClose();
    } else {
      toast({
        description: "Failed to change penagihan, please try again",
        variant: "destructive",
        className: "text-white text-base font-semibold",
      });
    }
  };

  return (
    <>
      <Modal
        open={open}
        onOpenChange={handleClose}
        buttonTitle="Change to Nihil"
        buttonProps={{
          disabled: !(
            table.getIsSomeRowsSelected() || table.getIsAllRowsSelected()
          ),
        }}
      >
        <div className="flex flex-col w-full h-full">
          <div className="flex flex-col">
            <span className="font-bold text-xl">Are you sure ?</span>
            <span className=" text-base mt-3">
              This action will change the status of selected penagihan to NIHIL
            </span>
          </div>
          <div className="flex text-lg gap-x-3 mt-2">
            <Button
              variant={"outline"}
              onClick={handleClose}
              className="text-base font-semibold px-10"
            >
              No
            </Button>
            <Button
              variant={"destructive"}
              onClick={handleChangeNihil}
              className="text-base font-semibold px-10"
            >
              Yes
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
