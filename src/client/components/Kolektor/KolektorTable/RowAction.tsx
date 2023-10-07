import { Row } from "@tanstack/react-table";
import { DataTableRowActions } from "@client/components/table/DataTableRowActions";
import { TKolektorTable } from "@server/collections/kolektor/kolektorSchema";
import { trpc } from "@client/lib/trpc";
import { useToast } from "@client/components/ui/use-toast";
import ModalDropdownItem from "@client/components/modal/ModalDropdownItem";
import EditKolektorForm from "../KolektorForm/EditKolektorForm";
import ConfirmDeleteForm from "@client/components/form/ConfirmDeleteForm";
import { useState } from "react";
import { Button } from "@client/components/ui/button";

interface RowActionsProps<TData> {
  row: Row<TData>;
}

export function RowAction({ row }: RowActionsProps<TKolektorTable>) {
  const { toast } = useToast();
  const utils = trpc.useContext();
  const [openDelete, setOpenDelete] = useState(false);

  const handleCloseDelete = () => {
    setOpenDelete(!openDelete);
  };

  const deleteKolektorMutation = trpc.kolektor.deleteKolektor.useMutation({
    onSuccess: () => {
      utils.kolektor.invalidate();
    },
  });

  async function handleDelete() {
    try {
      const { data } = await deleteKolektorMutation.mutateAsync(
        row.original.id
      );
      if (data) {
        toast({
          description: `Kolektor ${data.nama} successfully deleted`,
          variant: "success",
          className: "text-white text-base font-semibold",
        });
        handleCloseDelete()
      }
    } catch (error) {
      console.log(error);
      toast({
        description: `Failed to delete kolektor, please try again`,
        variant: "destructive",
        className: "text-white text-base font-semibold",
      });
    }
  }
  return (
    <DataTableRowActions>
      <ModalDropdownItem triggerChildren="Edit">
        <EditKolektorForm kolektorData={row.original} />
      </ModalDropdownItem>
      <ModalDropdownItem
        open={openDelete}
        onOpenChange={setOpenDelete}
        triggerChildren="Delete"
      >
        <div className="flex flex-col w-full h-full">
          <div className="flex flex-col">
            <span className="font-bold text-xl">Are you sure ?</span>
            <span className=" text-base mt-3">
              This action
              <span className="text-base font-semibold"> CANNOT</span> be
              undone. This will permanently delete the
              <span className="font-semibold"> "{row.original.nama}" </span>
              kolektor.
            </span>
          </div>
          <div className="flex text-lg gap-x-3 mt-2">
            <Button
              variant={"outline"}
              onClick={handleCloseDelete}
              className="text-base font-semibold px-10"
            >
              No
            </Button>
            <Button
              variant={"destructive"}
              onClick={handleDelete}
              className="text-base font-semibold px-10"
            >
              Yes
            </Button>
          </div>
        </div>
      </ModalDropdownItem>
    </DataTableRowActions>
  );
}
