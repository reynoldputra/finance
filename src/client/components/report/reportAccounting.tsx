import { Button } from "@client/components/ui/button"
import xlsx from "node-xlsx"
import { useState } from "react"
import { DatePicker } from "../form/DatePicker"
import { trpc } from "@client/lib/trpc"
import { idr } from "@client/lib/idr"
import toPascalCase from "@client/lib/pascalCase"
import { dmyDate } from "@client/lib/dmyDate"

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

    console.log(tanggalPenagihan.toISOString(), tanggalPembayaran.toISOString())

    const dateStr = tanggalPembayaran.toLocaleDateString('id', { day: '2-digit', month: 'long', year: 'numeric' })
    let dateSplit = dateStr.split(" ")
    let month = dateSplit[1].toUpperCase()
    let finaldatestr = dateSplit[0] + ` ${month} ` + dateSplit[2]
    console.log(finaldatestr)

    await query.refetch()

    let queryResult = query.data?.data ?? []

    let data: (string | number)[][] = []
    let finalResult: (string | number)[][] = []

    for(let idx in queryResult) {
      let q = queryResult[idx]
      let template = ["", q.namaKolektor, q.namaSales, q.namaCustomer, dmyDate(q.invoice.tanggalTransaksi), q.transaksiId, idr(q.invoice.total), idr(q.sisa)]
      console.log(template)
      q.distribusi.forEach((v) => {
        const sisa = v.jumlah - q.sisa
        const ketsisa = sisa > 0 ? `, Lebih ${sisa}` : (sisa < 0 ? `, Kurang ${sisa}` : "")
        const ket = (q.status == "LUNAS" || q.status == "PELUNASAN") ? ketsisa : ""
        if (v.caraBayar.metodePembayaranId == 1) {
          data.push([...template, idr(v.jumlah), "", "", "", "", toPascalCase(q.status + ket)])
        }
        if (v.caraBayar.giro) {
          const giro = v.caraBayar.giro
          data.push([...template, "", giro.bank, giro.nomor, dmyDate(giro.jatuhTempo), idr(v.jumlah), toPascalCase(q.status + ket)])
        }
      })
    }

    data = data.sort((a, b) => {
      return (
        (a[1] as string).localeCompare(b[1] as string) ||
        (a[3] as string).localeCompare(b[3] as string) ||
        (a[5] as string).localeCompare(b[5] as string)
      )
    })

    let currentKolektor = ""
    let currentCustomer = ""
    let currentIdTransaksi = ""
    let i = 1;

    data.forEach(d => {
      let temp = d
      let space = true

      if (currentCustomer && currentKolektor && d[3] == currentCustomer && d[1] == currentKolektor) {
        space = false
        d = d.map((v, idx) => {
          if (idx <= 3) {
            return ""
          } else {
            return v
          }
        })
      }

      if (currentIdTransaksi == d[5]) {
        space = false
        d = d.map((v, idx) => {
          if (idx <= 7) {
            return ""
          } else {
            return v
          }
        })
        d[d.length-1] = ""
      }

      if (space) {
        finalResult.push([""])
        d[0] = i
        i++
        finalResult.push(d)
      } else {
        d[0] = i
        i++
        finalResult.push(d)
      }


      currentKolektor = temp[1] as string
      currentIdTransaksi = temp[5] as string
      currentCustomer = temp[3] as string
    })

    console.log(data)
    console.log(finalResult)

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
      '!cols': [{ wch: 5 }, { wch: 10 }, { wch: 10 }, { wch: 15 }, { wch: 15 }, { wch: 10 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }]
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
