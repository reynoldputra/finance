import { Prisma } from "@server/../generated/client";
import { prisma } from "../../prisma";
import {
  TChangeManyToNihilInput,
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
            retur: true
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

      const pembayaranBaru = d.distribusiPembayaran.reduce((tot, cur) => {
        return (tot += Number(cur.jumlah));
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
        sisa: Number(d.sisa) - pembayaranBaru,
        tandaTerima: d.tandaTerima ?? false,
        totalPembayaran: pembayaranBaru,
        cash,
        transfer,
        giro,
      });
    }

    parsed.sort((a, b) => {
      const transaksiIdComparison = a.transaksiId.localeCompare(b.transaksiId);

      if (transaksiIdComparison !== 0) {
        return transaksiIdComparison;
      }

      return a.tanggalTagihan.getTime() - b.tanggalTagihan.getTime();
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

  static async getTableMaster(start: Date, end?: Date) {
    const result = await prisma.penagihan.findMany({
      where: {
        tanggalTagihan: {
          lte: end,
          gte: start
        }
      },
      include: {
        invoice: {
          include: {
            customer: true,
            penagihan: true
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
                distribusiPembayaran: true
              },
            },
          },
        },
      },
    });

    const parsed = [];

    for (let idx in result) {
      const d = result[idx];

      const pembayaranBaru = d.distribusiPembayaran.reduce((tot, cur) => {
        return (tot += Number(cur.jumlah));
      }, 0);

      let cash = 0;
      let transfer = 0;
      let giro = 0;

      let keterangan = ""

      if (d.status == "WAITING") continue

      if (d.status == "CICILAN") {
        d.invoice.penagihan.sort((a, b) => a.tanggalTagihan.getTime() - b.tanggalTagihan.getTime())

        const idx = d.invoice.penagihan.findIndex((val) => val.id == d.id)

        if (idx != -1) {
          d.status = "CICILAN Ke-" + (idx + 1)
        }
      }

      if (d.status == "LUNAS" || d.status == "PELUNASAN") {
        const selisih = d.sisa - pembayaranBaru
        if (selisih < 0) keterangan += ", Lebih " + (Math.abs(selisih)).toFixed()
        if (selisih > 0) keterangan += ", Kurang " + (Math.abs(selisih)).toFixed()

      }
      d.status += keterangan

      parsed.push({
        distribusi: d.distribusiPembayaran,
        invoice: d.invoice,
        total: Number(d.invoice.total),
        id: d.id,
        namaSales: d.invoice.namaSales,
        transaksiId: d.invoice.transaksiId,
        tanggalTagihan: d.tanggalTagihan,
        status: d.status,
        namaKolektor: d.kolektor.nama,
        kolektorId: d.kolektor.id,
        namaCustomer: d.invoice.customer.nama,
        customerId: d.invoice.customer.id,
        sisa: Number(d.sisa),
        tandaTerima: d.tandaTerima ?? false,
        totalPembayaran: pembayaranBaru,
        cash,
        transfer,
        giro
      });
    }

    parsed.sort((a, b) => {
      const transaksiIdComparison = a.transaksiId.localeCompare(b.transaksiId);

      if (transaksiIdComparison !== 0) {
        return transaksiIdComparison;
      }

      return a.tanggalTagihan.getTime() - b.tanggalTagihan.getTime();
    });

    return parsed;
  }

  static async getAccoutingReport(tanggalPenagihan: Date, tanggalPembayaran?: Date) {
    const result = await prisma.penagihan.findMany({
      where: {
        tanggalTagihan: tanggalPenagihan,
        distribusiPembayaran: {
          some: {
            caraBayar: {
              AND : [
              {
                tanggal: tanggalPembayaran,
              },
              {
                OR : [
                  {metodePembayaranId : 1},
                  {metodePembayaranId : 2},
                ]
              }
            ]
            }
          }
        }
      },
      include: {
        invoice: {
          include: {
            customer: true,
            penagihan: {
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

      const pembayaranBaru = d.distribusiPembayaran.reduce((tot, cur) => {
        return (tot += Number(cur.jumlah));
      }, 0);

      let cash = 0;
      let transfer = 0;
      let giro = 0;

      d.distribusiPembayaran.forEach((d) => {
        if (d.caraBayar.metodePembayaranId == 1) cash++;
        if (d.caraBayar.metodePembayaranId == 2) giro++;
        if (d.caraBayar.metodePembayaranId == 3) transfer++;
      });

      let keterangan = ""

      if (d.status == "WAITING") continue

      if (d.status == "CICILAN") {
        d.invoice.penagihan.sort((a, b) => a.tanggalTagihan.getTime() - b.tanggalTagihan.getTime())

        const idx = d.invoice.penagihan.findIndex((val) => val.id == d.id)

        if (idx != -1) {
          keterangan = "CICILAN Ke-" + (idx + 1)
        }
      }

      if (d.status == "PELUNASAN") {
        const selisih = d.sisa - pembayaranBaru
        keterangan = "PELUNASAN"
        if (selisih < 0) keterangan = "PELUNASAN, Lebih " + (Math.abs(selisih)).toFixed()
        if (selisih > 0) keterangan = "PELUNASAN, Kurang " + (Math.abs(selisih)).toFixed()
        if (selisih == 0) keterangan = "PELUNASAN"
      }

      if (d.status == "LUNAS") {
        const selisih = d.sisa - pembayaranBaru
        if (selisih < 0) keterangan = "Lebih " + (Math.abs(selisih)).toFixed()
        if (selisih > 0) keterangan = "Kurang " + (Math.abs(selisih)).toFixed()
      }

      d.status = keterangan

      parsed.push({
        distribusi: d.distribusiPembayaran,
        invoice: d.invoice,
        id: d.id,
        namaSales: d.invoice.namaSales,
        transaksiId: d.invoice.transaksiId,
        tanggalTagihan: d.tanggalTagihan,
        status: d.status,
        namaKolektor: d.kolektor.nama,
        kolektorId: d.kolektor.id,
        namaCustomer: d.invoice.customer.nama,
        customerId: d.invoice.customer.id,
        sisa: d.sisa,
        tandaTerima: d.tandaTerima ?? false,
        totalPembayaran: pembayaranBaru,
        cash,
        transfer,
        giro
      });

    }

    parsed.sort((a, b) => {
      const transaksiIdComparison = a.transaksiId.localeCompare(b.transaksiId);

      if (transaksiIdComparison !== 0) {
        return transaksiIdComparison;
      }

      return a.tanggalTagihan.getTime() - b.tanggalTagihan.getTime();
    });

    return parsed;
  }

  static async getPenagihanByDate(date: Date) {
    const result = await prisma.penagihan.findMany({
      where: {
        tanggalTagihan: {
          equals: date
        }
      },
      include: {
        invoice: {
          include: {
            customer: true,
            retur: true
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
        if (cur.caraBayar.tanggal.getTime() < d.tanggalTagihan.getTime()) return (tot += Number(cur.jumlah));
        else return tot += 0
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
        tanggalTransaksi: d.invoice.tanggalTransaksi,
        status: d.status,
        namaKolektor: d.kolektor.nama,
        kolektorId: d.kolektor.id,
        namaCustomer: d.invoice.customer.nama,
        customerId: d.invoice.customer.id,
        sisa: d.sisa,
        tandaTerima: d.tandaTerima ?? false,
        totalPembayaran: total,
        totalTagihan: d.invoice.total,
        cash,
        transfer,
        giro,
        sales: d.invoice.namaSales
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
      return {
        penagihanId: r.id,
        sisa: r.sisa,
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
      return (tot += Number(cur.jumlah));
    }, 0);


    return {
      ...result,
      totalPembayaran: total,
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
    const invoice = await prisma.invoice.findFirst({
      where: {
        id: input.invoiceId
      },
      include: {
        penagihan: {
          include: {
            distribusiPembayaran: true
          }
        },
        retur: true
      }
    })

    if (!invoice) return false

    const terbayar = invoice.penagihan.reduce((t, c) => {
      const totaldistribusi = c.distribusiPembayaran.reduce((t2, c2) => {
        return t2 += Number(c2.jumlah)
      }, 0)
      return t += totaldistribusi
    }, 0)


    const totalRetur = invoice.retur.reduce((tot, retur) => {
      const total = retur.type != "Retur Tarik Barang" ? retur.total : 0
      return (tot += Number(total));
    }, 0);

    input.tanggalTagihan.setHours(0, 0, 0, 0)

    const result = await prisma.penagihan.create({
      data: {
        sisa: Number(invoice.total) - terbayar - totalRetur,
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

  static async changeManyToNihil(input: TChangeManyToNihilInput) {
    const transaction = await prisma.$transaction(input.map((id) => {
      return prisma.penagihan.update({
        where: {
          id,
        },
        data: {
          status: 'NIHIL',
        },
      });
    }));

    return transaction;
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
