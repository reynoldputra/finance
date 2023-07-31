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

  static async createPembayaran(input: TCreatePembayaranInput) {
    const result = await prisma.$transaction(async (ctx) => {
      let carabayarBaru: TCaraBayarLama[] = [];
      if (input.caraBayarBaru) {
        for (let idx in input.caraBayarBaru) {
          let inputCaraBayar = input.caraBayarBaru[idx];
          const carabayar = await CaraBayarService.createCaraBayar(inputCaraBayar);
          carabayarBaru.push({
            id: carabayar.id,
            totalDistribusi: inputCaraBayar.totalDistribusi,
          });
        }
      }
      if (input.caraBayarLama) carabayarBaru.concat(input.caraBayarLama);

      const totalPembayaranPenagihan = carabayarBaru.reduce((tot, cur) => {
        return (tot += cur.totalDistribusi);
      }, 0);

      const detailPenagihan = await PenagihanService.getPenagihan(input.penagihanId);
      const invoice = await InvoiceService.getInvoice(detailPenagihan.invoiceId);

      let statusPenagihan = "";

      if (invoice.total - invoice.totalPembayaran > totalPembayaranPenagihan) {
        statusPenagihan = "CICILAN";
      } else if (totalPembayaranPenagihan > 0) {
        statusPenagihan = "LUNAS";
      } else {
        statusPenagihan = "NIHIL";
      }

      const distribusiPembayaran = await ctx.penagihan.update({
        where: {
          id: input.penagihanId,
        },
        data: {
          distribusiPembayaran: {
            create: carabayarBaru.map((c) => {
              return {
                jumlah: c.totalDistribusi,
                caraBayarId: c.id,
              };
            }),
          },
          status: statusPenagihan,
        },
      });

      return distribusiPembayaran;
    });

    return result;
  }

  static async updatePembayaran(input: TUpdatePembayaranInput) {
    const result = await prisma.$transaction(async (ctx) => {
      let carabayarBaru: TCaraBayarLama[] = [];
      if (input.caraBayarBaru) {
        for (let idx in input.caraBayarBaru) {
          let inputCaraBayar = input.caraBayarBaru[idx];
          const carabayar = await CaraBayarService.createCaraBayar(inputCaraBayar);
          carabayarBaru.push({
            id: carabayar.id,
            totalDistribusi: inputCaraBayar.totalDistribusi,
          });
        }
      }

      await ctx.distribusiPembayaran.deleteMany({
        where: {
          penagihanId: input.penagihanId,
        },
      });

      if (input.caraBayarLama) carabayarBaru.concat(input.caraBayarLama);

      const totalPembayaranPenagihan = carabayarBaru.reduce((tot, cur) => {
        return (tot += cur.totalDistribusi);
      }, 0);

      const detailPenagihan = await PenagihanService.getPenagihan(input.penagihanId);
      const invoice = await InvoiceService.getInvoice(detailPenagihan.invoiceId);

      let statusPenagihan = "";

      if (invoice.total - invoice.totalPembayaran > totalPembayaranPenagihan) {
        statusPenagihan = "CICILAN";
      } else if (totalPembayaranPenagihan > 0) {
        statusPenagihan = "LUNAS";
      } else {
        statusPenagihan = "NIHIL";
      }

      const distribusiPembayaran = await ctx.penagihan.update({
        where: {
          id: input.penagihanId,
        },
        data: {
          distribusiPembayaran: {
            create: carabayarBaru.map((c) => {
              return {
                jumlah: c.totalDistribusi,
                caraBayarId: c.id,
              };
            }),
          },
          status: statusPenagihan,
        },
      });

      return distribusiPembayaran;
    });

    return result;
  }
}
