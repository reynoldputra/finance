import { z } from "zod";

export const createGiroInput = z.object({
  bank: z.string(),
  nomor: z.string(),
  jatuhTempo: z.date(),
});

export const createTransferInput = z.object({
  bank: z.string(),
});

export const createCaraBayarInput = z.object({
  total: z.coerce.number(),
  tandaTerima: z.boolean().default(false),
  tanggal : z.date(),
  keterangan : z.string().optional(),
  pembayaran: z.object({
    giro: createGiroInput.optional(),
    transfer: createTransferInput.optional(),
  }),
});

export const updateCaraBayarInput = z.object({
  id: z.string(),
  keterangan: z.string(),
  total: z.number(),
  tandaTerima: z.boolean(),
  tanggal : z.date(),
  pembayaran: z.object({
    giro: createGiroInput.optional(),
    transfer: createTransferInput.optional(),
  }).optional(),
});

export type TCreateCaraBayarInput = z.infer<typeof createCaraBayarInput>;
export type TCreateGiroInput = z.infer<typeof createGiroInput>;
export type TCreateTransferInput = z.infer<typeof createTransferInput>;
export type TUpdateCaraBayarInput = z.infer<typeof updateCaraBayarInput>;
