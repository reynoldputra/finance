import { z } from "zod";

export const createCustomerInput = z.object({
  id: z.string().optional(),
  nama: z.string(),
  currentKolektor: z.string(),
});

export const updateCustomerInput = z.object({
  id: z.string(),
  nama: z.string(),
  currentKolektor: z.string(),
});

export type TCreateCustomerInput = z.infer<typeof createCustomerInput>;
export type TUpdateCustomerInput = z.infer<typeof updateCustomerInput>