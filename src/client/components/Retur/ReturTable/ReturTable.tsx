import DataTable from "@client/components/table/DataTable";
import useDataTable from "@client/hook/useDataTable";
import { trpc } from "@client/lib/trpc";
import { ReturColumn } from "./ReturColumn";
import CreateRetur from "../CreateRetur";
import ExportRetur from "./ExportRetur";

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
        toolbar={<ToolbarRetur table={table} />}
      />
    </>
  );
}

import { Table } from "@tanstack/react-table"
import { TReturSchema } from "./data/schema";


interface ToolbarReturExport { 
  table: Table<TReturSchema>
}

const ToolbarRetur = ({table} : ToolbarReturExport) => {
  return (
    <>
      <ExportRetur table={table} />
      <CreateRetur />
    </>
  );
};
