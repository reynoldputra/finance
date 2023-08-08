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
        distribusiPembayaran : true
      },
    });

    return result;
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
      await CaraBayarService.deleteCaraBayar(input.carabayar.id)
      const carabayar = await CaraBayarService.createCaraBayar(input.carabayar)
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

    return result;
  }
}
