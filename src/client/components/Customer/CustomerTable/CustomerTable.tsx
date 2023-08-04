import { DataTable } from "@client/components/table/DataTable/DataTable";
import useDataTable from "@client/hook/useDataTable";
import { trpc } from "@client/lib/trpc";
import { CustomerColumn } from "./CustomerColumn";
import { Table } from "@tanstack/react-table";
import { ICustomerTable } from "@server/types/customer";
import CreateCustomer from "../CreateCustomer";

export default function CustomerTable () {
  const data = trpc.customer.customerTable.useQuery()
  const table = useDataTable({
    columns : CustomerColumn,
    data : data.data ?? [],
  })

  return (
    <>
      <DataTable
        columns={CustomerColumn}
        table={table}
        toolbar={<ToolbarCustomer table={table} />}
      />
    </>
  )
}

const ToolbarCustomer = ({table} : {table : Table<ICustomerTable>}) => {
  return (
    <>
      <CreateCustomer />
    </>
  )
} 