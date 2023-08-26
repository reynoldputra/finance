import { prisma } from "../../prisma";
import { Invoice, Prisma } from "../../../generated/client";
import {
  TCreateInvoiceInput,
  TInputInvoiceFileArray,
  TUpdateInvoiceInput,
} from "./invoiceSchema";

export class InvoiceService {
  public static async createInvoice(invoice: TCreateInvoiceInput) {
    const res = await prisma.invoice.create({
      data: {
        transaksiId: invoice.transaksiId,
        customerId: invoice.customerId,
        tanggalTransaksi: invoice.tanggalTransaksi,
        namaSales: invoice.namaSales,
        total: invoice.total,
        type: invoice.type,
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
        customer: true,
        retur: true,
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

      const totalRetur = inv.retur.reduce((tot, cur) => {
        return tot + cur.total;
      }, 0);

      const sisa = inv.total - totalPembayaran - totalRetur;

      parsed.push({
        sisa,
        id: inv.id,
        transaksiId: inv.transaksiId,
        tanggalTransaksi: new Date(inv.tanggalTransaksi),
        namaSales: inv.namaSales,
        status: inv.total - totalPembayaran > 0 ? "BELUM" : "LUNAS",
        namaCustomer: inv.customer.nama,
        customerId: inv.customer.id,
        total: inv.total,
        type: inv.type,
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
        customer: true,
        retur: true,
      },
    });
    const totalPembayaran = res.penagihan.reduce((tot, cur) => {
      const totalPenagihan = cur.distribusiPembayaran.reduce((tot, cur) => {
        return (tot += cur.jumlah);
      }, 0);

      return (tot += totalPenagihan);
    }, 0);

    const totalRetur = res.retur.reduce((tot, cur) => {
      return tot + cur.total;
    }, 0);

    const sisa = res.total - totalPembayaran - totalRetur;

    return {
      ...res,
      namaCustomer: res.customer.nama,
      sisa,
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
      where: {
        id,
      },
      include: {
        penagihan: true,
      },
    });

    if (cek?.penagihan.length) {
      throw new Error("Terdapat pembayaran yang terhubung ke invoice ini");
    }

    const res = await prisma.invoice.delete({
      where: {
        id,
      },
    });

    return res;
  }

  public static async createInvoiceFromFile(
    transactions: TInputInvoiceFileArray
  ) {
    const invoices = await prisma.$transaction(async (tx) => {
      const createdInvoices: Invoice[] = [];
      for (const transaction of transactions) {
        const {
          transaksiId,
          tanggalTransaksi,
          total,
          type,
          namaCustomer,
          namaSales,
        } = transaction;
        let customer = await tx.customer.findUnique({
          where: { nama: namaCustomer },
        });
        if (!customer) {
          customer = await tx.customer.create({
            data: { nama: namaCustomer },
          });
        }

        const invoice = await tx.invoice.create({
          data: {
            transaksiId,
            total,
            tanggalTransaksi,
            namaSales,
            type,
            customerId: customer.id,
          },
        });
        createdInvoices.push(invoice);
      }
      return createdInvoices;
    });
    return invoices;
  }
}
