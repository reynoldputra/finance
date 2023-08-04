import { z } from "zod";

export const createInvoiceInput = z.object({
  id: z.string(),
  transaksiId: z.string(),
  namaSales: z.string(),
  tanggalTransaksi: z.date(),
  customerId: z.string(),
  total: z.coerce.number(),
});

export const updateInvoiceInput = z.object({
  id: z.string(),
  transaksiId: z.string(),
  namaSales: z.string(),
  tanggalTransaksi: z.date(),
  customerId: z.string(),
  total: z.number(),
});

export type TCreateInvoiceInput = z.infer<typeof createInvoiceInput>;
export type TUpdateInvoiceInput = z.infer<typeof updateInvoiceInput>;
