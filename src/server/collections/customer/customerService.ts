import { ICustomerTable, ICustomer } from "@server/types/customer";
import {
  TCreateCustomerInput,
  TUpdateCustomerInput,
  createCustomerInput,
} from "./customerSchema";
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

  public static async getKolektorHistory(customerId: string) {
    const res = await prisma.customer.findMany({
      // where: {
      //   kolektorId: kolektorId,
      // },
      // select: {
      //   id: true,
      //   kolektorHistory: true,
      //   currentKolektor: {
      //     select: {
      //       nama: true,
      //     },
      //   },
      // },
      where: {
        id: customerId,
      },
      select: {
        id: true,
        nama: true,
        kolektorHistory: {
          select: {
            id: true,
            customerId: true,
            kolektorId: true,
            kolektor: {
              select: {
                nama: true,
              },
            },
          },
        },
      },
    });
    return res;
    // [
    //   {
    //     "customerId": "...",
    //     "kolektorHistory": [
    //       {
    //         "id": "...",
    //         "customerId": "...",
    //         "kolektorId": "somekolektorid"
    //       },
    //     ],
    //     "kolektor": {
    //       "nama": ".."
    //     }
    //   },
    // ]

    // [
    //   {
    //     "id": "..",
    //     "nama": "..",
    //     "kolektorHistory": [
    //       {
    //         "id": "..",
    //         "customerid": "..",
    //         "kolektorid": "..",
    //         "kolektor": {
    //           "nama": ".."
    //         }
    //       },
    //     ]
    //   }
    // ]
  }

  public static async getAllCustomer() {
    const res = await prisma.customer.findMany();
    return res;
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
    });
    return res;
  }

  public static async deleteCustomer(customerId: string): Promise<boolean> {
    await prisma.customer.delete({
      where: {
        id: customerId,
      },
    });
    return true;
  }

  public static async updateCostumer(customer: TUpdateCustomerInput) {
    const { id, nama, currentKolektor } = customer;
    const updatedCustomer = await prisma.$transaction(async (prisma) => {
      const updateCostumer = await prisma.customer.update({
        where: { id: id },
        data: {
          id,
          nama,
          currentKolektor: {
            connect: {
              id: currentKolektor,
            },
          },
        },
      });
      const createHistory = await prisma.kolektorHistory.create({
        data: {
          customerId: id,
          kolektorId: currentKolektor,
        },
      });
      return updateCostumer;
    });
    return updatedCustomer;
    // const updateData = await prisma.customer.update({
    //   where: { id: id },
    //   data: {
    //     id,
    //     nama,
    //     currentKolektor: {
    //       connect: {
    //         id: currentKolektor,
    //       },
    //     },
    //   },
    // });
    // const createHistory = await prisma.kolektorHistory.create({
    //   data: {
    //     customerId: id,
    //     kolektorId: currentKolektor,
    //   },
    // });

    // const res = await prisma.$transaction([updateData, createHistory]);
    // return res;
  }
}
