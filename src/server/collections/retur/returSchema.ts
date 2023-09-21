import { z } from "zod";

export const inputReturFileObject = z.object({
  transaksiId: z.string(),
  noRetur: z.string(),
  tanggalTransaksi: z.date(),
  total: z.number(),
  type: z.string(),
});

export const inputReturFileArray = z.array(inputReturFileObject);

export const createReturInvoiceInput = z.object({
  keterangan: z.string().optional(),
  noRetur: z.string(),
  tanggalTransaksi: z.date(),
  type: z.string(),
  invoice: z.array(z.object({
    invoiceId: z.string(),
    total: z.number()
  }))
})

export type TInputReturFileArray = z.infer<typeof inputReturFileArray>;
export type TInputReturFileObject = z.infer<typeof inputReturFileObject>;
export type TCreateReturInvoiceInput = z.infer<typeof createReturInvoiceInput>;
