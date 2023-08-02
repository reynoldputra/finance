import { Row } from "@tanstack/react-table";
import { DataTableRowActions } from "@client/components/table/DataTableRowActions";
import { TInvoiceSchema } from "./data/schema";
import ModalDropdownItem from "@client/components/modal/ModalDropdownItem";

interface RowActionsProps<TData> {
  row: Row<TData>;
}

export function RowAction({ row }: RowActionsProps<TInvoiceSchema>) {
  return (
    <>
      <DataTableRowActions>
        <ModalDropdownItem triggerChildren="Edit">
          <p>content</p>
        </ModalDropdownItem>
      </DataTableRowActions>
    </>
  );
}
