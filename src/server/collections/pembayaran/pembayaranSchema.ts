import { z } from "zod";
import { createCaraBayarInput } from "../caraBayar/caraBayarSchema";

export const caraBayarLama = z.object({
  id: z.string(),
  totalDistribusi: z.number(),
});

export const createPembayaranInput = z.object({
  penagihanId: z.string(),
  caraBayarBaru: z
    .array(
      createCaraBayarInput.extend({
        totalDistribusi: z.number(),
      })
    )
    .optional(),
  caraBayarLama: z.array(caraBayarLama).optional(),
  jumlah: z.number(),
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

export type TCreatePembayaranInput = z.infer<typeof createPembayaranInput>;
export type TCaraBayarLama = z.infer<typeof caraBayarLama>;
export type TUpdatePembayaranInput = z.infer<typeof updatePemabayaranInput>;
