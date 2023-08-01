import { prisma } from "../../prisma";
import { CustomerService } from "../customer/customerService";
import { TCreateKolektorInput, TUpdateKolektorInput } from "./kolektorSchema";

export class KolektorService {
  public static async getKolektorTable() {
    const res = await prisma.kolektor.findMany({
      select: {
        id: true,
        nama: true,
        penagihan: {
          select: {
            status: true,
            distribusiPembayaran: {
              select: {
                jumlah: true,
              },
            },
          },
          // ganti jadi waiting
          where: {
            status: "CICILAN",
          },
        },
      },
    });
    const kolektorTable = res.map((r) => {
      const jumlahTagihanWaiting = CustomerService.getTotalPembayaran(r);
      return {
        id: r.id,
        nama: r.nama,
        penagihanWaiting: r.penagihan.length,
        jumlahTagihanWaiting,
      };
    });
    console.dir(kolektorTable, { depth: null });
    return res;
  }

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
