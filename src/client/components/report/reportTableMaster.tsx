import { Button } from "@client/components/ui/button"
import xlsx from "node-xlsx"
import { trpc } from "@client/lib/trpc"
import { useState } from "react"
import { DatePicker } from "../form/DatePicker"
import { dmyDate } from "@client/lib/dmyDate"
import { idr } from "@client/lib/idr"
import toPascalCase from "@client/lib/pascalCase"

export default function ReportTableMaster() {
  const [start, setStart] = useState(new Date(2023, 4, 23))
  const [end, setEnd] = useState(new Date(2023, 4, 23))

  const query = trpc.penagihan.getTableMaster.useQuery({
    start,
    end
  }, {
    // enabled : false,
    // refetchOnWindowFocus: false
  })

  const clickHandle = async () => {
    const dateStr = start.toLocaleDateString('id', { day: '2-digit', month: 'long', year: 'numeric' })
    let dateSplit = dateStr.split(" ")
    let month = dateSplit[1].toUpperCase()
    let finaldatestr = dateSplit[0] + ` ${month} ` + dateSplit[2]
    console.log(finaldatestr)

    await query.refetch()

    const queryResult = query.data?.data ?? []

    let data: (string | number | boolean)[][] = []
    let finalResult: (string | number | boolean)[][] = []

    queryResult.forEach(q => {
      let template = [dmyDate(q.tanggalTagihan), q.namaKolektor, q.namaSales, q.namaCustomer, dmyDate(q.invoice.tanggalTransaksi), q.transaksiId, q.tandaTerima, idr(q.invoice.total), idr(q.sisa)]
      q.distribusi.forEach((v) => {
        if (v.caraBayar.metodePembayaranId == 1) {
          data.push([...template, idr(v.jumlah), "", "", "", "", "", "", "", toPascalCase(q.status)])
          return
        }
        if (v.caraBayar.giro) {
          const giro = v.caraBayar.giro
          data.push([...template, "", giro.bank, giro.nomor, dmyDate(giro.jatuhTempo), Number(v.caraBayar.total), "", "", "", toPascalCase(q.status)])
          return
        }
        if (v.caraBayar.transfer) {
          data.push([...template, "", "", "", "", "", dmyDate(v.caraBayar.tanggal), Number(v.jumlah), "", toPascalCase(q.status)])
          return
        }
        data.push([...template, "", "", "", "", "", "", "", "TRUE", ""])
      })
    })

    data = data.sort((a, b) => {
      return (
        (a[0] as string).localeCompare(b[0] as string) ||
        (a[1] as string).localeCompare(b[1] as string) ||
        (a[3] as string).localeCompare(b[3] as string) ||
        (a[5] as string).localeCompare(b[5] as string)
      )
    })

    // let currentKolektor = ""
    // let currentIdTransaksi = ""

    // data.forEach(d => {
    //   let space = false
    //   if (currentKolektor == d[1]) {
    //     space = true
    //     d = d.map((v, idx) => {
    //       if (idx <= 4) {
    //         return ""
    //       } else {
    //         return v
    //       }
    //     })
    //   }


    //   if (currentIdTransaksi == d[5]) {
    //     d = d.map((v, idx) => {
    //       if (idx <= 7) {
    //         return ""
    //       } else {
    //         return v
    //       }
    //     })
    //   }

    //   finalResult.push(d)

    //   if (space) {
    //     finalResult.push([""])
    //   }

    //   currentKolektor = d[1] as string
    //   currentIdTransaksi = d[5] as string
    // })

    console.log(data)
    console.log(finalResult)
    const header = [
      // ["SAP TRANSAKSI INCOMING BANK BCA"],
      // [""],
      // ["PT. SENTRAL AUTO PRATAMA"],
      // ["Date: 31 Mei 2023"],
      // [""],
      ["Tanggal Tagihan", "Nama Kolektor", "Nama Sales", "Customer Name", "Tanggal Transaksi", "ID Transaksi", "T/T", "Total Tagihan", "Sisa Tagihan", "Cara Bayar", "", "", "", "", "", "", "", "Ket."],
      ["", "", "", "", "", "", "", "", "Sisa Tagihan", "Cash", "Giro", "", "", "", "Transfer", "", "Nihil"],
      ["", "", "", "", "", "", "", "", "", "", "Bank", "No Giro", "Jatuh Tempo", "Amount", "Tanggal Transfer", "Amount", ""],
      ...data
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
      { s: { c: 17, r: 0 }, e: { c: 17, r: 2 } },

      { s: { c: 9, r: 0 }, e: { c: 16, r: 0 } }, // cara bayar
      { s: { c: 9, r: 1 }, e: { c: 9, r: 2 } }, // cash
      { s: { c: 10, r: 1 }, e: { c: 13, r: 1 } }, // giro
      { s: { c: 14, r: 1 }, e: { c: 15, r: 1 } }, // transfer
      { s: { c: 64, r: 1 }, e: { c: 16, r: 2 } }, // transfer

    ]

    const sheetOptions = {
      '!merges': ranges,
      '!cols': [{ wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }]
    };

    const titlePenagihan = dmyDate(start, "-")
    const titlePembayaran = dmyDate(end, "-")
    const title = `tablemaster_${titlePenagihan}_${titlePembayaran}.xlsx`

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
      <p className="text-md font-bold mb-2">Report Table Master</p>
      <div className="flex items-center gap-4">
        <div>
          <p>Start tanggal penagihan</p>
          <DatePicker date={start} setDate={setStart} />
        </div>
        <div>
          <p>End tanggal penagihan</p>
          <DatePicker date={end} setDate={setEnd} />
        </div>
        <Button className="w-32" onClick={clickHandle}>
          <p>Save</p>
        </Button>
      </div>
    </div>
  )
}

