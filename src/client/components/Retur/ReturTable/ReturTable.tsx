import DataTable from "@client/components/table/DataTable";
import useDataTable from "@client/hook/useDataTable";
import { trpc } from "@client/lib/trpc";
import { ReturColumn } from "./ReturColumn";
import CreateRetur from "../CreateRetur";

export default function ReturTable() {
  const data = trpc.retur.getAllRetur.useQuery().data;
  const table = useDataTable({
    columns: ReturColumn,
    data: data?.data ?? [],
  });

  return (
    <>
      <DataTable
        columns={ReturColumn}
        table={table}
        toolbar={<ToolbarRetur />}
      />
    </>
  );
}

const ToolbarRetur = () => {
  return (
    <>
      <CreateRetur />
    </>
  );
};
