import { z } from "zod";

export const returSchema = z.object({
  id: z.string(),
  noRetur: z.string(),
  transaksiId: z.string(),
  tanggalTransaksi: z.date(),
  type: z.string(),
  total: z.number(),
  invoiceId: z.string().nullable(),
});

export type TReturSchema = z.infer<typeof returSchema>;
