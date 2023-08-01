import useDataTable from "@client/hook/useDataTable";
import { trpc } from "@client/lib/trpc";

export default function KolektorTable() {
  const data = trpc.kolektor.kolektorTable.useQuery();
  // const table = useDataTable({
  // columns:
  // data: data.data ?? [],
  // });
  console.log(data);
  return <div></div>;
}
