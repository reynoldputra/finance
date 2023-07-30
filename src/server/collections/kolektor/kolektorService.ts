import { prisma } from "../../prisma";
import { TCreateKolektorInput, TUpdateKolektorInput } from "./kolektorSchema";

export class KolektorService {
  public static async getAllKolektor() {
    const res = await prisma.kolektor.findMany();
    return res;
  }

  public static async createKolektor(kolektor: TCreateKolektorInput) {
    const { id, nama } = kolektor;
    const res = await prisma.kolektor.create({
      data: {
        id,
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
