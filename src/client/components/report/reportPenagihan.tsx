import { Button } from "@client/components/ui/button"
import xlsx from "node-xlsx"
import { trpc } from "@client/lib/trpc"
import { useState } from "react"
import { DatePicker } from "../form/DatePicker"
import { dmyDate } from "@client/lib/dmyDate"

export default function ReportPenagihan() {

  const [date, setDate] = useState(new Date())

  const clickHandle = async () => {
    date.setMinutes(0)
    date.setHours(0)
    date.setSeconds(0)
    date.setMilliseconds(0)
    await query.refetch()
    console.log(date.toISOString())
    console.log(query.data?.data)
    const queryResult = query.data?.data ?? []
    let data = queryResult.map((q) => {
      return [
        dmyDate(q.tanggalTagihan),
        q.namaKolektor,
        q.namaCustomer,
        q.sales,
        dmyDate(q.tanggalTransaksi),
        q.transaksiId,
        q.totalTagihan,
        q.sisa,
      ]
    })

    data = data.sort((a,b) => (a[1] as string).localeCompare(b[1] as string) || (a[2] as string).localeCompare(b[2] as string))

    printExcel(data)
  }

  const printExcel = (value : (string | number | boolean)[][]) => {
    const header = [
      // ["SAP TRANSAKSI INCOMING BANK BCA"],
      // [""],
      // ["PT. SENTRAL AUTO PRATAMA"],
      // ["Date: 31 Mei 2023"],
      // [""],
      ["Tanggal Tagihan", "Nama Kolektor", "Customer Name", "Nama Sales", "Tanggal Transaksi", "ID Transaksi", "Total Tagihan", "Sisa Tagihan"],
      ...value
    ]

    const ranges = [
      { s: { c: 0, r: 0 }, e: { c: 0, r: 2 } },
      { s: { c: 1, r: 0 }, e: { c: 1, r: 2 } },
      { s: { c: 2, r: 0 }, e: { c: 2, r: 2 } },
      { s: { c: 3, r: 0 }, e: { c: 3, r: 2 } },
      { s: { c: 4, r: 0 }, e: { c: 4, r: 2 } },
      { s: { c: 5, r: 0 }, e: { c: 5, r: 2 } },
      { s: { c: 6, r: 0 }, e: { c: 6, r: 2 } },
      { s: { c: 7, r: 0 }, e: { c: 7, r: 2 } },
      { s: { c: 8, r: 0 }, e: { c: 8, r: 2 } },
    ]

    const sheetOptions = {
      '!merges': ranges,
      '!cols': [{ wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }]
    };

    const dateTitle = dmyDate(date, "-")

    var buffer = xlsx.build([{ name: 'mySheetName', data: header, options: sheetOptions }]);

    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `penagihan_${dateTitle}.xlsx`;
    a.click();

    URL.revokeObjectURL(url);

  }

  const query = trpc.penagihan.getPenagihanByDate.useQuery(date, {
    // enabled : false,
    // refetchOnWindowFocus: false
  })

  return (
    <div className="mt-12">
      <p className="text-md font-bold mb-2">Export report tagihan</p>
      <div className="flex items-center gap-4">
        <DatePicker date={date} setDate={setDate} />
        <Button className="w-32" onClick={clickHandle}>
          <p>Save</p>
        </Button>
      </div>
    </div>
  )
}

