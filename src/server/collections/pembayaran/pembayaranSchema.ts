import { z } from "zod";
import { createCaraBayarInput } from "../caraBayar/caraBayarSchema";

export const caraBayarLama = z.object({
  id: z.string(),
  totalDistribusi: z.coerce.number(),
});

export const distribusiPembayaran = z.object({
  penagihanId : z.string(),
  total : z.coerce.number()
})

export const createPembayaranWithCarabayarInput = z.object({
  carabayar : createCaraBayarInput,
  distribusi : z.array(distribusiPembayaran)
});

export const updatePemabayaranInput = z.object({
  penagihanId: z.string(),
  caraBayarBaru: z
    .array(
      createCaraBayarInput.extend({
        totalDistribusi: z.number(),
      })
    )
    .optional(),
  caraBayarLama: z.array(caraBayarLama).optional()
});

export type TCreatePembayaranInput = z.infer<typeof createPembayaranWithCarabayarInput>;
export type TCaraBayarLama = z.infer<typeof caraBayarLama>;
export type TUpdatePembayaranInput = z.infer<typeof updatePemabayaranInput>;
