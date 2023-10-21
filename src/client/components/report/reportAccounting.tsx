import { Button } from "@client/components/ui/button"
import xlsx from "node-xlsx"
import { useState } from "react"
import { DatePicker } from "../form/DatePicker"
import { trpc } from "@client/lib/trpc"
import toPascalCase from "@client/lib/pascalCase"
import { dmyDate } from "@client/lib/dmyDate"
import { roundDecimal } from "@client/lib/roundDecimal"

export default function ReportAccounting() {
  const day = new Date()
  day.setHours(0,0,0,0)
  const [tanggalPembayaran, setTanggalPembayaran] = useState(day)
  const [tanggalPenagihan, setTanggalPenagihan] = useState(day)

  const query = trpc.penagihan.getReportAccounting.useQuery({
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

    let queryResult = query.data?.data ?? []

    let data: (string | number)[][] = []
    let finalResult: (string | number)[][] = []

    for(let idx in queryResult) {
      let q = queryResult[idx]
      let sisa = q.sisa === q.invoice.total ? "" : q.sisa;
      const template = ["", q.namaKolektor, q.namaSales, q.namaCustomer, dmyDate(q.invoice.tanggalTransaksi), q.transaksiId, roundDecimal(q.invoice.total), roundDecimal(sisa)]
      q.distribusi.forEach((v) => {
        if (v.caraBayar.metodePembayaranId == 1) {
          data.push([...template, roundDecimal(v.caraBayar.total), "", "", "", "", toPascalCase(q.status)])
        }
        if (v.caraBayar.giro) {
          const giro = v.caraBayar.giro
          data.push([...template, "", giro.bank, giro.nomor, dmyDate(giro.jatuhTempo), roundDecimal(v.caraBayar.total), toPascalCase(q.status)])
        }
      })
    }
    

    const sorteddata = data.sort((a, b) => {
      return (
        (a[1] as string).localeCompare(b[1] as string) ||
        (a[2] as string).localeCompare(b[2] as string) ||
        (a[3] as string).localeCompare(b[3] as string) ||
        (a[10] as string).localeCompare(b[10] as string)
      )
    })


    let i = 1;
    let prev : (string | number)[] = []

    sorteddata.forEach(d => {
      let temp = d

      if(prev[10] == d[10]){
        temp[9] = ""
        temp[10] = ""
        temp[11] = ""
      }

      if(
        d[1] == prev[1] &&
        d[2] == prev[2] &&
        d[3] == prev[3]
      ) {
        temp[1] = ""
        temp[2] = ""
        temp[3] = ""
        finalResult.push(temp)
      } else {
        if(i != 1) {
          finalResult.push([""])
        }
        temp[0] = i
        finalResult.push(temp)
        i++
        prev = d
      }
    })

    const header = [
      ["SAP LAPORAN HADIRAN TAGIHAN"],
      [""],
      ["DATE : " + finaldatestr],
      [""],
      ["No", "Nama Kolektor", "Nama Sales", "Customer Name", "Tanggal Transaksi", "Id Transaksi", "Total Tagihan", "Sisa Tagihan", "Cara Bayar", "", "", "", "", "Ket"],
      ["", "", "", "", "", "", "", "", "Cash", "Giro", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", "Bank", "No. Giro", "Jatuh Tempo", "Amount", ""],
      ...finalResult
    ]

    const ranges = [
      { s: { c: 0, r: 4 }, e: { c: 0, r: 6 } },
      { s: { c: 1, r: 4 }, e: { c: 1, r: 6 } },
      { s: { c: 2, r: 4 }, e: { c: 2, r: 6 } },
      { s: { c: 3, r: 4 }, e: { c: 3, r: 6 } },
      { s: { c: 4, r: 4 }, e: { c: 4, r: 6 } },
      { s: { c: 5, r: 4 }, e: { c: 5, r: 6 } },
      { s: { c: 6, r: 4 }, e: { c: 6, r: 6 } },
      { s: { c: 7, r: 4 }, e: { c: 7, r: 6 } },

      { s: { c: 8, r: 4 }, e: { c: 12, r: 4 } }, // Cara bayar
      { s: { c: 9, r: 5 }, e: { c: 12, r: 5 } }, // Giro

      { s: { c: 8, r: 5 }, e: { c: 8, r: 6 } }, // Cash

      { s: { c: 13, r: 4 }, e: { c: 13, r: 6 } }, // Ket
    ]

    const sheetOptions = {
      '!merges': ranges,
      '!cols': [
        { wch: 5 }, // No
        { wch: 10 }, // Nama Kolektor
        { wch: 10 }, // Nama Sales
        { wch: 15 }, // Customer Name
        { wch: 15 }, // Tanggal Transaksi
        { wch: 10 }, // Id Transaksi
        { wch: 15 }, // Total Tagihan
        { wch: 15, type: 'number' }, // Sisa Tagihan
        { wch: 15 }, // Cara Bayar
        { wch: 15 }, // Cash
        { wch: 15 }, // Giro
        { wch: 15 }, // Bank
        { wch: 15 }, // No. Giro
        { wch: 15 }, // Jatuh Tempo
        { wch: 15 }]
    };

    const titlePenagihan = dmyDate(tanggalPenagihan, "-")
    const titlePembayaran = dmyDate(tanggalPembayaran, "-")
    const title = `accounting_${titlePenagihan}_${titlePembayaran}.xlsx`

    var buffer = xlsx.build([{ name: 'mySheetName', data: header, options: sheetOptions }]);

    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = title;
    a.click();

    URL.revokeObjectURL(url);
  }

  return (
    <div className="mt-12">
      <p className="text-md font-bold mb-2">Report Accounting</p>
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
