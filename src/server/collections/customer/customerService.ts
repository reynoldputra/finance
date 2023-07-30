import { ICustomerTable, ICustomer } from "@server/types/customer";
import {
  TCreateCustomerInput,
  TUpdateCustomerInput,
  createCustomerInput,
} from "./customerSchema";
import { prisma } from "../../prisma";
import { Prisma } from "../../../generated/client";

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
    const res = await prisma.kolektorHistory.findMany({
      where: {
        customerId: customerId,
      },
      include: {
        customer: true,
        kolektor: true,
      },
    });
    return res;
  }

  public static async getAllCustomer() {
    const res = await prisma.customer.findMany();
    return res;
  }

  public static async createCustomer(customer: TCreateCustomerInput) {
    const res = await prisma.customer.create({
      data: customer,
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
    const { id, nama, kolektorId } = customer;

    const updateCustomerData: Prisma.CustomerUncheckedUpdateInput = {};
    if (nama) updateCustomerData.nama = nama;
    if (kolektorId) updateCustomerData.kolektorId = nama;

    const updatedCustomer = await prisma.$transaction(async (prisma) => {
      const updateCostumer = await prisma.customer.update({
        where: { id: id },
        data: updateCustomerData,
      });
      if (kolektorId) {
        const createHistory = await prisma.kolektorHistory.create({
          data: {
            customerId: id,
            kolektorId: kolektorId,
          },
        });
      }
      return updateCostumer;
    });
    return updatedCustomer;
  }
}
