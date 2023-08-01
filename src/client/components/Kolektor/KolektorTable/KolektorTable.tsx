import useDataTable from "@client/hook/useDataTable";
import { trpc } from "@client/lib/trpc";
import { KolektorColumn } from "./KolektorColumn";
import DataTable from "@client/components/table/DataTable";

export default function KolektorTable() {
  const data = trpc.kolektor.kolektorTable.useQuery();
  const table = useDataTable({
    columns: KolektorColumn,
    data: data.data?.data ?? [],
  });
  console.log(data);
  return (
    <>
      <DataTable 
        columns={KolektorColumn} 
        table={table} />
    </>
  );
}
