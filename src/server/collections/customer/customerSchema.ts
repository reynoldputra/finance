import { z } from "zod";

export const createCustomerInput = z.object({
  id: z.string(),
  nama: z.string(),
  currentKolektor: z.string(),
});

export const deleteCustomerInput = z.string()

export type TCreateCustomerInput = z.infer<typeof createCustomerInput>;
export type TDeleteCustomerInput = z.infer<typeof deleteCustomerInput>
