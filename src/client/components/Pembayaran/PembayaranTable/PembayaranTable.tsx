import DataTable from "@client/components/table/DataTable"
import useDataTable from "@client/hook/useDataTable"
import { trpc } from "@client/lib/trpc"
import { CreatePembayaranModal } from "../PembayaranForm/CreatePembayaranForm"
import { pembayaranColumn } from "./PembayaranColumn"

export default function PembayaranTable () {
  const result = trpc.carabayar.getCarabayar.useQuery()

  const table = useDataTable({
    data : result.data?.data ?? [],
    columns : pembayaranColumn
  })


  return (
    <>
      <DataTable table={table} columns={pembayaranColumn} toolbar={<CreatePembayaranModal />} />
    </>
  )
}
