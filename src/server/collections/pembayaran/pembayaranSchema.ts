import { z } from "zod";
import { createCaraBayarInput, updateCaraBayarInput } from "../caraBayar/caraBayarSchema";

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

export const updatePemabayaranWithCarabayarInput = z.object({
  carabayar : updateCaraBayarInput,
  distribusi : z.array(distribusiPembayaran)
});

export type TCreatePembayaranInput = z.infer<typeof createPembayaranWithCarabayarInput>;
export type TCaraBayarLama = z.infer<typeof caraBayarLama>;
export type TUpdatePembayaranInput = z.infer<typeof updatePemabayaranWithCarabayarInput>;
export type TDistribusiPembayaran = z.infer<typeof distribusiPembayaran>;

