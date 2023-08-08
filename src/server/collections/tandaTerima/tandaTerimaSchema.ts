import { z } from "zod";

export const tandaTerimaTable = z.object({
  id: z.string(),
  nama_customer: z.string(),
  // alamat: z.string(),
  // tanggalTT: z.date(),
  jumlahInvoice: z.number(),
  invoices: z.object({
    transaksiId: z.string(),
    total: z.number(),
    tanggalTransaksi: z.date(),
  }),
});
