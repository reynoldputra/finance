import { z } from "zod";

export const invoiceSchema = z.object({
    id: z.string(),
    transaksiId: z.string(),
    sisa: z.number(),
    total: z.number(),
    tanggalTransaksi: z.date(),
    namaSales: z.string(),
    namaCustomer: z.string(),
    status: z.string()
})

export type TInvoiceSchema = z.infer<typeof invoiceSchema>
