import { CustomerRouter } from "./collections/customer/customerRouter";
import { InvoiceRouter } from "./collections/invoice/invoiceRouter";
import { MainTrpc } from "./trpc";

const mainTrpc = new MainTrpc()

export const appRouter = mainTrpc.router({
  customer : CustomerRouter,
  invoice : InvoiceRouter
})

export type AppRouter = typeof appRouter;
