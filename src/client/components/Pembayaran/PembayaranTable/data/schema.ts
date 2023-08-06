import { z } from "zod";

const giroSchema = z.object({
  bank: z.string(),
  nomor: z.string(),
  jatuhTempo: z.date(),
});

const transferSchema = z.object({
  bank: z.string(),
});

export const pembayaranSchema = z.object({
  id: z.string(),
  metodePembayaran: z.string(),
  total: z.number(),
  namaCustomer : z.string(),
  customerId : z.string(),
  tanggalPembayaran : z.date(),
  jumlahDistribusi: z.number(),
  tandaTerima: z.boolean(),
  detailPembayaran: z.union([giroSchema, transferSchema]).optional(),
});

export type TPembayaranSchema = z.infer<typeof pembayaranSchema>;
