import { prisma } from "../../prisma";
import { TCreateKolektorInput } from "./kolektorSchema";

export class KolektorService {
  public static async getAllKolektor() {
    const res = await prisma.kolektor.findMany();
  }

  public static async createKolektor(kolektor: TCreateKolektorInput) {
    const { id, nama } = kolektor;
    const res = await prisma.kolektor.create({
      data: {
        id: id,
        nama: nama,
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
}
