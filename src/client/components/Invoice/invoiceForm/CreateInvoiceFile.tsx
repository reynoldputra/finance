import Modal from "@client/components/modal/Modal";
import { Button } from "@client/components/ui/button";
import { Input } from "@client/components/ui/input";
import { useState, ChangeEvent } from "react";
import {
  TInputInvoiceFileArray,
  TInputInvoiceFileObject,
} from "../../../../server/collections/invoice/invoiceSchema";
import {
  TInputReturFileArray,
  TInputReturFileObject,
  inputReturFileArray,
} from "../../../../server/collections/retur/returSchema";

import { useToast } from "@client/components/ui/use-toast";

export default function CreateInvoiceFile() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [returArray, setReturArray] = useState<TInputReturFileArray[]>([]);
  const [invoiceArray, setInvoiceArray] = useState<TInputInvoiceFileArray[]>(
    []
  );
  const { toast } = useToast();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file ?? null);
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const fileText = event.target.result.toString();
          const perLine = fileText
            .split(/[\r\n]+/)
            .map((line) => line.split("\t"));
          perLine.splice(0, 10);
          const returTrans: TInputReturFileArray[] = [];
          const invoiceTrans: TInputInvoiceFileArray[] = [];
          for (const line of perLine) {
            if (line.length >= 28) {
              const total = parseFloat(line[4].replace(/[()Rp,.]/g, ""));
              const type = line[9];
              const [day, month, year] = line[0].split("/");
              const tanggalTransaksi = new Date(`${year}-${month}-${day}`);
              if (type.startsWith("Retur")) {
                const returTransaction: TInputReturFileObject = {
                  transaksiId: line[1],
                  noRetur: line[2],
                  tanggalTransaksi,
                  total,
                  type,
                };
                returTrans.push(returTransaction);
              } else {
                const invoiceTransaction: TInputInvoiceFileObject = {
                  transaksiId: line[1],
                  tanggalTransaksi,
                  namaCustomer: line[3],
                  total,
                  type,
                  namaSales: line[27],
                };
                invoiceTrans.push(invoiceTransaction);
              }
            }
          }
          setReturArray(returTrans);
          setInvoiceArray(invoiceTrans);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleOpenChange = () => {
    setShowConfirmModal(!showConfirmModal);
    setSelectedFile(null);
  };

  const handleConfirmSubmission = () => {
    if (returArray.length > 0) {
      console.log("invoice", invoiceArray);
      console.log("returr", returArray);
      const invoicePlural = invoiceArray.length > 1 ? "invoices" : "invoice";
      const returPlural = returArray.length > 1 ? "returs" : "retur";
      toast({
        description: `${returArray.length} ${returPlural} & ${invoiceArray.length} ${invoicePlural} successfully submitted.`,
        variant: "success",
        className: "text-white text-base font-semibold",
      });
    }
  };

  return (
    <Modal
      open={showConfirmModal}
      onOpenChange={handleOpenChange}
      buttonTitle="New Invoice File"
    >
      <div className="flex flex-col gap-y-3 m-2 mt-0">
        <span className="font-semibold text-xl">Input Invoice By File</span>
        <Input
          className="w-80 cursor-pointer"
          type="file"
          accept=".txt"
          onChange={handleFileChange}
        />
        {selectedFile && (
          <div className="flex flex-col gap-y-2">
            {(invoiceArray.length > 0 || returArray.length > 0) && (
              <>
                <p className="font-medium">
                  Please confirm the submission of the selected file.
                  {invoiceArray.length > 0 && (
                    <>
                      <p className="font-medium">
                        Invoice ({invoiceArray.length}) :
                      </p>
                      <code className="text-sm">
                        {JSON.stringify(invoiceArray)}
                      </code>{" "}
                    </>
                  )}
                  {returArray.length > 0 && (
                    <>
                      <p className="font-medium">
                        Retur ({returArray.length}) :
                      </p>
                      <code className="text-sm">
                        {JSON.stringify(returArray)}
                      </code>{" "}
                    </>
                  )}
                  <p>will be processed.</p>
                </p>
                <div className="flex gap-x-3">
                  <Button onClick={handleConfirmSubmission}>Confirm</Button>
                </div>
              </>
            )}
          </div>
        )}
        <Button
          className="mt-2 w-72"
          variant={"outline"}
          onClick={handleOpenChange}
        >
          Close
        </Button>
      </div>
    </Modal>
  );
}
