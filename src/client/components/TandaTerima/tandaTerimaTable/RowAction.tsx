import { TTandaTerimaTable } from "./data/schema";
import { Row } from "@tanstack/react-table";
import { DataTableRowActions } from "@client/components/table/DataTableRowActions";
import ModalDropdownItem from "@client/components/modal/ModalDropdownItem";
import DetailTandaTerima from "./DetailTandaTerima";

interface RowActionsProps<TData> {
  row: Row<TData>;
}

export function RowAction({ row }: RowActionsProps<TTandaTerimaTable>) {
  return (
    <>
      <DataTableRowActions>
        {/* <ModalDropdownItem
          triggerChildren="Edit"
          open={openEdit}
          onOpenChange={setOpenEdit}
        >
          <UpdateTandaTerimaForm setOpen={setOpenEdit} row={row} />
        </ModalDropdownItem> */}
        <ModalDropdownItem
          triggerChildren="Detail Tanda Terima"
          modalTitle="Detail Tanda Terima"
        >
          <DetailTandaTerima id={row.original.id} />
        </ModalDropdownItem>
        {/* <ModalDropdownItem triggerChildren="Delete">
          <div className="flex flex-col w-full h-full">
            <div className="flex flex-col">
              <span className="font-bold text-xl">Are you sure ?</span>
              <span className=" text-base mt-3">
                This action
                <span className="text-base font-semibold"> CANNOT</span> be
                undone. This will permanently delete the
                <span className="font-semibold"> "{row.original.id}" </span>
                Penagihan.
              </span>
            </div>
            <div className="flex flex-col text-lg mt-2">
              <span className=" text-base font-semibold">
                Please type penagihan's id "{row.original.id}" to confirm the
                delete.
              </span>
              <ConfirmDeleteForm
                handleDelete={handleDelete}
                currName={row.original.id}
              />
            </div>
          </div>
        </ModalDropdownItem> */}
      </DataTableRowActions>
    </>
  );
}
