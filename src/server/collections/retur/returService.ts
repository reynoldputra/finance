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
        const { transaksiId, noRetur, tanggalTransaksi, total, type } = transaction;
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

  public static async getOneRetur(noretur : string) {
    const res = await prisma.retur.findMany({
      include: {
        invoice: true
      },
      where : {
        noRetur : noretur
      }
    });

    interface parsedRetur {
      id: string;
      noRetur: string;
      tanggalTransaksi: Date;
      type: string;
      total: number;
      createdAt: Date;
      updatedAt: Date;
      invoice: {
        invoiceId : string,
        transaksiId: string,
        total: number
      }[]
    }

    const parsed: parsedRetur = {
      id: res[0].id,
      noRetur: res[0].id,
      tanggalTransaksi: res[0].tanggalTransaksi,
      type: res[0].id,
      total: 0,
      createdAt: res[0].createdAt,
      updatedAt: res[0].updatedAt,
      invoice : []
    }

    for (let id in res) {
      const inv = res[id]
      parsed.total += inv.total
      parsed.invoice.push({
        invoiceId : inv.invoiceId,
        transaksiId : inv.invoice.transaksiId,
        total : inv.total
      })
    }

    return parsed;
  }

  public static async getAllRetur() {
    const res = await prisma.retur.findMany({
      include: {
        invoice: {
          include : {
            customer : true
          }
        } 
      }
    });

    interface parsedRetur {
      id: string;
      noRetur: string;
      tanggalTransaksi: Date;
      customerId : string;
      customerName : string
      type: string;
      total: number;
      invoice: {
        transaksiId: string,
        invoiceId: string,
        total: number
      }[]
    }

    const parsed: parsedRetur[] = []

    for (let returId in res) {
      const retur = res[returId]
      const find = parsed.findIndex(v => v.noRetur == retur.noRetur)
      if (find != -1) {
        parsed[find].total += retur.total
        parsed[find].invoice.push({
          transaksiId: retur.invoice.transaksiId,
          invoiceId: retur.invoiceId,
          total: retur.total,
        })
      } else {
        parsed.push({
          id: retur.id,
          noRetur: retur.noRetur,
          tanggalTransaksi: retur.tanggalTransaksi,
          customerId : retur.invoice.customer.id,
          customerName : retur.invoice.customer.nama,
          type: retur.type,
          total: retur.total,
          invoice: [{
            transaksiId: retur.invoice.transaksiId,
            invoiceId: retur.invoiceId,
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
