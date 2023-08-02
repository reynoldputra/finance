import { trpc } from "@client/lib/trpc";

export const kolektorData = () => {
  const data = trpc.kolektor.getAllKolektor.useQuery();
  console.log(data.data?.data);
  return data;
};
