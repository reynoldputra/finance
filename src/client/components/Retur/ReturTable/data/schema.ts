import { z } from "zod";

export const returSchema = z.object({
  id: z.string(),
  noRetur: z.string(),
  tanggalTransaksi: z.date(),
  type: z.string(),
  keterangan: z.string(),
  total: z.number(),
  customerId: z.string(),
  customerName: z.string(),
  invoice: z.array(z.object({
    transaksiId: z.string(),
    invoiceId: z.string(),
    total: z.number(),
  }))
});

export type TReturSchema = z.infer<typeof returSchema>;
