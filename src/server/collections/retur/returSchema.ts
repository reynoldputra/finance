import { z } from "zod";

export const inputReturFileObject = z.object({
  transaksiId: z.string(),
  noRetur: z.string(),
  tanggalTransaksi: z.date(),
  total: z.number(),
  type: z.string(),
});

export const inputReturFileArray = z.array(inputReturFileObject);

export type TInputReturFileArray = z.infer<typeof inputReturFileArray>;
export type TInputReturFileObject = z.infer<typeof inputReturFileObject>;
