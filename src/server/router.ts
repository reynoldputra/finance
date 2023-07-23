import { CustomerRouter } from "./collections/customer/customerRouter";
import { MainTrpc } from "./trpc";

const mainTrpc = new MainTrpc()

export const appRouter = mainTrpc.router({
  customer : CustomerRouter
})

export type AppRouter = typeof appRouter;
