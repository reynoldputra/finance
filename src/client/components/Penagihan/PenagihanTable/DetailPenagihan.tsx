import { dmyDate } from "@client/lib/dmyDate";
import { trpc } from "@client/lib/trpc";
import { Fragment } from "react";
export default function DetailPenagihan({
  penagihanId,
}: {
  penagihanId: string;
}) {
  const detailPenagihan = trpc.penagihan.getPenagihanById.useQuery(penagihanId);
  const dataPenagihan = detailPenagihan.data?.data;

  const cnheader = "font-bold text-base";

  return (
    <div>
      {dataPenagihan && (
        <div className="text-md">
          <p className={cnheader}>Invoice</p>
          <p>{dataPenagihan.invoice.transaksiId}</p>
          <p className={cnheader}>Tanggal Penagihan</p>
          <p>{dmyDate(dataPenagihan.tanggalTagihan)}</p>
          <p className={cnheader}>Total Tagihan</p>
          <p>{dataPenagihan.invoice.total.toString()}</p>
          <hr className="my-6" />
          <p className={cnheader}>Pembayaran</p>
          {dataPenagihan.distribusiPembayaran.length > 0 ? (
            <div className="grid grid-cols-4">
              <p className={cnheader}>Kode</p>
              <p className={cnheader}>Tanggal</p>
              <p className={cnheader}>Total</p>
              <p className={cnheader}>Metode</p>
              {dataPenagihan.distribusiPembayaran.map((d) => (
                <Fragment>
                  <p>{d.caraBayarId}</p>
                  <p>{dmyDate(d.caraBayar.tanggal)}</p>
                  <p>{d.caraBayar.metode.jenis}</p>
                  <p>{d.jumlah.toString()}</p>
                </Fragment>
              ))}
            </div>
          ) : (
            <p>Tidak ada pembayaran</p>
          )}
        </div>
      )}
    </div>
  );
}
