import { z } from "zod";

export const createGiroInput = z.object({
  bank : z.string(),
  nomor : z.string(),
  jatuhTempo : z.date()
})

export const createTransferInput = z.object({
  tanggal : z.date()
})

export const createCaraBayarInput = z.object({
  total : z.number(),
  tandaTerima : z.boolean().default(false),
  pembayaran : z.union([ createGiroInput, createTransferInput])
})

export const updateCaraBayarInput = z.object({
  id : z.string(),
  total : z.number().optional(),
  tandaTerima : z.boolean().optional(),
  pembayaran : z.union([createGiroInput, createTransferInput]).optional()
})

export type TCreateCaraBayarInput = z.infer<typeof createCaraBayarInput>;
export type TCreateGiroInput = z.infer<typeof createGiroInput>;
export type TCreateTransferInput = z.infer<typeof createTransferInput>;
export type TUpdateCaraBayarInput = z.infer<typeof updateCaraBayarInput>;
