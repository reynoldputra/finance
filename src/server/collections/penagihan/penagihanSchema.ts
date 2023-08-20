import { z } from "zod";

export const createPenagihanInput = z.object({
  invoiceId : z.string(),
  tanggalTagihan : z.date(),
  kolektorId : z.string()
})

export const manyPenagihanInput = createPenagihanInput.extend({
  status: z.string(),
})

export const updatePenagihanInput = z.object({
  penagihanId : z.string(),
  invoiceId : z.string(),
  tanggalTagihan : z.date(),
  kolektorId : z.string(),
  status : z.string()
})

export const updateTT = z.object({
  id: z.string(),
  value: z.boolean(),
})

export type TCreatePenagihanInput = z.infer<typeof createPenagihanInput>;
export type TUpdatePenagihanInput = z.infer<typeof updatePenagihanInput>;
export type TUpdateTT = z.infer<typeof updateTT>;
export type TManyPenagihanInput = z.infer<typeof manyPenagihanInput>