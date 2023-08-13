import { z } from "zod";

export const tandaTerimaTable = z.object({
  id: z.string(),
  namaCustomer: z.string(),
  alamat: z.string(),
  tanggalTT: z.date(),
  jumlahInvoice: z.number(),
});

export const createTandaTerimaInput = z.object({
  id: z.string().optional(),
  manyInvoiceId: z.array(z.string()),
  tanggalTT: z.date(),
});

export const updateTandaTerimaInput = z.object({
  id: z.string(),
  manyInvoiceId: z.array(z.string()),
  tanggalTT: z.date(),
})

export type TTandaTerimaTable = z.infer<typeof tandaTerimaTable>;
export type TCreateTandaTerimaInput = z.infer<typeof createTandaTerimaInput>;
export type TUpdateTandaTerimaInput = z.infer<typeof updateTandaTerimaInput>;