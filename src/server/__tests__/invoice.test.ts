import { expect, describe, it } from "@jest/globals";
import { CustomerService } from "../collections/customer/customerService";
import { InvoiceService } from "../collections/invoice/invoiceService";
import { ICustomerTable } from "../types/customer";
import { TCreateInvoiceInput, TUpdateInvoiceInput } from "../collections/invoice/invoiceSchema";

describe("Create invoice", () => {
  let customer: ICustomerTable;
  let newInvoice: TCreateInvoiceInput;

  beforeAll(async () => {
    customer = (await CustomerService.getCustomerTable())[0];
    newInvoice = {
      id: "oihokijoijjfogjdfokw",
      customerId: customer.id,
      namaSales: "sales name new",
      tanggalTransaksi: new Date(),
      total: 1000000,
    };
  });

  afterAll(async () => {
    if (newInvoice.id) await InvoiceService.deleteInvoice(newInvoice.id);
  });

  it("return invoice", async () => {
    const result = await InvoiceService.createInvoice(newInvoice);
    expect(result.customerId).toEqual(newInvoice.customerId);
    expect(result.namaSales).toEqual(newInvoice.namaSales);
    expect(result.total).toEqual(newInvoice.total);
    expect(result.tanggalTransaksi).toEqual(newInvoice.tanggalTransaksi);
  });
});

describe("Get all invoices", () => {
  it("should return invoices", async () => {
    const res = await InvoiceService.getAllInvoices();
    expect(res.length >= 1).toBe(true);
  });
});

describe("Delete invoice", () => {
  let customer: ICustomerTable;
  let newInvoice: TCreateInvoiceInput;

  beforeAll(async () => {
    customer = (await CustomerService.getCustomerTable())[0];
    newInvoice = {
      id: "asdfasdfasad",
      customerId: customer.id,
      namaSales: "sales name new",
      tanggalTransaksi: new Date(),
      total: 1000000,
    };
    await InvoiceService.createInvoice(newInvoice);
  });

  it("should delete one invoice", async () => {
    expect(newInvoice.id).toBeTruthy();
    const allInvoice = await InvoiceService.getAllInvoices();
    if (newInvoice.id) {
      const res = await InvoiceService.deleteInvoice(newInvoice.id);
      expect(res.id).toEqual(newInvoice.id);
      const allInvoice2 = await InvoiceService.getAllInvoices();
      expect(allInvoice.length - 1).toEqual(allInvoice2.length);
    }
  });
});

describe("Update invoice", () => {
  let customer: ICustomerTable;
  let newInvoice: TCreateInvoiceInput;
  let otherCustomer: ICustomerTable;

  beforeAll(async () => {
    const cust = await CustomerService.getCustomerTable();
    customer = cust[0];
    otherCustomer = cust[1];
    newInvoice = {
      id: "jnvnkcxnvkjckvjx",
      customerId: customer.id,
      namaSales: "sales name new",
      tanggalTransaksi: new Date(),
      total: 1000000,
    };
    await InvoiceService.createInvoice(newInvoice);
  });

  afterAll(async () => {
    if (newInvoice.id) await InvoiceService.deleteInvoice(newInvoice.id);
  });

  it("should delete invoice", async () => {
    expect(otherCustomer).toBeTruthy();
    expect(newInvoice).toBeTruthy();
    if (otherCustomer && newInvoice.id) {
      let updateInvoice: TUpdateInvoiceInput = {
        id: newInvoice.id,
        customerId: otherCustomer.id,
        namaSales: "sales updated",
        tanggalTransaksi: new Date(new Date().getTime() + 100 * 100),
        total: 121231231,
      };
      const res = await InvoiceService.updateInvoice(updateInvoice);
      expect(res.id).toEqual(updateInvoice.id);
      expect(res.namaSales).toEqual(updateInvoice.namaSales);
      expect(res.tanggalTransaksi).toEqual(updateInvoice.tanggalTransaksi);
      expect(res.total).toEqual(updateInvoice.total);
      expect(res.customerId).toEqual(updateInvoice.customerId);
    }
  });
});
