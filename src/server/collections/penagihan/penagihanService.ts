import { Prisma } from "@server/../generated/client";
import { prisma } from "../../prisma";
import {
  TCreatePenagihanInput,
  TUpdatePenagihanInput,
  TUpdateTT,
} from "./penagihanSchema";

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
        tandaTerima: d.tandaTerima ?? false,
        totalPembayaran: total,
        cash,
        transfer,
        giro,
      });

    }
    // const sorted = parsed.sort((a, b) => {
    //   if(a.id == b.id) {
    //     return a.totalPembayaran - b.totalPembayaran
    //   } else {
    //     return a.transaksiId.localeCompare(b.transaksiId)
    //   }
    // })

    // let curid = ""
    // let idx = 1
    // const indexing = sorted.map(p => {
    //   if(curid == p.transaksiId) {
    //     if(p.status == "CICILAN") {
    //       p.status = "CICILAN " + idx
    //       idx++
    //     }
    //     console.log(p.transaksiId, idx, p.status)
    //     return p
    //   } else {
    //     curid = p.transaksiId
    //     idx = 1
    //     if(p.status == "CICILAN") {
    //       p.status = "CICILAN " + idx
    //       idx++
    //     }
    //     console.log(p.transaksiId, idx, p.status)
    //     return p
    //   }
    // })

    parsed.sort((a, b) => {
      return a.transaksiId.localeCompare(b.transaksiId);
    });

    let currentInvoiceId: string | null = null;
    let cicilanCount = 1;

    parsed.forEach((data) => {
      if (data.transaksiId !== currentInvoiceId) {
        currentInvoiceId = data.transaksiId;
        cicilanCount = 1;
      }

      if (data.status === "CICILAN") {
        data.status = `CICILAN ${cicilanCount}`;
        cicilanCount++;
      }
    });

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

    return parse;
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
    if (input.status) updateData.status = input.status;
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
        id,
      },
      data: {
        status: "NIHIL",
      },
    });

    return result;
  }

  static async updateTT(input: TUpdateTT) {
    const result = await prisma.penagihan.update({
      where: {
        id: input.id,
      },
      data: {
        tandaTerima: input.value,
      },
    });

    return result;
  }
}
