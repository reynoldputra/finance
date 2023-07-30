import { z } from "zod";

export const createPenagihanInput = z.object({
  invoiceId : z.string(),
  tanggalTagihan : z.date(),
  kolektorId : z.string()
})

export const updatePenagihanInput = z.object({
  distribusiPembayaranId : z.string(),
  invoiceId : z.string().optional(),
  tanggalTagihan : z.date().optional(),
  kolektorId : z.string().optional()
})

export type TCreatePenagihanInput = z.infer<typeof createPenagihanInput>;
export type TUpdatePenagihanInput = z.infer<typeof updatePenagihanInput>;
