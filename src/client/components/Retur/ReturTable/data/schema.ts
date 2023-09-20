import { z } from "zod";

export const returSchema = z.object({
  id: z.string(),
  noRetur: z.string(),
  tanggalTransaksi: z.date(),
  type: z.string(),
  total: z.number(),
  invoice : z.array(z.object({
    transaksiId: z.string(),
    total : z.number(),
  }))
});

export type TReturSchema = z.infer<typeof returSchema>;
