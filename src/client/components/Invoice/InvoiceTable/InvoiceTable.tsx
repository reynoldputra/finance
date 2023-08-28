import useDataTable from "@client/hook/useDataTable";
import { trpc } from "@client/lib/trpc";
import DataTable from "@client/components/table/DataTable";
import { InvoiceColumn } from "./InvoiceColumn";
import SelectedAction from "./SelectedAction";
import { Table } from "@tanstack/react-table";
import { TInvoiceSchema } from "./data/schema";
import CreateInvoice from "../CreateInvoice";
import CreateInvoiceFile from "../invoiceForm/CreateInvoiceFile";

export default function InvoiceTable() {
  const data = trpc.invoice.getInvoices.useQuery().data;
  const table = useDataTable({
    columns: InvoiceColumn,
    data: data?.data ?? [],
  });

  return (
    <>
      <DataTable columns={InvoiceColumn} table={table} toolbar={<ToolbarInvoice table={table} />} />
    </>
  );
}

const ToolbarInvoice = ({table} : {table : Table<TInvoiceSchema>}) => {
  return (
    <>
      <SelectedAction table={table} />
      <CreateInvoice />
      <CreateInvoiceFile />
    </>
  )
} 
