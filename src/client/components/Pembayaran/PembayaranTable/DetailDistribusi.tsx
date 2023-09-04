import { dmyDate } from "@client/lib/dmyDate";
import { idr } from "@client/lib/idr";
import { trpc } from "@client/lib/trpc";
import { Row } from "@tanstack/react-table";
import { Fragment } from "react";
import { TPembayaranSchema } from "./data/schema";

export default function DetailDistribusi({ row }: { row: Row<TPembayaranSchema> }) {
  const result = trpc.penagihan.getPenagihanByCarabayar.useQuery(row.original.id).data;
  const data = result?.data?.sort((a,b) => (Number(b.distribusi?.jumlah ) ?? 0) - (Number(a.distribusi?.jumlah) ?? 0));

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
            <p>Rp {idr(Number(d.distribusi?.jumlah))}</p>
          </Fragment>
        ))}
      </div>
    </>
  );
}
