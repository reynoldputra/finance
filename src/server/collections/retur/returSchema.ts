import { z } from "zod";

export const inputReturFileObject = z.object({
  transaksiId: z.string(),
  noRetur: z.string(),
  tanggalTransaksi: z.date(),
  total: z.number(),
  type: z.string(),
  invoiceId: z.string().optional(),
});

export const inputReturFileArray = z.array(inputReturFileObject);

export const updateReturInput = inputReturFileObject.extend({
  id: z.string(),
  invoiceId: z.string().optional(),
});

export const createReturInput = inputReturFileObject.extend({
  invoiceId: z.string().optional(),
});

export type TInputReturFileArray = z.infer<typeof inputReturFileArray>;
export type TInputReturFileObject = z.infer<typeof inputReturFileObject>;
export type TUpdateReturInput = z.infer<typeof updateReturInput>;
export type TCreateReturInput = z.infer<typeof createReturInput>;
