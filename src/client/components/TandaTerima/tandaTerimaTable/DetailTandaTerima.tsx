import { trpc } from "@client/lib/trpc";
import { dmyDate } from "@client/lib/dmyDate";
import { idr } from "@client/lib/idr";
import { Fragment } from "react";
import { Row } from "@tanstack/react-table";
import { TTandaTerimaTable } from "./data/schema";
import { useNavigate } from "react-router-dom";

export default function DetailTandaTerima({
  id,
  row,
}: {
  id: string;
  row: Row<TTandaTerimaTable>;
}) {
  const navigate = useNavigate();
  const detailTandaTerima = trpc.tandaTerima.getTandaTerimaDetail.useQuery(id);
  const dataTandaTerima = detailTandaTerima.data?.data;
  const cnheader = "font-bold text-lg mx-auto";
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
          <div className="mb-3 flex flex-col">
            <div className="flex gap-x-5">
              <span className="font-bold text-lg items-center">
                Nama Customer :
              </span>
              <p className="mt-[0.1rem]">{row.original.namaCustomer}</p>
            </div>
            <div className="flex gap-x-3 items-center">
              <span className="font-bold text-lg">Alamat Customer :</span>
              <p>
                {row.original.alamat ? (
                  `${row.original.alamat}`
                ) : (
                  <p className="text-red-500 flex">
                    Please enter the customer's alamat on the{" "}
                    <span
                      className="cursor-pointer ml-1"
                      onClick={() => navigate("/customer")}
                    >
                      {" "}
                      Customer table
                    </span>
                    .
                  </p>
                )}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 text-base">
            <p className={cnheader}>Invoice ID</p>
            <p className={cnheader}>Tanggal</p>
            <p className={cnheader}>Jumlah</p>
            {dataTandaTerima.map((data) => (
              <Fragment key={data.transaksiId}>
                <p className="mx-auto">{data.transaksiId}</p>
                <p className="mx-auto">{dmyDate(data.tanggalTransaksi)}</p>
                <p className="mx-auto">Rp. {idr(data.total)}</p>
              </Fragment>
            ))}
            <p className="col-end-4 font-semibold mx-auto text-lg">
              Total: Rp {idr(totalAmount)}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
