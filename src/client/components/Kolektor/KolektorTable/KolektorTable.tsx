import useDataTable from "@client/hook/useDataTable";
import { trpc } from "@client/lib/trpc";
import { KolektorColumn } from "./KolektorColumn";
import DataTable from "@client/components/table/DataTable";
import { Table } from "@tanstack/react-table";
import CreateKolektor from "../CreateKolektor";
import { TKolektorTable } from "@server/collections/kolektor/kolektorSchema";

export default function KolektorTable() {
  const data = trpc.kolektor.kolektorTable.useQuery();
  const table = useDataTable({
    columns: KolektorColumn,
    data: data.data?.data ?? [],
  });
  return (
    <>
      <DataTable
        columns={KolektorColumn}
        table={table}
        toolbar={<ToolbarKolektor table={table} />}
      />
    </>
  );
}

const ToolbarKolektor = ({ table }: { table: Table<TKolektorTable> }) => {
  return (
    <>
      <CreateKolektor />
    </>
  );
};
