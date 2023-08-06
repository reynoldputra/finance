import { Row } from "@tanstack/react-table";
import { DataTableRowActions } from "@client/components/table/DataTableRowActions";
import { TKolektorTable } from "@server/collections/kolektor/kolektorSchema";
import { trpc } from "@client/lib/trpc";
import { useToast } from "@client/components/ui/use-toast";
import ModalDropdownItem from "@client/components/modal/ModalDropdownItem";
import EditKolektorForm from "../KolektorForm/EditKolektorForm";
import ConfirmDeleteForm from "@client/components/form/ConfirmDeleteForm";

interface RowActionsProps<TData> {
  row: Row<TData>;
}

export function RowAction({ row }: RowActionsProps<TKolektorTable>) {
  const { toast } = useToast();
  const utils = trpc.useContext();

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
      <ModalDropdownItem triggerChildren="Delete">
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
          <div className="flex flex-col text-lg mt-2">
            <span className=" text-base font-semibold">
              Please type kolektr's name "{row.original.nama}" to confirm the
              delete.{" "}
            </span>
            <ConfirmDeleteForm
              handleDelete={handleDelete}
              currName={row.original.nama}
            />
          </div>
        </div>
      </ModalDropdownItem>
    </DataTableRowActions>
  );
}
