import { Table } from "@tanstack/react-table"
import { TReturSchema } from "./data/schema";
import { Button } from "@client/components/ui/button";
import { dmyDate, parseDmy } from "@client/lib/dmyDate";
import xlsx from "node-xlsx"


interface ExportReturnProps {
  table: Table<TReturSchema>
}



const ExportRetur = ({ table }: ExportReturnProps) => {
  const handleClick = () => {
    const selectedRows = table.getGroupedSelectedRowModel().rows;
    const originalRowValue = selectedRows.map((s) => s.original)
    console.log(originalRowValue)

    let value : (string | number)[][] = []

    originalRowValue.forEach(r => {
      const header = [dmyDate(r.tanggalTransaksi), r.customerName, r.type, r.invoice.length, r.noRetur, r.total, r.keterangan]

      r.invoice.forEach(i => {
        value.push([
          ...header,
          i.transaksiId,
          i.total
        ])
      })
    })
    
    value = value.sort((a,b) => {
      return (
        parseDmy(a[0] as string).getTime() - parseDmy(b[0] as string).getTime() ||
        (a[1] as string).localeCompare(b[1] as string) ||
        (a[2] as string).localeCompare(b[2] as string) ||
        a[3].toString().localeCompare(b[3] as string) ||
        (a[4] as string).localeCompare(b[4] as string) ||
        a[5].toString().localeCompare(b[5] as string) ||
        (a[6] as string).localeCompare(b[6] as string) 
      )
    })

    let prev : (string | number)[] = []

    value = value.map((v) => {
      let a = v
      let b = prev
      prev = [...v]

      if(b[0] && a[0] == b[0]) {
        a[0] = ""

        if(b[1] && a[1] == b[1]) {
          a[1] = ""
        }
      }

      return a
    })

    const header = [
      ["", "", "", "", "", "", "", "", ""],
      ["Tanggal Transaksi", "Customer Name", "Tipe", "Banyak Invoice", "No Retur", "Total Retur", "Keterangan", "Transaksi ID", "Jumlah"],
      ...value
    ]

    const sheetOptions = {
      '!cols': [{ wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }]
    };


    var buffer = xlsx.build([{ name: 'mySheetName', data: header, options: sheetOptions }]);

    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `export return.xlsx`;
    a.click();

    URL.revokeObjectURL(url);
  }

  return (
    <Button
      type="button"
      onClick={handleClick}
      disabled={
        !(table.getIsSomeRowsSelected() || table.getIsAllRowsSelected())
      }
      variant="outline"
    >
      Export
    </Button>
  )
}

export default ExportRetur
