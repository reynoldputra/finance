import { Prisma } from "@server/../generated/client";
import { roundDecimal } from "@server/lib/roundDecimal";
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

      const jumlahdistribusi = r.distribusiPembayaran.reduce((tot, curr) => tot += Number(curr.jumlah) , 0)

      return {
        id: r.id,
        total: Number(r.total),
        metodePembayaran: r.metode.jenis,
        sisa : Number(r.total) - jumlahdistribusi,
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

  static async getReportSetoranBank(tanggalPenagihan : Date, tanggalPembayaran : Date) {
    const result = await prisma.distribusiPembayaran.findMany({
      where : {
        caraBayar : {
          tanggal : tanggalPembayaran,
          metodePembayaranId : 1
        },
        penagihan : {
          tanggalTagihan : tanggalPenagihan,
        }
      },
      include : {
        caraBayar : true,
        penagihan : {
          include : {
            kolektor : true,
            invoice : {
              include : {
                customer : true,
                penagihan : true
              }
            },
            distribusiPembayaran : true
          }
        }
      }
    })

    const resultWithKet = result.map(r => {
      let ket = ""

      if(r.penagihan.status == "CICILAN") {
        const penagihan = r.penagihan.invoice.penagihan.filter((p) => p.status == "CICILAN")
        penagihan.sort((a,b) => a.tanggalTagihan.getTime() - b.tanggalTagihan.getTime())
        const idx = penagihan.findIndex(a => a.id == r.penagihan.id)

        if(idx != -1) ket = "CICILAN Ke-" + (idx+1)
      }

      if(r.penagihan.status == "PELUNASAN") {
        const pembayaranBaru = r.penagihan.distribusiPembayaran.reduce((tot, cur) => {
          return tot += cur.jumlah
        }, 0)
        let selisih = r.penagihan.sisa - pembayaranBaru
        let selisihAbs = Math.round(Math.abs(selisih))
        if (selisih > 0) ket = "PELUNASAN, Kurang " + selisihAbs
        if (selisih < 0) ket = "PELUNASAN, Lebih " + selisihAbs
        if(selisih == 0) ket = "PELUNASAN"
      }

      if(r.penagihan.status == "LUNAS") {
        const pembayaranBaru = r.penagihan.distribusiPembayaran.reduce((tot, cur) => {
          return tot += cur.jumlah
        }, 0)
        let selisih = r.penagihan.sisa - pembayaranBaru
        let selisihAbs = Math.round(Math.abs(selisih))
        if (selisih < 0) ket += "Lebih " + selisihAbs
        if (selisih > 0) ket += "Kurang " + selisihAbs
      }

      return {
        ...r,
        keterangan : ket
      }
    })

    return resultWithKet
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

  static async updateCaraBayar(input: TUpdateCaraBayarInput, prismaCtx?: Prisma.TransactionClient) {
    console.log(input)
    const prismaClient = prismaCtx ?? prisma
    let updateCaraBayar: Prisma.CaraBayarUncheckedUpdateInput = {};

    const oldCarabayar = await prismaClient.caraBayar.findFirst({
      where : {
        id : input.id
      },
      include : {
        giro : true,
        transfer : true
      }
    })

    let metode = 1
    if(input.pembayaran?.giro) metode = 2
    if(input.pembayaran?.transfer) metode = 3
    
    // cara bayar tetap
    if(oldCarabayar?.metodePembayaranId == metode) {
      if (input.total) {
        updateCaraBayar = {
          total: input.total,
          metodePembayaranId: 1,
        };
      }

      if (input.pembayaran) {
        if (input.pembayaran.giro) {
          updateCaraBayar.giro = {
            update: input.pembayaran.giro,
          };
          updateCaraBayar.metodePembayaranId = 2;
        } else if (input.pembayaran.transfer) {
          updateCaraBayar.transfer = {
            update: input.pembayaran.transfer,
          };
          updateCaraBayar.metodePembayaranId = 3;
        }
      }

      if (input.tandaTerima) {
        updateCaraBayar.tandaTerima = input.tandaTerima;
      }

      if (input.tanggal) {
        updateCaraBayar.tanggal = input.tanggal;
      }

      if (input.keterangan) {
        updateCaraBayar.keterangan = input.keterangan;
      }

      console.log(updateCaraBayar)

      const result = await prismaClient.caraBayar.update({
        where: {
          id: input.id,
        },
        data: updateCaraBayar,
      });

      return result;
    }

    // cara bayar ganti
    else {
      if(oldCarabayar?.giro) {
        await prismaClient.giro.delete({
          where : {
            id : oldCarabayar.giro.id
          }
        })
      }
      
      if (oldCarabayar?.transfer){
        await prismaClient.transfer.delete({
          where : {
            id : oldCarabayar.transfer.id
          }
        })
      }

      let carabayarUpdateData : Prisma.CaraBayarUpdateInput = {}
      let {id, pembayaran, ...rest} = input
      carabayarUpdateData = rest
      carabayarUpdateData.metode = {
        connect : {
          id : metode
        }
      }
      if(metode == 2 && input.pembayaran?.giro) carabayarUpdateData.giro = {
        create : input.pembayaran.giro
      }

      if(metode == 3 && input.pembayaran?.transfer) carabayarUpdateData.transfer = {
        create : input.pembayaran.transfer
      }

      const result = await prismaClient.caraBayar.update({
        where : {
          id : input.id
        },
        data : carabayarUpdateData
      })
      return result
    }
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

    date.setHours(0)
    date.setMinutes(0)
    date.setSeconds(0)
    date.setMilliseconds(0)
    const carabayarTransfer = await prisma.caraBayar.findMany({
      where: {
        tanggal: {
          gte : date,
          lt : new Date(date.getTime() + 24 * 3600 * 60 * 100)
        },
        metodePembayaranId: metodePembayaran,
      },
    });

    codepembayaran += `-${carabayarTransfer.length + 1}`;

    return codepembayaran
  }
}
