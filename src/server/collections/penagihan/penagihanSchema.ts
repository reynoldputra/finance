import { z } from "zod";

export const createPenagihanInput = z.object({
  invoiceId : z.string(),
  tanggalTagihan : z.date(),
  kolektorId : z.string()
})

export const updatePenagihanInput = z.object({
  penagihanId : z.string(),
  invoiceId : z.string(),
  tanggalTagihan : z.date(),
  kolektorId : z.string()
})

export type TCreatePenagihanInput = z.infer<typeof createPenagihanInput>;
export type TUpdatePenagihanInput = z.infer<typeof updatePenagihanInput>;
