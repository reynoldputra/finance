import { Button } from "@client/components/ui/button"
import xlsx from "node-xlsx"
import { useState } from "react"
import { DatePicker } from "../form/DatePicker"
import { trpc } from "@client/lib/trpc"
import { idr } from "@client/lib/idr"
import toPascalCase from "@client/lib/pascalCase"
import { dmyDate } from "@client/lib/dmyDate"

export default function ReportAccounting() {
  const [tanggalPembayaran, setTanggalPembayaran] = useState(new Date(2023, 4, 23))
  const [tanggalPenagihan, setTanggalPenagihan] = useState(new Date(2023, 4, 23))

  const query = trpc.penagihan.getReportAccounting.useQuery({
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

    let data: (string | number)[][] = []
    let finalResult: (string | number)[][] = []

    queryResult.forEach(q => {
      let template = ["", q.namaKolektor, q.namaSales, q.namaCustomer, dmyDate(q.invoice.tanggalTransaksi), q.transaksiId, q.invoice.total, q.sisa]
      q.distribusi.forEach((v) => {
        if (v.caraBayar.metodePembayaranId == 1) {
          data.push([...template, v.jumlah, "", "", "", "", q.status])
        }
        if (v.caraBayar.giro) {
          const giro = v.caraBayar.giro
          data.push([...template, "", giro.bank, giro.nomor, dmyDate(giro.jatuhTempo), v.jumlah, q.status])
        }
      })
    })

    data = data.sort((a, b) => {
      return (
        (a[1] as string).localeCompare(b[1] as string) ||
        (a[3] as string).localeCompare(b[3] as string) ||
        (a[5] as string).localeCompare(b[5] as string)
      )
    })

    let currentKolektor = ""
    let currentIdTransaksi = ""

    data.forEach(d => {
      let space = false
      if (currentKolektor == d[1]) {
        space = true
        d = d.map((v, idx) => {
          if (idx <= 4) {
            return ""
          } else {
            return v
          }
        })
      }


      if (currentIdTransaksi == d[5]) {
        d = d.map((v, idx) => {
          if (idx <= 7) {
            return ""
          } else {
            return v
          }
        })
      }

      finalResult.push(d)

      if (space) {
        finalResult.push([""])
      }

      currentKolektor = d[1] as string
      currentIdTransaksi = d[5] as string
    })

    console.log(data)
    console.log(finalResult)

    const header = [
      ["SAP LAPORAN HADIRAN TAGIHAN"],
      [""],
      ["DATE : 30 MEI 2023"],
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
      '!cols': [{ wch: 5 }, { wch: 10 }, { wch: 10 }, { wch: 15 }, { wch: 15 }, { wch: 10 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }]
    };

    var buffer = xlsx.build([{ name: 'mySheetName', data: header, options: sheetOptions }]);

    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'accounting_report.xlsx';
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
