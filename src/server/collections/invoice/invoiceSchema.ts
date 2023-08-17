import { z } from "zod";

export const createInvoiceInput = z.object({
  id: z.string(),
  transaksiId: z.string(),
  namaSales: z.string(),
  tanggalTransaksi: z.date(),
  customerId: z.string(),
  total: z.coerce.number(),
  // type: z.string(),
});

export const updateInvoiceInput = z.object({
  id: z.string(),
  transaksiId: z.string(),
  namaSales: z.string(),
  tanggalTransaksi: z.date(),
  customerId: z.string(),
  total: z.number(),
  // type: z.string(),
});

export type TCreateInvoiceInput = z.infer<typeof createInvoiceInput>;
export type TUpdateInvoiceInput = z.infer<typeof updateInvoiceInput>;
