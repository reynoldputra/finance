import { Retur } from "../../../generated/client";
import { prisma } from "../../prisma";
import {
  TCreateReturInvoiceInput,
  TInputReturFileArray,
} from "./returSchema";

export class returService {
  public static async createReturFromFile(transactions: TInputReturFileArray) {
    const returs = await prisma.$transaction(async (tx) => {
      const createdReturs: Retur[] = [];
      for (const transaction of transactions) {
        const { transaksiId, noRetur, tanggalTransaksi, total, type } =
          transaction;
        let invoice = await tx.invoice.findUnique({
          where: { transaksiId: transaksiId },
        });
        if (invoice) {
          const retur = await tx.retur.create({
            data: {
              noRetur,
              total,
              tanggalTransaksi,
              type,
              invoice: { connect: { id: invoice.id } },
            },
          });
          createdReturs.push(retur);
        } else {
          console.error(`Invoice with transaksiId ${transaksiId} not found.`);
        }
      }
      return createdReturs;
    });
    return returs;
  }

  public static async getAllRetur() {
    const res = await prisma.retur.findMany({
      include: {
        invoice: true
      }
    });

    console.log(res)

    interface parsedRetur {
      total: number;
      id: string;
      noRetur: string;
      tanggalTransaksi: Date;
      type: string;
      createdAt: Date;
      updatedAt: Date;
      invoice: {
        transaksiId: string,
        total: number
      }[]
    }

    const parsed: parsedRetur[] = []

    for (let returId in res) {
      const retur = res[returId]
      const find = parsed.findIndex(v => v.noRetur == retur.noRetur)
      if (find) {
        parsed[find].total += retur.total
        parsed[find].invoice.push({
          transaksiId: retur.invoice.transaksiId,
          total: retur.total,
        })
      } else {
        parsed.push({
          ...retur,
          invoice: [{
            transaksiId: retur.invoice.transaksiId,
            total: retur.total
          }]
        })
      }
    }

    return parsed;
  }

  public static async createRetur(input: TCreateReturInvoiceInput) {
    const { noRetur, tanggalTransaksi, type, invoice } = input;

    const res = await prisma.$transaction(async (tx) => {
      const group: Retur[] = []
      for (let idx in invoice) {
        const inv = invoice[idx]
        const result = await tx.retur.create({
          data: {
            tanggalTransaksi,
            noRetur,
            type,
            invoiceId: inv.invoiceId,
            total: inv.total,
          }
        })

        group.push(result)
      }

      return group
    })

    return res;
  }

  public static async deleteRetur(id: string) {
    const res = await prisma.$transaction(async (tx) => {
      const returs = await tx.retur.findMany({
        where: {
          noRetur: id
        }
      })

      const group: Retur[] = []
      for (let idx in returs) {
        const res = await tx.retur.delete({
          where: {
            id: returs[idx].id
          },
        });

        group.push(res)

      }

      return group
    })
    return res;
  }

  public static async updateRetur(input: TCreateReturInvoiceInput) {
    await this.deleteRetur(input.noRetur)
    const result = this.createRetur(input)
    return result;
  }
}
