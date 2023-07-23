import { prisma } from "../../prisma";
import { MainTrpc } from "../../trpc";

const customerTrpc = new MainTrpc()

export const CustomerRouter = customerTrpc.router({
  customers: customerTrpc.publicProcedure
    .query(() => {
      return prisma.customer.findMany();
    }),
})
