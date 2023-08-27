import { DistribusiPembayaran } from "@server/../generated/client";
import { prisma } from "@server/prisma";
import { CaraBayarService } from "../caraBayar/caraBayarService";
import { InvoiceService } from "../invoice/invoiceService";
import { PenagihanService } from "../penagihan/penagihanService";
import { TCaraBayarLama, TCreatePembayaranInput, TUpdatePembayaranInput } from "./pembayaranSchema";

export class PembayaranService {
  static async getPembayaranByPenagihan(penagihanId: string) {
    const result = await prisma.distribusiPembayaran.findFirst({
      where: {
        id: penagihanId,
      },
      include: {
        caraBayar: {
          include: {
            metode: true,
            giro: true,
            transfer: true,
          },
        },
      },
    });

    return result;
  }

  static async getPembayaranLama(carabayarId: string) {
    const result = await prisma.caraBayar.findFirst({
      where: {
        id: carabayarId,
      },
      include: {
        distribusiPembayaran : {
          include : {
            penagihan : {
              include : {
                invoice : true
              }
            }
          }
        },
        giro : true,
        transfer : true
      },
    });

    const cust = result?.distribusiPembayaran[0].penagihan.invoice.customerId

    return {
      result,
      customerId : cust
    };
  }


  static async createPembayaran(input: TCreatePembayaranInput) {
    const result = await prisma.$transaction(async (ctx) => {
      const carabayar = await CaraBayarService.createCaraBayar(input.carabayar, ctx)

      let distribusiHasil : DistribusiPembayaran[] = []

      for(let idx in input.distribusi) {
        const distribusi = input.distribusi[idx]
        const detailPenagihan = await PenagihanService.getPenagihan(distribusi.penagihanId);
        const invoice = await InvoiceService.getInvoice(detailPenagihan.invoiceId);

        const distribusiPembayaran = await ctx.distribusiPembayaran.create({
          data : {
            caraBayarId : carabayar.id,
            penagihanId : distribusi.penagihanId,
            jumlah : distribusi.total
          }
        })

        distribusiHasil.push(distribusiPembayaran)

        await ctx.penagihan.update({
          where : {
            id : distribusiPembayaran.penagihanId,
          },
          data : {
            status : distribusiPembayaran.jumlah <= invoice.sisa ? "CICILAN" : "LUNAS"
          }
        })
      }

      return distribusiHasil;
    });

    return {
      distribusiHasil : result
    };
  }

  static async updatePembayaran(input: TUpdatePembayaranInput) {
    const result = await prisma.$transaction(async (ctx) => {
      const carabayar = await CaraBayarService.updateCaraBayar(input.carabayar, ctx)
      const distribusiLama = await ctx.distribusiPembayaran.findMany({
        where : {
          caraBayarId : carabayar.id
        }
      })
      let distribusiBaru : DistribusiPembayaran[] = []
      let distribusiUpdated : DistribusiPembayaran[] = []
      let distribusiDeleted : DistribusiPembayaran[] = []
      
      // delete unused distribusi
      // if there is only one distribusi for some penagihan, so penagihan status will changed to waiting
      // update old distirbusi
      for(let idx in distribusiLama) {
        const distLama = distribusiLama[idx]
        const findDistlama = input.distribusiLama.find(f => f.distribusiId == distLama.id)
        if(findDistlama) {
          const dist = await ctx.distribusiPembayaran.update({
            where : {
              id : findDistlama.distribusiId
            },
            data : {
              jumlah : findDistlama.total
            }
          })

          distribusiDeleted.push(dist)
        } else {
          const dist = await ctx.distribusiPembayaran.delete({
            where : {
              id : distLama.id
            }
          })

          const infopenagihan = await ctx.penagihan.findFirst({
            where : {
              id : distLama.penagihanId
            },
            include : {
              distribusiPembayaran : true
            }
          })

          if(infopenagihan?.distribusiPembayaran.length == 0) {
            await ctx.penagihan.update({
              where : {
                id : dist.penagihanId
              }, 
                data : { 
                    status : "WAITING"
                }
            })
          }

          distribusiDeleted.push(dist)
        }
      }

      // recreate new distribusi
      for(let idx in input.distribusiBaru) {
        const distribusi = input.distribusiBaru[idx]
        const detailPenagihan = await PenagihanService.getPenagihan(distribusi.penagihanId);
        const invoice = await InvoiceService.getInvoice(detailPenagihan.invoiceId);

        const distribusiPembayaran = await ctx.distribusiPembayaran.create({
          data : {
            caraBayarId : carabayar.id,
            penagihanId : distribusi.penagihanId,
            jumlah : distribusi.total
          }
        })

        distribusiBaru.push(distribusiPembayaran)

        await ctx.penagihan.update({
          where : {
            id : distribusiPembayaran.penagihanId,
          },
          data : {
            status : distribusiPembayaran.jumlah <= invoice.sisa ? "CICILAN" : "LUNAS"
          }
        })
      }

      return {
        deleted : distribusiDeleted,
        updated : distribusiUpdated,
        created : distribusiUpdated
      };
    });

    return result;
  }

  static async getMetodePembayaran () {
    const result = await prisma.metodePembayaran.findMany()
    return result
  }
}
