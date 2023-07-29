import { prisma } from "../../prisma";
import { PrismaClient } from "../../../generated/client";
import { TCreateInvoiceInput } from "./invoiceSchema";

export class InvoiceService {
  public static async createInvoice (invoice : TCreateInvoiceInput) {
    const res = await prisma.invoice.create({
      data : {
        id : invoice.id,
        customerId : invoice.customerId,
        tanggalTransaksi : invoice.tanggalTransaksi,
        namaSales : invoice.namaSales,
        total : invoice.total
      }
    })
    return res
  }
}
