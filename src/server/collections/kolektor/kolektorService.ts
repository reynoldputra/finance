import { prisma } from "../../prisma";
import {
  TCreateKolektorInput,
  TKolektorTable,
  TUpdateKolektorInput,
} from "./kolektorSchema";

export class KolektorService {
  public static async getKolektorTable(): Promise<TKolektorTable[]> {
    const res = await prisma.kolektor.findMany({
      select: {
        id: true,
        nama: true,
        penagihan: {
          select: {
            status: true,
          },
          where: {
            status: "WAITING",
          },
        },
      },
    });
    const kolektorTable: TKolektorTable[] = res.map((r): TKolektorTable => {
      return {
        id: r.id,
        nama: r.nama,
        penagihanWaiting: r.penagihan.length,
      };
    });
    return kolektorTable;
  }

  public static async getAllKolektor() {
    const res = await prisma.kolektor.findMany();
    return res;
  }

  public static async createKolektor(kolektor: TCreateKolektorInput) {
    const { nama } = kolektor;
    const res = await prisma.kolektor.create({
      data: {
        nama,
      },
    });
    return res;
  }

  public static async deleteKolektor(kolektorId: string) {
    const res = await prisma.kolektor.delete({
      where: {
        id: kolektorId,
      },
    });
    return res;
  }

  public static async updateKolektor(kolektor: TUpdateKolektorInput) {
    const { id, nama } = kolektor;
    const res = await prisma.kolektor.update({
      where: { id: id },
      data: {
        id,
        nama,
      },
    });
    return res;
  }
}
