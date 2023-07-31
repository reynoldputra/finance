import { z } from "zod";

export const createInvoiceInput = z.object({
  id: z.string().optional(),
  namaSales: z.string(),
  tanggalTransaksi: z.date(),
  customerId: z.string(),
  total: z.number(),
});

export const updateInvoiceInput = z.object({
  id: z.string(),
  namaSales: z.string().optional(),
  tanggalTransaksi: z.date().optional(),
  customerId: z.string().optional(),
  total: z.number().optional(),
});

export type TCreateInvoiceInput = z.infer<typeof createInvoiceInput>;
export type TUpdateInvoiceInput = z.infer<typeof updateInvoiceInput>;
