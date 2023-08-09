import DataTable from '@client/components/table/DataTable';
import useDataTable from '@client/hook/useDataTable';
import { trpc } from '@client/lib/trpc'
import { TandaTerimaColumn } from './TandaTerimaColumn';

export default function TandaTerimaTable() {
    const data = trpc.tandaTerima.getTandaTerimaTable.useQuery().data;
    console.log(data?.data)
    const table = useDataTable({
      columns: TandaTerimaColumn,
      data: data?.data ?? [],
    })
  return (
    <>
      <DataTable table={table} columns={TandaTerimaColumn} toolbar={<Toolbar />}/>
    </>
  )
}

const Toolbar = () => {
  return (
    <>

    </>
  )
}