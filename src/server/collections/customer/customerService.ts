import { ICustomerTable } from "@server/types/customer";
import { TCreateCustomerInput, TUpdateCustomerInput } from "./customerSchema";
import { prisma } from "@server/prisma";
import { Prisma } from "../../../generated/client";
import { InvoiceService } from "../invoice/invoiceService";

export class CustomerService {
  public static async getCustomerTable(): Promise<ICustomerTable[]> {
    const result = await prisma.customer.findMany({
      select: {
        id: true,
        nama: true,
        alamat: true,
        currentKolektor: true,
        kolektorId: true,
        invoices: {
          where: {
            penagihan: {
              some: {
                status: "LUNAS",
              },
            },
          },
          select: {
            penagihan: {
              select: {
                distribusiPembayaran: true,
              },
            },
          },
        },
      },
    });
    const customerTable: ICustomerTable[] = result.map((r): ICustomerTable => {
      const invoicesArray = r?.invoices ?? [];
      const jumlahTagihan = CustomerService.getTotalPembayaran({
        penagihan: invoicesArray.map((invoice) => invoice.penagihan),
      });
      return {
        id: r.id,
        nama: r.nama,
        alamat: r.alamat ?? "-",
        kolektorId: r.kolektorId || "",
        kolektorNama: r.currentKolektor?.nama || "",
        invoiceAktif: r.invoices.length,
        jumlahTagihan,
      };
    });
    return customerTable;
  }

  public static getTotalPembayaran(queryRes: any): number {
    const penagihanArray = queryRes?.penagihan ?? [];
    const distribusiPembayaranArray = penagihanArray
      .flatMap((penagihan: any) => penagihan)
      .flatMap((penagihan: any) => penagihan.distribusiPembayaran ?? []);
    const totalPembayaran = distribusiPembayaranArray.reduce(
      (total: number, cur: any) => {
        return (total += cur.jumlah);
      },
      0
    );
    return totalPembayaran;
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

  public static async getDetailCustomer(id: string) {
    const res = await prisma.customer.findFirst({
      where: {
        id,
      },
      include: {
        currentKolektor: true,
      },
    });
    return res;
  }

  public static async createCustomer(customer: TCreateCustomerInput) {
    const res = await prisma.customer.create({
      data: customer,
    });
    return res;
  }

  public static async deleteCustomer(customerId: string) {
    const res = await prisma.customer.delete({
      where: {
        id: customerId,
      },
    });
    return res;
  }

  public static async updateCostumer(customer: TUpdateCustomerInput) {
    const { id, nama, kolektorId, alamat } = customer;

    const updateCustomerData: Prisma.CustomerUncheckedUpdateInput = {};
    if (nama) updateCustomerData.nama = nama;
    if (kolektorId) updateCustomerData.kolektorId = kolektorId;
    if (alamat) updateCustomerData.alamat = alamat;

    const existingCustomer = await prisma.customer.findUnique({
      where: { id },
      select: { kolektorId: true },
    });

    const updatedCustomer = await prisma.$transaction(async (prisma) => {
      const updateCostumer = await prisma.customer.update({
        where: { id: id },
        data: updateCustomerData,
      });
      if (
        kolektorId &&
        existingCustomer &&
        existingCustomer.kolektorId !== kolektorId
      ) {
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

  public static async getCustomerById(id: string) {
    const customer = await prisma.customer.findFirst({
      where: {
        id: id,
      },
    });
    return customer;
  }
}
