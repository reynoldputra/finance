import { prisma } from "@server/prisma";

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

    const customerTable = result.map((entry) => {
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
          tanggalTransaksi: invoiceData.invoice.tanggalTransaksi,
        };
      });
      return {
        id: entry.id,
        nama_customer: customer.nama,
        // alamat: customer.alamat,
        // tanggalTT: entry.tanggalTT,
        jumlahInvoice: invoices.length,
        invoices: invoices,
      };
    });

    console.log(customerTable);
    return customerTable;
  }
}
