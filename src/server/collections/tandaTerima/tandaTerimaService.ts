import { prisma } from "@server/prisma";
import {
  TCreateTandaTerimaInput,
  TUpdateTandaTerimaInput,
} from "./tandaTerimaSchema";
import { Prisma } from "../../../generated/client";

export class TandaTerimaService {
  public static async getTandaTerimaTable() {
    const result = await prisma.tandaTerima.findMany({
      include: {
        tandaTerimaInvoice: {
          select: {
            invoice: {
              select: {
                id: true,
                total: true,
                tanggalTransaksi: true,
                transaksiId: true,
                customer: true,
                penagihan: {
                  select: {
                    distribusiPembayaran: {
                      select: {
                        jumlah: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
    const tandaTerimaTable = result.map((entry) => {
      const customer = entry.tandaTerimaInvoice[0].invoice.customer;
      const invoices = entry.tandaTerimaInvoice.map((invoiceData) => {
        const total =
          invoiceData.invoice.total -
          invoiceData.invoice.penagihan.reduce(
            (totalPembayaran, penagihan) =>
              totalPembayaran +
              penagihan.distribusiPembayaran.reduce(
                (totalDistribusi, distribusi) =>
                  totalDistribusi + distribusi.jumlah,
                0
              ),
            0
          );
        return {
          transaksiId: invoiceData.invoice.transaksiId,
          total: total,
          tanggalTransaksi: new Date(invoiceData.invoice.tanggalTransaksi),
        };
      });
      return {
        id: entry.id,
        namaCustomer: customer.nama,
        alamat: customer.alamat,
        tanggalTT: entry.tanggalTT,
        jumlahInvoice: invoices.length,
      };
    });
    return tandaTerimaTable;
  }

  public static async getDetailTandaTerima(id: string) {
    const result = await prisma.tandaTerima.findUnique({
      where: {
        id,
      },
      include: {
        tandaTerimaInvoice: {
          select: {
            invoice: {
              select: {
                id: true,
                total: true,
                tanggalTransaksi: true,
                transaksiId: true,
                penagihan: {
                  select: {
                    distribusiPembayaran: {
                      select: {
                        jumlah: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
    const invoices = result?.tandaTerimaInvoice.map((invoiceData) => {
      const total =
        invoiceData.invoice.total -
        invoiceData.invoice.penagihan.reduce(
          (totalPembayaran, penagihan) =>
            totalPembayaran +
            penagihan.distribusiPembayaran.reduce(
              (totalDistribusi, distribusi) =>
                totalDistribusi + distribusi.jumlah,
              0
            ),
          0
        );
      return {
        transaksiId: invoiceData.invoice.transaksiId,
        total: total,
        tanggalTransaksi: new Date(invoiceData.invoice.tanggalTransaksi),
      };
    });
    return invoices;
  }

  public static async createTandaTerima(input: TCreateTandaTerimaInput) {
    const { id, tanggalTT, manyInvoiceId } = input;
    const res = await prisma.tandaTerima.create({
      data: {
        id,
        tanggalTT,
        tandaTerimaInvoice: {
          create: manyInvoiceId.map((invoiceId) => ({
            tandaTerimaId: id,
            invoiceId,
          })),
        },
      },
    });
    return res;
  }

  public static async getInvoiceByIdWaiting(id: string) {
    const res = await prisma.invoice.findMany({
      where: {
        customerId: id,
        penagihan: {
          some: {
            status: "WAITING",
          },
        },
      },
    });
    return res;
  }

  // public static async updateTandaTerima(input: TUpdateTandaTerimaInput) {
  //   const updateData: Prisma.TandaTerimaUncheckedUpdateInput = {};
  //   if (input.id) updateData.id = input.id;
  //   if (input.tanggalTT) updateData.tanggalTT = input.tanggalTT;
  //   const res = await prisma.tandaTerima.update({
  //     where: {
  //       id: input.id,
  //     },
  //     data: updateData,
  //   });

  //   return res;
  // }
}
