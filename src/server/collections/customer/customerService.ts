import { ICustomerTable } from "@server/types/customer";
import { prisma } from "../../prisma";

export class CustomerService {
  public static async getCustomerTable(): Promise<ICustomerTable[]> {
    const result = await prisma.customer.findMany({
      select: {
        id: true,
        nama: true,
        currentKolektor: true,
        kolektorId: true,
        invoices: {
          where: {
            distribusiPembayaran: {
              some: {
                status: "LUNAS",
              },
            },
          },
          select: {
            distribusiPembayaran: true,
          },
        },
      },
    });

    const customerTable: ICustomerTable[] = result.map((r): ICustomerTable => {
      const jumlahTagihan = r.invoices.reduce((totalInv, currInv) => {
        const jumlahTerbayar = currInv.distribusiPembayaran.reduce(
          (totalTerbayar, currPembayaran) => {
            return (totalTerbayar += currPembayaran.jumlah);
          },
          0
        );
        return (totalInv += jumlahTerbayar);
      }, 0);

      return {
        id: r.id,
        nama: r.nama,
        kolektorId: r.kolektorId,
        kolektorNama: r.currentKolektor.nama,
        invoiceAktif: r.invoices.length,
        jumlahTagihan,
      };
    });

    return customerTable;
  }
}
