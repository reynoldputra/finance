import { z } from "zod";

export const createCustomerInput = z.object({
  id: z.string().optional(),
  nama: z.string(),
  kolektorId: z.string(),
  alamat: z.string().optional(),
});

export const updateCustomerInput = z.object({
  id: z.string(),
  nama: z.string().optional(),
  kolektorId: z.string().optional(),
  alamat: z.string().optional(),
});

export const kolektorOption = z.object({
  title: z.string(),
  value: z.string(),
});

export type TCreateCustomerInput = z.infer<typeof createCustomerInput>;
export type TUpdateCustomerInput = z.infer<typeof updateCustomerInput>;
export type TKolektorOption = z.infer<typeof kolektorOption>;