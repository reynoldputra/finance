import { Prisma } from "@server/../generated/client";
import { prisma } from "@server/prisma";
import { TCreateCaraBayarInput, TUpdateCaraBayarInput } from "./caraBayarSchema";

export class CaraBayarService {
  static async getCaraBayar() {
    const result = await prisma.caraBayar.findMany({
      include: {
        metode: true,
        giro: true,
        transfer: true,
        distribusiPembayaran: {
          include: {
            penagihan: {
              include: {
                invoice: {
                  include: {
                    customer: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const resultParse = result.map((r) => {
      let detail;

      if (r.giro)
        detail = {
          bank: r.giro.bank,
          nomor: r.giro.nomor,
          jatuhTempo: r.giro.jatuhTempo,
        };

      if (r.transfer)
        detail = {
          bank: r.transfer.bank,
        };

      const jumlahdistribusi = r.distribusiPembayaran.reduce((tot, curr) => tot += curr.jumlah , 0)

      return {
        id: r.id,
        total: r.total,
        metodePembayaran: r.metode.jenis,
        sisa : r.total - jumlahdistribusi,
        tandaTerima: r.tandaTerima,
        namaCustomer: r.distribusiPembayaran[0].penagihan.invoice.customer.nama,
        customerId: r.distribusiPembayaran[0].penagihan.invoice.customer.id,
        tanggalPembayaran: r.tanggal,
        detailPembayaran: detail,
        jumlahDistribusi: r.distribusiPembayaran.length,
      };
    });
    return resultParse;
  }

  static async createCaraBayar(input: TCreateCaraBayarInput, prismaCtx?: Prisma.TransactionClient) {
    const prismaclient = prismaCtx ?? prisma;
    let newCaraBayar: Prisma.CaraBayarUncheckedCreateInput = {
      total: input.total,
      tandaTerima: input.tandaTerima,
      tanggal: input.tanggal,
      metodePembayaranId: 1,
    };

    if (input.pembayaran.giro) {
      newCaraBayar.giro = {
        create: input.pembayaran.giro,
      };
      newCaraBayar.metodePembayaranId = 2;
    } else if (input.pembayaran.transfer) {
      newCaraBayar.transfer = {
        create: input.pembayaran.transfer,
      };
      newCaraBayar.metodePembayaranId = 3;
    }

    const codepembayaran = await this.generateId(newCaraBayar.metodePembayaranId, new Date(newCaraBayar.tanggal))

    newCaraBayar.id = codepembayaran

    const result = await prismaclient.caraBayar.create({
      data: newCaraBayar,
    });

    return result;
  }

  static async deleteCaraBayar(id: string) {
    const result = await prisma.$transaction(async (ctx) => {
      const result = await ctx.distribusiPembayaran.deleteMany({
        where: {
          caraBayarId: id,
        },
      });

      await ctx.caraBayar.delete({
        where: {
          id: id,
        },
      });

      return result;
    });

    return {
      distribusi: result,
    };
  }

  static async updateCaraBayar(input: TUpdateCaraBayarInput) {
    let updateCaraBayar: Prisma.CaraBayarUncheckedUpdateInput = {};

    if (input.total) {
      updateCaraBayar = {
        total: input.total,
        metodePembayaranId: 1,
      };
    }

    if (input.pembayaran) {
      if (input.pembayaran.giro) {
        updateCaraBayar.giro = {
          create: input.pembayaran.giro,
        };
        updateCaraBayar.metodePembayaranId = 2;
      } else if (input.pembayaran.transfer) {
        updateCaraBayar.transfer = {
          create: input.pembayaran.transfer,
        };
        updateCaraBayar.metodePembayaranId = 3;
      }
    }

    if (input.tandaTerima) {
      updateCaraBayar.tandaTerima = input.tandaTerima;
    }

    const result = await prisma.caraBayar.update({
      where: {
        id: input.id,
      },
      data: updateCaraBayar,
    });

    return result;
  }

  static async generateId(metodePembayaran: number, date: Date) {
    let codepembayaran = "C";
    if (metodePembayaran == 2) codepembayaran = "G";
    if (metodePembayaran == 3) codepembayaran = "T";
    codepembayaran += date.getFullYear().toString().slice(-2);
    let codeMonth = date.getMonth() + 1;
    if (codeMonth < 10) {
      codepembayaran += `0${codeMonth}`;
    } else {
      codepembayaran += `${codeMonth}`;
    }

    let codeDate = date.getDate();
    if (codeDate < 10) {
      codepembayaran += `0${codeDate}`;
    } else {
      codepembayaran += `${codeDate}`;
    }
    const carabayarTransfer = await prisma.caraBayar.findMany({
      where: {
        tanggal: date,
        metodePembayaranId: metodePembayaran,
      },
    });

    codepembayaran += `-${carabayarTransfer.length + 1}`;

    return codepembayaran
  }
}
