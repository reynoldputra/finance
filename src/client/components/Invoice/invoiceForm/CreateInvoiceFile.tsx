import Modal from "@client/components/modal/Modal";
import { Button } from "@client/components/ui/button";
import { Input } from "@client/components/ui/input";
import React, { useState, ChangeEvent } from "react";
import {
  TInputInvoiceFileArray,
  TInputInvoiceFileObject,
} from "../../../../server/collections/invoice/invoiceSchema";
import {
  TInputReturFileArray,
  TInputReturFileObject,
} from "../../../../server/collections/retur/returSchema";
import { idr } from "@client/lib/idr";
import { useToast } from "@client/components/ui/use-toast";
import { trpc } from "@client/lib/trpc";
import { dmyDate } from "@client/lib/dmyDate";

export default function CreateInvoiceFile() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [returArray, setReturArray] = useState<TInputReturFileArray>([]);
  const [invoiceArray, setInvoiceArray] = useState<TInputInvoiceFileArray>([]);
  const [invoiceValidation, setInvoiceValidation] = useState<{
    [transaksiId: string]: boolean;
  }>({});
  const [returValidation, setReturValidation] = useState<{
    [transaksiId: string]: boolean;
  }>({});
  const [existingRetur, setExistingRetur] = useState<string[]>([]);
  const { toast } = useToast();

  const { data: allInvoiceData } = trpc.invoice.getInvoices.useQuery();
  const allInvoice = allInvoiceData?.data ?? [];
  const existingInvoiceTransaksiId = allInvoice.map((inv) => inv.transaksiId);

  const { data: allReturData } = trpc.retur.getAllRetur.useQuery();
  const allRetur = allReturData?.data ?? [];
  const existingNoRetur = allRetur.map((retur) => retur.noRetur);

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
          perLine.splice(0, 7);
          const returTrans: TInputReturFileArray = [];
          const invoiceTrans: TInputInvoiceFileArray = [];
          for (const line of perLine) {
            if (line.length >= 28) {
              const total = parseFloat(line[4].replace(/[()Rp,.]/g, ""));
              const type = line[9];
              const [day, month, year] = line[0].split("/");
              const tanggalTransaksi = new Date(`${year}-${month}-${day}`);
              if (line[9].startsWith("Retur")) {
                if (existingInvoiceTransaksiId.includes(line[1])) {
                  setReturValidation((prevValidation) => ({
                    ...prevValidation,
                    [line[1]]: false,
                  }));
                } else if (existingNoRetur.includes(line[2])) {
                  setReturValidation((prevValidation) => ({
                    ...prevValidation,
                    [line[1]]: true,
                  }));
                } else {
                  setReturValidation((prevValidation) => ({
                    ...prevValidation,
                    [line[1]]: true,
                  }));
                }
                const returTransaction: TInputReturFileObject = {
                  transaksiId: line[1],
                  noRetur: line[2],
                  tanggalTransaksi,
                  total,
                  type: line[9],
                };
                returTrans.push(returTransaction);
              } else {
                if (existingInvoiceTransaksiId.includes(line[1])) {
                  setInvoiceValidation((prevValidation) => ({
                    ...prevValidation,
                    [line[1]]: false,
                  }));
                } else {
                  setInvoiceValidation((prevValidation) => ({
                    ...prevValidation,
                    [line[1]]: true,
                  }));
                }
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

  const utils = trpc.useContext();
  const createReturMutation = trpc.retur.createReturFromFile.useMutation();
  const createInvoiceMutation =
    trpc.invoice.createInvoiceFromFile.useMutation();

  const handleConfirmSubmission = async () => {
    try {
      const resRetur = await createReturMutation.mutateAsync(returArray);
      const resInvoice = await createInvoiceMutation.mutateAsync(invoiceArray);
      if (resRetur.data && resInvoice.data) {
        const invoicePlural = invoiceArray.length > 1 ? "Invoices" : "Invoice";
        const returPlural = returArray.length > 1 ? "Returs" : "Retur";
        toast({
          description: `${returArray.length} ${returPlural} & ${invoiceArray.length} ${invoicePlural} successfully submitted.`,
          variant: "success",
          className: "text-white text-base font-semibold",
        });
        utils.retur.invalidate();
        handleOpenChange();
      }
    } catch (err) {
      console.error("Terjadi kesalahan:", err);
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
                </p>
                {invoiceArray.length > 0 && (
                  <>
                    <p className="font-medium">
                      Invoice ({invoiceArray.length}) :
                    </p>
                    <div className="max-w-2xl overflow-x-scroll">
                      <div className="w-[1250px] grid grid-cols-6 gap-2 mb-2">
                        <div className="font-semibold">Transaksi ID</div>
                        <div className="font-semibold">Tanggal Transaksi</div>
                        <div className="font-semibold">Nama Customer</div>
                        <div className="font-semibold">Nama Sales</div>
                        <div className="font-semibold">Total</div>
                        <div className="font-semibold">Tipe</div>
                      </div>
                      <div className="flex flex-col gap-y-2">
                        {invoiceArray.map((invoice) => (
                          <div
                            className={`w-[1250px] grid grid-cols-6 gap-y-2 ${
                              invoiceValidation[invoice.transaksiId] === false
                                ? "bg-red-200"
                                : ""
                            }`}
                            key={invoice.transaksiId}
                          >
                            <div>{invoice.transaksiId}</div>
                            <div>
                              {dmyDate(new Date(invoice.tanggalTransaksi))}
                            </div>
                            <div>{invoice.namaCustomer}</div>
                            <div>{invoice.namaSales}</div>
                            <div>Rp. {idr(invoice.total)}</div>
                            <div>{invoice.type}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
                {returArray.length > 0 && (
                  <>
                    <p className="font-medium">Retur ({returArray.length}) :</p>
                    <div className="max-w-2xl overflow-x-scroll">
                      <div className="w-[1100px] grid grid-cols-5 gap-2 mb-2">
                        <div className="font-semibold">Transaksi ID</div>
                        <div className="font-semibold">No. Retur</div>
                        <div className="font-semibold">Tanggal Transaksi</div>
                        <div className="font-semibold">Total</div>
                        <div className="font-semibold">Tipe</div>
                      </div>
                      <div className="flex flex-col gap-y-2">
                        {returArray.map((retur) => (
                          <div
                            className={`w-[1100px] grid grid-cols-5 gap-y-2 ${
                              returValidation[retur.transaksiId] === true ||
                              existingNoRetur.includes(retur.noRetur)
                                ? "bg-red-200"
                                : ""
                            }`}
                            key={retur.transaksiId}
                          >
                            <div>{retur.transaksiId}</div>
                            <div>{retur.noRetur}</div>
                            <div>
                              {dmyDate(new Date(retur.tanggalTransaksi))}
                            </div>
                            <div>Rp. {idr(retur.total)}</div>
                            <div>{retur.type}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
                <div className="flex gap-x-5 mt-2">
                  <Button
                    className="w-36"
                    variant={"outline"}
                    onClick={handleOpenChange}
                  >
                    Close
                  </Button>
                  <Button
                    className="w-36"
                    onClick={handleConfirmSubmission}
                    disabled={
                      Object.values(invoiceValidation).some(
                        (valid) => !valid
                      ) || Object.values(returValidation).some((valid) => valid)
                    }
                  >
                    Confirm
                  </Button>
                </div>
              </>
            )}
          </div>
        )}{" "}
        <Button
          className={`mt-2 w-72 ${selectedFile && "hidden"}`}
          variant={"outline"}
          onClick={handleOpenChange}
          disabled={Object.values(invoiceValidation).some((valid) => valid)}
        >
          Close
        </Button>
      </div>
    </Modal>
  );
}
