import useDataTable from '@client/hook/useDataTable';
import { trpc } from '@client/lib/trpc'

export default function TandaTerimaTable() {
    const data = trpc.tandaTerima.getTandaTerimaTable.useQuery().data;
    console.log(data?.data)
    // const table = useDataTable()
  return (
    <div>TandaTerimaTable</div>
  )
}
