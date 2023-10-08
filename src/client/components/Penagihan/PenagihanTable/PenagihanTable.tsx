import DataTable from "@client/components/table/DataTable";
import useDataTable from "@client/hook/useDataTable";
import { trpc } from "@client/lib/trpc";
import CreatePenagihan from "../CreatePenagihan";
import { PenagihanColumn } from "./PenagihanColumn";
import { TPenagihanTable } from "./data/schema";
import { Table } from "@tanstack/react-table";
import SelectedAction from "./SelectedAction";

export default function PenagihanTable() {
  const data = trpc.penagihan.getAllPenagihan.useQuery().data;
  const table = useDataTable({
    columns: PenagihanColumn,
    data: data?.data ?? [],
  });

  return (
    <>
      <DataTable table={table} columns={PenagihanColumn} toolbar={<Toolbar table={table} />} />
    </>
  );
}

const Toolbar = ({table} : {table: Table<TPenagihanTable>}) => {
  return (
    <>
      <SelectedAction table={table}/>
      <CreatePenagihan />
    </>
  );
};
