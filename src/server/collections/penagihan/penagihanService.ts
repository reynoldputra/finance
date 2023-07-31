import { Penagihan, Prisma } from "@server/../generated/client";
import { prisma } from "../../prisma";
import { TCreatePenagihanInput, TUpdatePenagihanInput } from "./penagihanSchema";

export class PenagihanService {
  static async getAllPenagihan() {
    const result = await prisma.penagihan.findMany({
      include: {
        distribusiPembayaran: {
          include: {
            caraBayar: {
              include: {
                giro: true,
                transfer: true,
                metode: true,
              },
            },
          },
        },
      },
    });

    const parsed = [];

    for (let idx in result) {
      const d = result[idx];
      const total = d.distribusiPembayaran.reduce((tot, cur) => {
        return (tot += cur.jumlah);
      }, 0);

      parsed.push({
        ...d,
        totalPembayaran: total,
      });
    }

    return parsed;
  }

  static async getPenagihan(id: string) {
    const result = await prisma.penagihan.findFirstOrThrow({
      where: {
        id,
      },
      include: {
        distribusiPembayaran: {
          include: {
            caraBayar: {
              include: {
                giro: true,
                transfer: true,
                metode: true,
              },
            },
          },
        },
      },
    });

    const total = result.distribusiPembayaran.reduce((tot, cur) => {
      return (tot += cur.jumlah);
    }, 0);

    return {
      ...result,
      totalPembayaran: total,
    };
  }

  static async createPenagihan(input: TCreatePenagihanInput) {
    const result = await prisma.penagihan.create({
      data: {
        invoiceId: input.invoiceId,
        kolektorId: input.kolektorId,
        tanggalTagihan: input.tanggalTagihan,
        status: "WAITING",
      },
    });

    return result;
  }

  static async updatePenagihan(input: TUpdatePenagihanInput) {
    let updateData: Prisma.PenagihanUncheckedUpdateInput = {};
    if (input.invoiceId) updateData.invoiceId = input.invoiceId;
    if (input.kolektorId) updateData.kolektorId = input.kolektorId;
    if (input.tanggalTagihan) updateData.tanggalTagihan = input.tanggalTagihan;
    const result = await prisma.distribusiPembayaran.update({
      where: {
        id: input.distribusiPembayaranId,
      },
      data: updateData,
    });

    return result;
  }

  static async deletePenagihan(id: string) {
    const result = await prisma.penagihan.delete({
      where: {
        id,
      },
    });

    return result;
  }
}
