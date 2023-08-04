import { CarabayarRouter } from "./collections/caraBayar/caraBayarRouter";
import { CustomerRouter } from "./collections/customer/customerRouter";
import { InvoiceRouter } from "./collections/invoice/invoiceRouter";
import { KolektorRouter } from "./collections/kolektor/kolektorRouter";
import { pembayaranRouter } from "./collections/pembayaran/pembayaranRouter";
import { PenagihanRouter } from "./collections/penagihan/penagihanRouter";
import { MainTrpc } from "./trpc";

const mainTrpc = new MainTrpc()

export const appRouter = mainTrpc.router({
  customer : CustomerRouter,
  invoice : InvoiceRouter,
  kolektor : KolektorRouter,
  penagihan : PenagihanRouter,
  carabayar : CarabayarRouter,
  pembayaran : pembayaranRouter
})

export type AppRouter = typeof appRouter;
