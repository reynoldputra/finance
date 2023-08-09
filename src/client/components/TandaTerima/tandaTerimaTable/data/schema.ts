import { z } from "zod";

export const tandaTerimaTable = z.object({
  id: z.string(),
  namaCustomer: z.string(),
  // alamat: z.string(),
  // tanggalTT: z.date(),
  jumlahInvoice: z.number(),
  // invoices: z.array(
  //   z.object({
  //     transaksiId: z.string(),
  //     total: z.number(),
  //     tanggalTransaksi: z.date(),
  //   })
  // ),
});

export type TTandaTerimaTable = z.infer<typeof tandaTerimaTable>;
