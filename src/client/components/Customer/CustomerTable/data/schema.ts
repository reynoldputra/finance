import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const customerSchema = z.object({
  id: z.string(),
  nama: z.string(),
  kolektorNama: z.string(),
  invoiceAktif: z.string(),
  jumlahTagihan: z.string(),
})

export type Customer = z.infer<typeof customerSchema>
