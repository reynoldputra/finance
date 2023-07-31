import { prisma } from "../../prisma";
import { Prisma } from "../../../generated/client";
import { TCreateInvoiceInput, TUpdateInvoiceInput } from "./invoiceSchema";

export class InvoiceService {
  public static async createInvoice(invoice: TCreateInvoiceInput) {
    const res = await prisma.invoice.create({
      data: {
        id: invoice.id,
        customerId: invoice.customerId,
        tanggalTransaksi: invoice.tanggalTransaksi,
        namaSales: invoice.namaSales,
        total: invoice.total,
      },
    });
    return res;
  }

  public static async getAllInvoices() {
    const res = await prisma.invoice.findMany();
    return res;
  }

  public static async updateInvoice(invoice : TUpdateInvoiceInput) {
    let updateData : Prisma.InvoiceUncheckedUpdateInput = {}
    if(invoice.customerId) updateData.customerId = invoice.customerId
    if(invoice.namaSales) updateData.namaSales = invoice.namaSales
    if(invoice.total) updateData.total = invoice.total
    if(invoice.tanggalTransaksi) updateData.tanggalTransaksi = invoice.tanggalTransaksi

    const res = await prisma.invoice.update({
      where : {id : invoice.id},
      data : updateData
    })

    return res
  }

  public static async deleteInvoice(id: string) {
    const res = await prisma.invoice.delete({
      where: {
        id,
      },
    });

    return res;
  }
}
