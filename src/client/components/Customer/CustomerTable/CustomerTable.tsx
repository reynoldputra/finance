import { DataTable } from "@client/components/table/DataTable/DataTable";
import useDataTable from "@client/hook/useDataTable";
import { trpc } from "@client/lib/trpc";
import { CustomerColumn } from "./CustomerColumn";

export default function CustomerTable () {
  const data = trpc.customer.customerTable.useQuery()
  console.log(data.data)
  const table = useDataTable({
    columns : CustomerColumn,
    data : data.data ?? [],
  })


  return (
    <>
      <DataTable
        columns={CustomerColumn}
        table={table}
      />
    </>
  )
}
