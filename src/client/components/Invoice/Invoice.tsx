import useDataTable from "@client/hook/useDataTable"
import { trpc } from "@client/lib/trpc"
import { useNavigate } from "react-router-dom"
import DataTable from "../table/DataTable"
import { InvoiceColumn } from "./InvoiceTable/InvoiceColumn"

export default function Invoice () {
  const data = trpc.invoice.getInvoices.useQuery().data
  const table = useDataTable({
    columns : InvoiceColumn,
    data : data?.data ?? []
  })
  
  const navigate = useNavigate()

  return (
    <>
      <DataTable
        columns={InvoiceColumn}
        table={table}
      />

      <p onClick={() => {navigate("/customer?id=123")}}>To invoice custId = "adfasdfa"</p>
    </>
  )
}
