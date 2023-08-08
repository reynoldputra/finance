import { prisma } from "@server/prisma";

export class TandaTerimaService {
  public static async getTandaTerimaTable() {
    const result = await prisma.tandaTerima.findMany({
      include: {
        tandaTerimaInvoice: {
          select: {
            invoice: {
              select: {
                id: true,
                total: true,
                customer: {
                  select: {
                    nama: true,
                  },
                },
                penagihan: {
                  select: {
                    distribusiPembayaran: {
                      select: {
                        jumlah: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
    console.log(result)
    return result
  }
}
