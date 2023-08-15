import { z } from "zod";

export const penagihanTableSchema = z.object({
  id: z.string(),
  transaksiId: z.string(),
  tanggalTagihan: z.date(),
  status: z.string(),
  sisa: z.number(),
  namaKolektor: z.string(),
  kolektorId: z.string(),
  namaCustomer: z.string(),
  customerId: z.string(),
  tandaTerima: z.boolean().optional(),
  totalPembayaran: z.number(),
  cash: z.number(),
  transfer: z.number(),
  giro: z.number(),
});

export type TPenagihanTable = z.infer<typeof penagihanTableSchema>;
