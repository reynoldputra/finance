import { prisma } from "../../prisma";
import { Prisma } from "../../../generated/client";
import { TCreateInvoiceInput, TUpdateInvoiceInput } from "./invoiceSchema";

export class InvoiceService {
  public static async createInvoice(invoice: TCreateInvoiceInput) {
    const res = await prisma.invoice.create({
      data: {
        id: invoice.id,
        transaksiId : invoice.transaksiId,
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
        transaksiId : inv.transaksiId,
        tanggalTransaksi : new Date(inv.tanggalTransaksi),
        namaSales : inv.namaSales,
        status : (inv.total - totalPembayaran > 0 ) ? "BELUM" : "LUNAS",
        namaCustomer : inv.customer.nama,
        customerId : inv.customer.id,
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

    const res = await prisma.invoice.update({
      where: { id: invoice.id },
      data: invoice,
    });

    return res;
  }

  public static async deleteInvoice(id: string) {
    const cek = await prisma.invoice.findFirst({
      where : {
        id
      },
      include : {
        penagihan : true
      }
    })

    if(cek?.penagihan.length) {
      throw new Error("Terdapat pembayaran yang terhubung ke invoice ini")
    }

    const res = await prisma.invoice.delete({
      where: {
        id,
      },
    });

    return res;
  }
}
