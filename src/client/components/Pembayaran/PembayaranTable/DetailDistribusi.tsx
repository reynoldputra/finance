import { dmyDate } from "@client/lib/dmyDate";
import { trpc } from "@client/lib/trpc";
import { Row } from "@tanstack/react-table";
import { Fragment } from "react";
import { TPembayaranSchema } from "./data/schema";

export default function DetailDistribusi({ row }: { row: Row<TPembayaranSchema> }) {
  const result = trpc.penagihan.getPenagihanByCarabayar.useQuery(row.original.id).data;
  const data = result?.data;

  return (
    <>
      <div className="grid grid-cols-3 py-8">
        <p className="font-bold text-md">Invoice</p>
        <p className="font-bold text-md">Tanggal</p>
        <p className="font-bold text-md">Jumlah</p>
        {data?.map((d, idx) => (
          <Fragment key={idx}>
            <p>{d.invoice.transaksiId}</p>
            <p>{dmyDate(d.tanggalTagihan)}</p>
            <p>{d.distribusi?.jumlah}</p>
          </Fragment>
        ))}
      </div>
    </>
  );
}
