import { Prisma, Retur } from "../../../generated/client";
import { prisma } from "../../prisma";
import {
  TCreateReturInput,
  TInputReturFileArray,
  TInputReturFileObject,
  TUpdateReturInput,
} from "./returSchema";

export class returService {
  public static async createReturFromFile(transactions: TInputReturFileArray) {
    const returs = await prisma.$transaction(async (tx) => {
      const createdReturs: Retur[] = [];
      for (const transaction of transactions) {
        const { transaksiId, noRetur, tanggalTransaksi, total, type } =
          transaction;
        let invoice = await tx.invoice.findUnique({
          where: { transaksiId: transaksiId },
        });
        if (invoice) {
          const retur = await tx.retur.create({
            data: {
              transaksiId,
              noRetur,
              total,
              tanggalTransaksi,
              type,
              invoice: { connect: { id: invoice.id } },
            },
          });
          createdReturs.push(retur);
        } else {
          console.error(`Invoice with transaksiId ${transaksiId} not found.`);
        }
      }
      return createdReturs;
    });
    return returs;
  }

  public static async getAllRetur() {
    const res = await prisma.retur.findMany();
    const convertedReturs = res.map(retur => ({
      ...retur,
      total: Number(retur.total)
    }));
    return convertedReturs;
  }

  public static async createRetur(input: TCreateReturInput) {
    const { transaksiId, noRetur, tanggalTransaksi, type, total, invoiceId } =
      input;
    const res = await prisma.retur.create({
      data: {
        transaksiId,
        noRetur,
        tanggalTransaksi,
        type,
        total,
        invoiceId,
      },
    });
    return res;
  }

  public static async deleteRetur(id: string) {
    const res = await prisma.retur.delete({
      where: {
        id,
      },
    });
    return res;
  }

  public static async updateRetur(input: TUpdateReturInput) {
    let updateData: Prisma.ReturUncheckedUpdateInput = {};
    if (input.transaksiId) updateData.transaksiId = input.transaksiId;
    if (input.noRetur) updateData.noRetur = input.noRetur;
    if (input.tanggalTransaksi)
      updateData.tanggalTransaksi = input.tanggalTransaksi;
    if (input.total) updateData.total = input.total;
    if (input.type) updateData.type = input.type;
    if (input.invoiceId) updateData.invoiceId = input.invoiceId;
    const result = await prisma.retur.update({
      where: {
        id: input.id,
      },
      data: updateData,
    });
    return result;
  }
}
