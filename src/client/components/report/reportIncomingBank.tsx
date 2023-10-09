import { Button } from "@client/components/ui/button"
import xlsx from "node-xlsx"
import { useState } from "react"
import { DatePicker } from "../form/DatePicker"
import { trpc } from "@client/lib/trpc"
import toPascalCase from "@client/lib/pascalCase"
import { dmyDate } from "@client/lib/dmyDate"
import { roundDecimal } from "@client/lib/roundDecimal"

export default function ReportIncomingBank() {
  const day = new Date()
  day.setHours(0,0,0,0)
  const [tanggalPembayaran, setTanggalPembayaran] = useState(day)
  const [tanggalPenagihan, setTanggalPenagihan] = useState(day)

  const query = trpc.carabayar.getReportSetoranBank.useQuery({
    tanggalPenagihan,
    tanggalPembayaran
  }, {
    // enabled : false,
    // refetchOnWindowFocus: false
  })

  const clickHandle = async () => {
    const day = tanggalPembayaran
    day.setHours(0,0,0,0)
    setTanggalPembayaran(day)

    const day2 = tanggalPenagihan
    day2.setHours(0,0,0,0)
    setTanggalPenagihan(day2)

    const dateStr = tanggalPembayaran.toLocaleDateString('id', { day: '2-digit', month: 'long', year: 'numeric' })
    let dateSplit = dateStr.split(" ")
    let month = dateSplit[1].toUpperCase()
    let finaldatestr = dateSplit[0] + ` ${month} ` + dateSplit[2]

    await query.refetch()

    const queryResult = query.data?.data ?? []

    const cash = queryResult.filter(q => q.penagihan.invoice.type == "Cash")
    const kredit = queryResult.filter(q => q.penagihan.invoice.type == "KREDIT 30 HARI")

    const dataCash = cash.map(q => {
      return [
        q.penagihan.invoice.namaSales,
        q.penagihan.invoice.customer.nama,
        q.penagihan.invoice.tanggalTransaksi,
        q.penagihan.invoice.transaksiId,
        roundDecimal(Number(q.penagihan.invoice.total)),
        roundDecimal(Number(q.jumlah)),
        toPascalCase(q.keterangan),
      ]
    })

    const sortedDataCash = dataCash.sort((a, b) => {
      return (a[0] as string).localeCompare(b[0] as string) || (a[1] as string).localeCompare(b[1] as string)
    })

    let currentTotal = 0
    let prevSalesName = ""
    let currentSetoran = 1
    let setoranIdx = 0

    let finalDataCash: (string | number | Date)[][] = []
    let finalDataKredit: (string | number | Date)[][] = []

    sortedDataCash.forEach((value, index) => {
      if (index == 0) {
        finalDataCash.push([currentSetoran, "SETORAN TUNAI", "", ""])
        currentSetoran += 1
        setoranIdx = 0
      }

      if ((prevSalesName && prevSalesName != value[0]) || index + 1 == sortedDataCash.length) {
        finalDataCash[setoranIdx][9] = currentTotal
        finalDataCash.push([currentSetoran, "SETORAN TUNAI", "", "", "", "", "", "", ""])
        currentSetoran += 1
        currentTotal = 0
        setoranIdx = finalDataCash.length - 1
      }

      if (currentTotal + (value[5] as number) > 100000000) {
        finalDataCash[setoranIdx][9] = currentTotal
        finalDataCash.push([currentSetoran, "SETORAN TUNAI", "", "", "", "", "", "", ""])
        currentSetoran += 1
        currentTotal = 0
        setoranIdx = finalDataCash.length - 1
      } else {
        currentTotal += (value[5] as number)
      }

      finalDataCash.push(["", value[1], value[6] ? "Ket:" + value[6] : "", ""])
      finalDataCash.push(["", "Inv " + value[3], "", ""])
      finalDataCash.push(["", value[5], "", ""])
      finalDataCash.push(["", "", "", ""])
      prevSalesName = value[0] as string
    })

    console.log(finalDataCash)

    const dataKredit = kredit.map(q => {
      return [
        q.penagihan.invoice.namaSales,
        q.penagihan.invoice.customer.nama,
        q.caraBayar.tanggal,
        q.penagihan.invoice.transaksiId,
        roundDecimal(Number(q.penagihan.invoice.total)),
        roundDecimal(Number(q.jumlah)),
        toPascalCase(q.keterangan),
      ]
    })

    const sortedDataKredit = dataKredit.sort((a, b) => {
      return (a[0] as string).localeCompare(b[0] as string) || (a[1] as string).localeCompare(b[1] as string)
    })

    currentTotal = 0
    prevSalesName = ""
    currentSetoran = 1
    setoranIdx = 0

    sortedDataKredit.forEach((value, index) => {
      if (index == 0) {
        finalDataKredit.push([currentSetoran, "SETORAN TUNAI", "", ""])
        currentSetoran += 1
        setoranIdx = 0
      }

      if ((prevSalesName && prevSalesName != value[0]) || index + 1 == sortedDataCash.length) {
        finalDataKredit[setoranIdx][9] = currentTotal
        finalDataKredit.push([currentSetoran, "SETORAN TUNAI", "", "", "", "", "", "", ""])
        currentSetoran += 1
        currentTotal = 0
        setoranIdx = finalDataKredit.length - 1
      }

      if (currentTotal + (value[5] as number) > 100000000) {
        finalDataKredit[setoranIdx][9] = currentTotal
        finalDataKredit.push([currentSetoran, "SETORAN TUNAI", "", "", "", "", "", "", ""])
        currentSetoran += 1
        currentTotal = 0
        setoranIdx = finalDataKredit.length - 1
      } else {
        currentTotal += (value[5] as number)
      }

      finalDataKredit.push(["", value[1], value[6] ? "Ket:" + value[6] : "", ""])
      finalDataKredit.push(["", "Inv " + value[3], "", ""])
      finalDataKredit.push(["", value[5], "", ""])
      finalDataKredit.push(["", "", "", ""])
      prevSalesName = value[0] as string
    })

    const header = [
      ["SAP TRANSAKSI INCOMING BANK BCA"],
      [""],
      ["PT. SENTRAL AUTO PRATAMA"],
      ["Date: " + finaldatestr],
      [""],
      ["No.", "Toko", "", "Cara Pembayaran/Keterangan", "", "", "", "", "", "Amount"],
      [""],
      [""],
      ["Cash"],
      ...finalDataCash,
      [""],
      [""],
      [""],
      ["Kredit"],
      ...finalDataKredit,
      [""],
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

