import { trpc } from "@client/lib/trpc";
import { dmyDate } from "@client/lib/dmyDate";
import { idr } from "@client/lib/idr";

export default function DetailTandaTerima({ id }: { id: string }) {
  const detailTandaTerima = trpc.tandaTerima.getTandaTerimaDetail.useQuery(id);
  const dataTandaTerima = detailTandaTerima.data?.data;
  const cnheader = "font-bold text-base mx-auto";
  let totalAmount = 0;
  if (dataTandaTerima) {
    totalAmount = dataTandaTerima.reduce(
      (total, data) => total + data.total,
      0
    );
  }
  return (
    <div>
      {dataTandaTerima && (
        <>
          <div className="grid grid-cols-3 text-md">
            <p className={cnheader}>Invoice ID</p>
            <p className={cnheader}>Tanggal</p>
            <p className={cnheader}>Jumlah</p>
            {dataTandaTerima.map((data) => (
              <>
                <p className="mx-auto">{data.transaksiId}</p>
                <p className="mx-auto">{dmyDate(data.tanggalTransaksi)}</p>
                <p className="mx-auto">Rp. {idr(data.total)}</p>
              </>
            ))}
            <p className="col-end-4 font-semibold mx-auto">Total: Rp {idr(totalAmount)}</p>
          </div>
        </>
      )}
    </div>
  );
}
