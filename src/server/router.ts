import { CustomerRouter } from "./collections/customer/customerRouter";
import { InvoiceRouter } from "./collections/invoice/invoiceRouter";
import { PenagihanRouter } from "./collections/penagihan/penagihanRouter";
import { MainTrpc } from "./trpc";

const mainTrpc = new MainTrpc()

export const appRouter = mainTrpc.router({
  customer : CustomerRouter,
  invoice : InvoiceRouter,
  penagihan : PenagihanRouter
})

export type AppRouter = typeof appRouter;
