import { z } from "zod";

export const createInvoiceInput = z.object({
  transaksiId: z.string(),
  namaSales: z.string(),
  tanggalTransaksi: z.date(),
  customerId: z.string(),
  total: z.coerce.number(),
  type: z.string(),
});

export const updateInvoiceInput = z.object({
  id: z.string(),
  transaksiId: z.string(),
  namaSales: z.string(),
  tanggalTransaksi: z.date(),
  customerId: z.string(),
  total: z.number(),
  type: z.string(),
});

export const inputInvoiceFileObject = z.object({
  transaksiId: z.string(),
  namaSales: z.string(),
  tanggalTransaksi: z.date(),
  namaCustomer: z.string(),
  total: z.number(),
  type: z.string(),
});

export const inputInvoiceFileArray = z.array(inputInvoiceFileObject);

export type TCreateInvoiceInput = z.infer<typeof  createInvoiceInput>;
export type TUpdateInvoiceInput = z.infer<typeof updateInvoiceInput>;
export type TInputInvoiceFileArray = z.infer<typeof inputInvoiceFileArray>;
export type TInputInvoiceFileObject = z.infer<typeof inputInvoiceFileObject>;