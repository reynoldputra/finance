import { prisma } from "../../prisma";
import { TInputReturFileArray } from "./returSchema";

export class returService {
  public static async createReturFromFile(transactions: TInputReturFileArray) {
    const returs = await prisma.$transaction(async (tx) => {
      for (const transaction of transactions) {
        const { transaksiId, noRetur, tanggalTransaksi, total, type } =
          transaction;
        const retur = await tx.retur.create({
          data: {
            transaksiId,
            noRetur,
            total,
            tanggalTransaksi,
            type,
          },
        });
        return retur;
      }
    });
    return returs;
  }
  public static async getAllRetur() {
    const res = await prisma.retur.findMany();
    return res;
  }
}
