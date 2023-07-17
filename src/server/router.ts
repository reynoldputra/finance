import { initTRPC } from "@trpc/server";
import { prisma } from "./prisma";
import * as z from "zod";
import superjson from "superjson";

const t = initTRPC.create({
  transformer: superjson,
});

export const appRouter = t.router({
  getAllPembayaranByCustomerId: t.procedure.input(z.string()).query(({ input: customerId }) => {
    return prisma.pembayaran.findMany({
      where: {
        PembayaranInvoice: {
          some: {
            invoice: {
              customerId,
            },
          },
        },
      },
    });
  }),
  getAllPembayaranByDate: t.procedure
    .input(
      z.object({
        startDate: z.string().transform((val) => new Date(val)),
        endDate: z.string().transform((val) => new Date(val)),
      })
    )
    .query(({ input: { startDate, endDate } }) => {
      return prisma.pembayaran.findMany({
        where: {
          tanggal: {
            gte: startDate,
            lte: endDate,
          },
        },
        include: {
          PembayaranInvoice: {
            include: {
              distribusiPembayaran: {
                include: {
                  CaraBayar: {
                    include: {
                      metode: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
    }),
  // getAllPembayaranByInvoiceId: t.procedure.input(z.string()).query(({ input: invoiceId }) => {
  //   return prisma.pembayaran.findMany({
  //     include: {
  //       caraBayar: {
  //         where: {
  //           invoiceId,
  //         },
  //       },
  //     },
  //   });
  // }),
});

export type AppRouter = typeof appRouter;
