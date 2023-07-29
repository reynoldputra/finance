import { expect, describe, it } from "@jest/globals";
import { InvoiceService } from "../collections/invoice/invoiceService";

describe("Test invoice router", () => {
  it("create new invoice", async () => {
    const newInvoice = {
      customerId: "clknq7ib50003uhqgtqupu3yz",
      namaSales: "testing sales",
      total: 1000000,
      tanggalTransaksi: new Date(),
    };

    const result = await InvoiceService.createInvoice(newInvoice);
    expect(result.customerId).toEqual(newInvoice.customerId)
    expect(result.namaSales).toEqual(newInvoice.namaSales)
    expect(result.total).toEqual(newInvoice.total)
    expect(result.tanggalTransaksi).toEqual(newInvoice.tanggalTransaksi)
  });
});
