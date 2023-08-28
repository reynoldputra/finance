import { Button } from "@client/components/ui/button"
import xlsx from "node-xlsx"
import { useState } from "react"
import { DatePicker } from "../form/DatePicker"
import { trpc } from "@client/lib/trpc"
import { idr } from "@client/lib/idr"
import toPascalCase from "@client/lib/pascalCase"
import { dmyDate } from "@client/lib/dmyDate"

export default function ReportIncomingBank() {

  const [tanggalPembayaran, setTanggalPembayaran] = useState(new Date(2023, 4, 23))
  const [tanggalPenagihan, setTanggalPenagihan] = useState(new Date(2023, 4, 23))

  const query = trpc.carabayar.getReportSetoranBank.useQuery({
    tanggalPenagihan,
    tanggalPembayaran
  }, {
    // enabled : false,
    // refetchOnWindowFocus: false
  })

  const clickHandle = async () => {
    const dateStr = tanggalPembayaran.toLocaleDateString('id', { day: '2-digit', month: 'long', year: 'numeric' })
    let dateSplit = dateStr.split(" ")
    let month = dateSplit[1].toUpperCase()
    let finaldatestr = dateSplit[0] + ` ${month} ` + dateSplit[2]
    console.log(finaldatestr)

    await query.refetch()

    const queryResult = query.data?.data ?? []

    console.log(queryResult)

    const data = queryResult.map(q => {
      return [
        q.penagihan.invoice.namaSales,
        q.penagihan.invoice.customer.nama,
        q.caraBayar.tanggal,
        q.penagihan.invoice.transaksiId,
        q.penagihan.invoice.total,
        q.jumlah,
        toPascalCase(q.keterangan),
      ]
    })

    const sortedData = data.sort((a, b) => {
      return (a[0] as string).localeCompare(b[0] as string) || (a[1] as string).localeCompare(b[1] as string)
    })

    let currentTotal = 0
    let prevSalesName = ""
    let currentSetoran = 1
    let setoranIdx = 0

    let finalData: (string | number | Date)[][] = []

    sortedData.forEach((value, index) => {
      if (index == 0) {
        finalData.push([currentSetoran, "SETORAN TUNAI", "", ""])
        currentSetoran += 1
        setoranIdx = 0
      }

      if ((prevSalesName && prevSalesName != value[0]) || index + 1 == sortedData.length) {
        finalData[setoranIdx][9] = "Rp " + idr(currentTotal)
        finalData.push([currentSetoran, "SETORAN TUNAI", "", "", "", "", "", "", ""])
        currentSetoran += 1
        currentTotal = 0
        setoranIdx = finalData.length - 1
      }

      if (currentTotal + (value[5] as number) > 100000000) {
        finalData[setoranIdx][9] = "Rp " + idr(currentTotal)
        finalData.push([currentSetoran, "SETORAN TUNAI", "", "", "", "", "", "", ""])
        currentSetoran += 1
        currentTotal = 0
        setoranIdx = finalData.length - 1
      } else {
        currentTotal += (value[5] as number)
      }

      finalData.push(["", value[1], "Ket:" + value[6], ""])
      finalData.push(["", "Inv " + value[3], "", ""])
      finalData.push(["", "Rp " + idr(value[5]), "", ""])
      finalData.push(["", "", "", ""])
      prevSalesName = value[0] as string
    })

    console.log(finalData)

    const header = [
      ["SAP TRANSAKSI INCOMING BANK BCA"],
      [""],
      ["PT. SENTRAL AUTO PRATAMA"],
      ["Date: 31 Mei 2023"],
      [""],
      ["No.", "Toko", "", "Cara Pembayaran/Keterangan", "", "", "", "", "", "Amount"],
      ...finalData
    ]

    const ranges = [
      { s: { c: 0, r: 0 }, e: { c: 9, r: 1 } },
      { s: { c: 0, r: 2 }, e: { c: 9, r: 2 } },
      { s: { c: 0, r: 3 }, e: { c: 9, r: 3 } },

      { s: { c: 1, r: 5 }, e: { c: 2, r: 5 } },
      { s: { c: 3, r: 5 }, e: { c: 8, r: 5 } },
    ]

    const sheetOptions = {
      '!merges': ranges,
      '!cols': [{ wch: 5 }, { wch: 15 }, { wch: 15 }, { wch: 5 }, { wch: 5 }, { wch: 5 }, { wch: 5 }, { wch: 5 }, { wch: 5 }, { wch: 15 }]
    };

    const titlePenagihan = dmyDate(tanggalPenagihan, "-")
    const titlePembayaran = dmyDate(tanggalPembayaran, "-")
    const title = `incomingbank_${titlePenagihan}_${titlePembayaran}.xlsx`

    var buffer = xlsx.build([{ name: 'mySheetName', data: header, options: sheetOptions }]);

    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download =title;
    a.click();

    URL.revokeObjectURL(url);
  }

  return (
    <div className="mt-12">
      <p className="text-md font-bold mb-2">Report Incoming Bank</p>
      <div className="flex items-center gap-4">
        <div>
          <p>Tanggal Penagihan</p>
          <DatePicker date={tanggalPenagihan} setDate={setTanggalPenagihan} />
        </div>
        <div>
          <p>Tanggal Pembayaran</p>
          <DatePicker date={tanggalPembayaran} setDate={setTanggalPembayaran} />
        </div>
        <Button className="w-32" onClick={clickHandle}>
          <p>Save</p>
        </Button>
      </div>
    </div>
  )
}

