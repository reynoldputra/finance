import { DataTable } from "@client/components/table/DataTable/DataTable";
import useDataTable from "@client/hook/useDataTable";
import { CustomerColumn } from "./CustomerColumn";
import tasks from "./data/tasks.json"
import Toolbar from "./Toolbar";

export default function CustomerTable () {
  const table = useDataTable({
    columns : CustomerColumn,
    data : tasks
  })

  return (
    <>
      <DataTable
        columns={CustomerColumn}
        table={table}
        toolBar={<Toolbar table={table}  />}
      />
    </>
  )
}
