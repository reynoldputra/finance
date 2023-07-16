import { initTRPC } from "@trpc/server";
import { prisma } from "./prisma";
import * as z from "zod";
import superjson from "superjson";

const t = initTRPC.create({
  transformer: superjson,
});

export const appRouter = t.router({
  // users: t.procedure
  //   .query(() => {
  //     return prisma.user.findMany();
  //   }),
  getAllTagihanByCustomerId: t.procedure
    .input(z.string())
    .query(({ input: customerId }) => {
      return prisma.tagihan.findMany({
        where: {
          customerId,
        },
      });
    }),
  getAllTagihanByDate: t.procedure
    .input(z.object({
      startDate: z.string().transform((val) => new Date(val)),
      endDate: z.string().transform((val) => new Date(val)),
    }))
    .query(({ input: { startDate, endDate } }) => {
      return prisma.tagihan.findMany({
        where: {
         tanggal: {
          gte: startDate,
          lte: endDate
         }
        },
      });
    }),
  getAllPembayaranByInvoiceId: t.procedure
    .input(z.string())
    .query(({ input: invoiceId }) => {
      return prisma.pembayaran.findMany({
        include: {
          caraBayar: {
            where : {
              invoiceId
            }
          },
        },
      });
    }),
  // userCreate: t.procedure
  //   .input(z.object({
  //     name: z.string(),
  //     dateCreated: z.date()
  //   }))
  //   .mutation(async ({input: {name, dateCreated}}) => {
  //     const user = await prisma.user.create({
  //       data: {
  //         name,
  //         dateCreated
  //       }
  //     });
  //     return user;
  //   })
});

export type AppRouter = typeof appRouter;
