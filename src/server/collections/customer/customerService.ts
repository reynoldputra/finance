import { ICustomerTable, ICustomer } from "@server/types/customer";
import { TCreateCustomerInput, createCustomerInput } from "./customerSchema";
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

  public static async createCustomer(customer: TCreateCustomerInput) {
    const { id, nama, currentKolektor } = customer;
    const res = await prisma.customer.create({
      data: {
        id: id,
        nama: nama,
        currentKolektor: {
          connect: {
            id: currentKolektor,
          },
        },
      },
      include: {
        kolektorHistory: {
          include: {
            kolektor: true,
          },
        },
      },
    });
    return res;
  }

  // public static async updateCostumer(customer: TCreateCustomerInput) {
  //   const res = await prisma.customer;
  // }

  public static async deleteCustumer(customerId: string): Promise<boolean> {
    await prisma.customer.delete({
      where: {
        id: customerId,
      },
    });
    return true;
  }

  // public static async getAllCostumers(): Promise<ICustomer[]> {
  //   const result = await prisma.customer.findMany({
  //     select: {
  //       id: true,
  //       nama: true,
  //       kolektorHistory: {
  //         select: {
  //           kolektor: {
  //             select: {
  //               nama: true,
  //             },
  //           },
  //         },
  //       },
  //     },
  //   });
  //   const allCustomer: ICustomer[] = result.map((customer) => {
  //     const kolektorHistory = customer.kolektorHistory.map((item) => {
  //       return {
  //         nama_kolektor: item.kolektor.nama,
  //       };
  //     });
  //     return {
  //       id: customer.id,
  //       nama: customer.nama,
  //       kolektorHistory,
  //     };
  //   });
  //   return allCustomer;
  // }
}
