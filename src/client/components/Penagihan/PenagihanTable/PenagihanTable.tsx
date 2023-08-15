import DataTable from "@client/components/table/DataTable";
import useDataTable from "@client/hook/useDataTable";
import { trpc } from "@client/lib/trpc";
import CreatePenagihan from "../CreatePenagihan";
import { PenagihanColumn } from "./PenagihanColumn";

export default function PenagihanTable() {
  const data = trpc.penagihan.getAllPenagihan.useQuery().data;
  // console.log(data?.data)
  const table = useDataTable({
    columns: PenagihanColumn,
    data: data?.data ?? [],
  });

  return (
    <>
      <DataTable table={table} columns={PenagihanColumn} toolbar={<Toolbar />} />
    </>
  );
}

const Toolbar = () => {
  return (
    <>
      <CreatePenagihan />
    </>
  );
};
