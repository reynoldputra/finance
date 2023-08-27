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
            retur: true,
            penagihan : {
              include : {
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
              }
            }
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
      const pembayaranLama = d.invoice.penagihan.reduce((tot, cur) => {
        if(cur.id == d.id && !(cur.tanggalTagihan < d.tanggalTagihan)) {
          return tot += 0
        } else {
          const sum = cur.distribusiPembayaran.reduce((t, c) => {
            return (t += c.jumlah);
          }, 0)
          return tot += sum
        }
      }, 0);

      const pembayaranBaru = d.distribusiPembayaran.reduce((tot, cur) => {
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
        pembayaranLama,
        pembayaranBaru,
        sisa: d.invoice.total - pembayaranLama,
        tandaTerima: d.tandaTerima ?? false,
        totalPembayaran: pembayaranBaru,
        cash,
        transfer,
        giro,
      });

    }

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
        data.status = `CICILAN ke-${cicilanCount}`;
        cicilanCount++;
      }
    });

    return parsed;
  }

  static async getAccoutingReport(tanggalPenagihan : Date, tanggalPembayaran ?: Date) {
    const result = await prisma.penagihan.findMany({
      where : {
        tanggalTagihan : tanggalPenagihan,
        distribusiPembayaran : {
          some : {
            caraBayar : {
              tanggal : tanggalPembayaran
            }
          }
        }
      },
      include: {
        invoice: {
          include: {
            customer: true,
            penagihan : {
              include : {
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
              }
            }
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
      const pembayaranLama = d.invoice.penagihan.reduce((tot, cur) => {
        if(cur.id == d.id && !(cur.tanggalTagihan < d.tanggalTagihan)) {
          return tot += 0
        } else {
          const sum = cur.distribusiPembayaran.reduce((t, c) => {
            return (t += c.jumlah);
          }, 0)
          return tot += sum
        }
      }, 0);

      const pembayaranBaru = d.distribusiPembayaran.reduce((tot, cur) => {
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
        distribusi : d.distribusiPembayaran,
        invoice : d.invoice,
        id: d.id,
        namaSales : d.invoice.namaSales,
        transaksiId: d.invoice.transaksiId,
        tanggalTagihan: d.tanggalTagihan,
        status: d.status,
        namaKolektor: d.kolektor.nama,
        kolektorId: d.kolektor.id,
        namaCustomer: d.invoice.customer.nama,
        customerId: d.invoice.customer.id,
        pembayaranLama,
        pembayaranBaru,
        sisa: d.invoice.total - pembayaranLama,
        tandaTerima: d.tandaTerima ?? false,
        totalPembayaran: pembayaranBaru,
        cash,
        transfer,
        giro
      });

    }

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
        data.status = `CICILAN ke-${cicilanCount}`;
        cicilanCount++;
      }
    });

    return parsed;
  }

  static async getPenagihanByDate(date : Date) {
    const result = await prisma.penagihan.findMany({
      where : {
        tanggalTagihan : {
          equals : date
        }
      },
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
        if(cur.caraBayar.tanggal.getTime() < d.tanggalTagihan.getTime()) return (tot += cur.jumlah);
        else return tot += 0
      }, 0);

      const totalRetur = d.invoice.retur.reduce((tot, retur) => {
        return (tot += retur.total);
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
        tanggalTransaksi : d.invoice.tanggalTransaksi,
        status: d.status,
        namaKolektor: d.kolektor.nama,
        kolektorId: d.kolektor.id,
        namaCustomer: d.invoice.customer.nama,
        customerId: d.invoice.customer.id,
        sisa: d.invoice.total - total - totalRetur,
        tandaTerima: d.tandaTerima ?? false,
        totalPembayaran: total,
        totalTagihan: d.invoice.total,
        cash,
        transfer,
        giro,
        sales : d.invoice.namaSales
      });
    }

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
        invoice: {
          include: {
            retur: true,
          },
        },
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
      const totalRetur = r.invoice.retur.reduce((tot, retur) => {
        return (tot += retur.total);
      }, 0);
      return {
        penagihanId: r.id,
        sisa: r.invoice.total - total - totalRetur,
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
        invoice: {
          include: {
            retur: true,
          },
        },
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

    const totalRetur = result.invoice.retur.reduce((tot, retur) => {
      return (tot += retur.total);
    }, 0);

    return {
      ...result,
      totalPembayaran: total,
      sisa: result.invoice.total - total - totalRetur,
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
