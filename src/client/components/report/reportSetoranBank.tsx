import { Button } from "@client/components/ui/button"
import xlsx from "node-xlsx"
import { dialog } from "electron"

export default function ReportSetoranBank() {

  const clickHandle = () => {
    const header = [
      ["SAP LAPORAN HADIRAN TAGIHAN"],
      [""],
      ["DATE : 30 MEI 2023"],
      [""],
      ["Nama Sales", "Customer Name", "Tgl Transaksi", "ID Transaksi", "Total Tagihan", "Cara bayar", "Ket"],
      ["", "", "", "", "", "Cash"]
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

    const sheetOptions = { '!merges': ranges };

    var buffer = xlsx.build([{ name: 'mySheetName', data: header, options: sheetOptions }]);

    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'report.xlsx';
    a.click();

    URL.revokeObjectURL(url);
  }

  return (
    <Button className="w-32" onClick={clickHandle}>
      <p>Report Setoran Bank</p>
    </Button>
  )
}
