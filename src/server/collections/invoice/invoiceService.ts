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
    const res = await prisma.invoice.findMany({
      include: {
        penagihan: {
          include: {
            distribusiPembayaran: true,
          },
        },
        customer : true
      },
    });
    const parsed = [];
    for (let idx in res) {
      const inv = res[idx];
      const totalPembayaran = inv.penagihan.reduce((tot, cur) => {
        const totalPenagihan = cur.distribusiPembayaran.reduce((tot, cur) => {
          return (tot += cur.jumlah);
        }, 0);

        return (tot += totalPenagihan);
      }, 0);

      parsed.push({
        sisa : inv.total - totalPembayaran,
        id : inv.id,
        tanggalTransaksi : new Date(inv.tanggalTransaksi),
        namaSales : inv.namaSales,
        status : (inv.total - totalPembayaran > 0 ) ? "BELUM" : "LUNAS",
        namaCustomer : inv.customer.nama,
        total : inv.total
      });
    }

    return parsed;
  }

  public static async getInvoice(id: string) {
    const res = await prisma.invoice.findFirstOrThrow({
      where: {
        id,
      },
      include: {
        penagihan: {
          include: {
            distribusiPembayaran: true,
          },
        },
        customer : true
      },
    });
    const totalPembayaran = res.penagihan.reduce((tot, cur) => {
      const totalPenagihan = cur.distribusiPembayaran.reduce((tot, cur) => {
        return (tot += cur.jumlah);
      }, 0);

      return (tot += totalPenagihan);
    }, 0);

    return {
      ...res,
      namaCustomer : res.customer.nama,
      sisa : res.total - totalPembayaran
    };
  }

  public static async updateInvoice(invoice: TUpdateInvoiceInput) {
    let updateData: Prisma.InvoiceUncheckedUpdateInput = {};
    if (invoice.customerId) updateData.customerId = invoice.customerId;
    if (invoice.namaSales) updateData.namaSales = invoice.namaSales;
    if (invoice.total) updateData.total = invoice.total;
    if (invoice.tanggalTransaksi) updateData.tanggalTransaksi = invoice.tanggalTransaksi;

    const res = await prisma.invoice.update({
      where: { id: invoice.id },
      data: updateData,
    });

    return res;
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
