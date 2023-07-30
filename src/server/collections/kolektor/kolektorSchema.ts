import { z } from "zod";

export const createKolektorInput = z.object({
  id: z.string().optional(),
  nama: z.string(),
});

export const updateKolektorInput = z.object({
  id: z.string(),
  nama: z.string(),
});

export type TCreateKolektorInput = z.infer<typeof createKolektorInput>;
export type TUpdateKolektorInput = z.infer<typeof updateKolektorInput>;
