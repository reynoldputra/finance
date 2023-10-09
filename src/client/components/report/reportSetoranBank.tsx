import { Button } from "@client/components/ui/button"
import xlsx from "node-xlsx"
import { useState } from "react"
import { DatePicker } from "../form/DatePicker"
import { trpc } from "@client/lib/trpc"
import toPascalCase from "@client/lib/pascalCase"
import { dmyDate } from "@client/lib/dmyDate"
import { roundDecimal } from "@client/lib/roundDecimal"

export default function ReportSetoranBank() {
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

    console.log(tanggalPenagihan.toISOString(), tanggalPembayaran.toISOString())
    const dateStr = tanggalPembayaran.toLocaleDateString('id', {day : '2-digit', month : 'long', year: 'numeric'})
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
        dmyDate(q.penagihan.invoice.tanggalTransaksi),
        q.penagihan.invoice.transaksiId,
        roundDecimal(Number(q.penagihan.invoice.total)),
        roundDecimal(Number(q.jumlah)),
        toPascalCase(q.keterangan)
      ]
    })

    const sortedDataCash = dataCash.sort((a,b) => {
      return (a[0] as string).localeCompare(b[0] as string) || (a[1] as string).localeCompare(b[1] as string)
    })

    let currentTotal = 0
    let prevSalesName = ""
    let prevCustName = ""
    let lengthdata = sortedDataCash.length
    const newDataCash : (string | number)[][] = []
    const newDataKredit : (string | number)[][] = []

    sortedDataCash.forEach((value, index) => {
      if(index != 0 && prevCustName != value[1] && prevSalesName == value[0] ) {
        newDataCash.push([""])
      }


      if(currentTotal + (value[5] as number) > 100000000) {
        newDataCash.push(["", "", "", "Total", "", currentTotal, "", ""])
        newDataCash.push([""])
        newDataCash.push([""])
        currentTotal = value[5] as number
        prevSalesName = value[0] as string
        prevCustName = value[1] as string
        newDataCash.push(value)
        return
      }

      if((prevSalesName && prevSalesName != value[0])) {
        newDataCash.push(["", "", "", "Total", "", currentTotal, "", ""])
        newDataCash.push([""])
        newDataCash.push([""])
        currentTotal = 0
      }

      currentTotal += (value[5] as number)

      if(prevSalesName && prevCustName && index != 0 && prevSalesName == value[0] && prevCustName == value[1]) {
        prevSalesName = value[0] as string
        prevCustName = value[1] as string
        value[0] = ""
        value[1] = ""
        newDataCash.push(value)
      } else {
        prevSalesName = value[0] as string
        prevCustName = value[1] as string
        newDataCash.push(value)
      }
      
      if(index == lengthdata-1) {
        newDataCash.push([
          "", "", "", "Total", "", currentTotal, "", ""
        ])
      }
    })

    console.log(newDataCash)

    const dataKredit = kredit.map(q => {
      return [
        q.penagihan.invoice.namaSales,
        q.penagihan.invoice.customer.nama,
        dmyDate(q.caraBayar.tanggal),
        q.penagihan.invoice.transaksiId,
        roundDecimal(Number(q.penagihan.invoice.total)),
        roundDecimal(Number(q.jumlah)),
        toPascalCase(q.keterangan)
      ]
    })

    const sortedDataKredit = dataKredit.sort((a,b) => {
      return (a[0] as string).localeCompare(b[0] as string) || (a[1] as string).localeCompare(b[1] as string)
    })

    currentTotal = 0
    prevSalesName = ""
    prevCustName = ""
    lengthdata = sortedDataKredit.length

    sortedDataKredit.forEach((value, index) => {
      if(index != 0 && prevCustName != value[1] && prevSalesName == value[0] ) {
        newDataKredit.push([""])
      }


      if(currentTotal + (value[5] as number) > 100000000) {
        newDataKredit.push(["", "", "", "Total", "", currentTotal, "", ""])
        newDataKredit.push([""])
        newDataKredit.push([""])
        currentTotal = value[5] as number
        prevSalesName = value[0] as string
        prevCustName = value[1] as string
        newDataKredit.push(value)
        return
      }

      if((prevSalesName && prevSalesName != value[0])) {
        newDataKredit.push(["", "", "", "Total", "", currentTotal, "", ""])
        newDataKredit.push([""])
        newDataKredit.push([""])
        currentTotal = 0
      }

      currentTotal += (value[5] as number)

      if(prevSalesName && prevCustName && index != 0 && prevSalesName == value[0] && prevCustName == value[1]) {
        prevSalesName = value[0] as string
        prevCustName = value[1] as string
        value[0] = ""
        value[1] = ""
        newDataKredit.push(value)
      } else {
        prevSalesName = value[0] as string
        prevCustName = value[1] as string
        newDataKredit.push(value)
      }
      
      if(index == lengthdata-1) {
        newDataKredit.push([
          "", "", "", "Total", "", currentTotal, "", ""
        ])
      }
    })

    const titlePenagihan = dmyDate(tanggalPenagihan, "-")
    const titlePembayaran = dmyDate(tanggalPembayaran, "-")
    const title = `setoranbank_${titlePenagihan}_${titlePembayaran}.xlsx`

    const header = [
      ["SAP LAPORAN HADIRAN TAGIHAN"],
      [""],
      ["DATE : " + finaldatestr],
      [""],
      ["Nama Sales", "Customer Name", "Tgl Transaksi", "ID Transaksi", "Total Tagihan", "Cara bayar", "Ket"],
      ["", "", "", "", "", "Cash"],
      [""],
      [""],
      ["CASH"],
      [""],
      ...newDataCash,
      [""],
      [""],
      [""],
      ["KREDIT"],
      [""],
      ...newDataKredit
    ]

    const ranges = [
      { s: { c: 0, r: 4 }, e: { c: 0, r: 6 } },
      { s: { c: 1, r: 4 }, e: { c: 1, r: 6 } },
      { s: { c: 2, r: 4 }, e: { c: 2, r: 6 } },
      { s: { c: 3, r: 4 }, e: { c: 3, r: 6 } },
      { s: { c: 4, r: 4 }, e: { c: 4, r: 6 } },
      { s: { c: 6, r: 4 }, e: { c: 6, r: 6 } },

      { s: { c: 5, r: 5 }, e: { c: 5, r: 6 } },
    ]

    const sheetOptions = {
      '!merges': ranges,
      '!cols' : [{wch: 15}, {wch: 30}, {wch: 15}, {wch: 15}, {wch: 15}, {wch: 20}, {wch: 15}]
    };

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
      <p className="text-md font-bold mb-2">Export setoran bank</p>
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
