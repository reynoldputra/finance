import { z } from "zod";

export const createInvoiceInput = z.object({
  id: z.string().optional(),
  namaSales: z.string(),
  tanggalTransaksi: z.date(),
  customerId: z.string(),
  total: z.number(),
});

export type TCreateInvoiceInput = z.infer<typeof createInvoiceInput>;
