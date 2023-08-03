import useDataTable from "@client/hook/useDataTable";
import { trpc } from "@client/lib/trpc";
import { useNavigate } from "react-router-dom";
import DataTable from "@client/components/table/DataTable";
import { InvoiceColumn } from "./InvoiceColumn";

export default function InvoiceTable() {
  const data = trpc.invoice.getInvoices.useQuery().data;
  const table = useDataTable({
    columns: InvoiceColumn,
    data: data?.data ?? [],
  });

  return (
    <>
      <DataTable columns={InvoiceColumn} table={table} />
    </>
  );
}
