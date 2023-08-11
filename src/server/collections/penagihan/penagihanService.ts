import { Prisma } from "@server/../generated/client";
import { prisma } from "../../prisma";
import { TCreatePenagihanInput, TUpdatePenagihanInput } from "./penagihanSchema";

export class PenagihanService {
  static async getAllPenagihan() {
    const result = await prisma.penagihan.findMany({
      include: {
        invoice: {
          include: {
            customer: true,
          },
        },
        kolektor: true,
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

      let cash = 0;
      let transfer = 0;
      let giro = 0;

      d.distribusiPembayaran.forEach((d) => {
        if (d.caraBayar.metodePembayaranId == 1) cash++;
        if (d.caraBayar.metodePembayaranId == 2) giro++;
        if (d.caraBayar.metodePembayaranId == 3) transfer++;
      });

      parsed.push({
        id: d.id,
        transaksiId: d.invoice.transaksiId,
        tanggalTagihan: d.tanggalTagihan,
        status: d.status,
        namaKolektor: d.kolektor.nama,
        kolektorId: d.kolektor.id,
        namaCustomer: d.invoice.customer.nama,
        customerId: d.invoice.customer.id,
        sisa: d.invoice.total - total,
        totalPembayaran: total,
        cash,
        transfer,
        giro,
      });
    }

    return parsed;
  }

  static async getPenagihanSisa() {
    const result = await prisma.penagihan.findMany({
      include: {
        invoice: true,
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
    const parse = result.map((r) => {
      const total = r.distribusiPembayaran.reduce((tot, cur) => {
        return (tot += cur.jumlah);
      }, 0);
      return {
        penagihanId: r.id,
        sisa: r.invoice.total - total,
      };
    });

    return parse
  }

  static async getPenagihan(id: string) {
    const result = await prisma.penagihan.findFirstOrThrow({
      where: {
        id,
      },
      include: {
        invoice: true,
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
      sisa: result.invoice.total - total,
    };
  }

  static async getPenagihanByCarabayar(id: string) {
    const result = await prisma.penagihan.findMany({
      where: {
        distribusiPembayaran: {
          some: {
            caraBayarId: id,
          },
        },
      },
      include: {
        invoice: true,
        distribusiPembayaran: true,
      },
    });

    const parsed = result.map((r) => {
      return {
        ...r,
        distribusi: r.distribusiPembayaran.find((d) => d.caraBayarId == id),
      };
    });

    return parsed;
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

  static async createManyPenagihan(input: TCreatePenagihanInput[]) {
    const result = input.map((i) => {
      return this.createPenagihan(i);
    });

    return result;
  }

  static async updatePenagihan(input: TUpdatePenagihanInput) {
    let updateData: Prisma.PenagihanUncheckedUpdateInput = {};
    if (input.invoiceId) updateData.invoiceId = input.invoiceId;
    if (input.kolektorId) updateData.kolektorId = input.kolektorId;
    if (input.tanggalTagihan) updateData.tanggalTagihan = input.tanggalTagihan;
    const result = await prisma.penagihan.update({
      where: {
        id: input.penagihanId,
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

  static async updateStatusToNihil(id: string) {
    const result = await prisma.penagihan.update({
      where: {
        id
      },
      data: {
        status: "NIHIL"
      }
    })
    
    return result;
  }
}
