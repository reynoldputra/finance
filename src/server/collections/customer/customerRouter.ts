import { MainTrpc } from "../../trpc";
import { CustomerService } from "./customerService";

const customerTrpc = new MainTrpc()

export const CustomerRouter = customerTrpc.router({
  customerTable: customerTrpc.publicProcedure
    .query(() => {
      return CustomerService.getCustomerTable();
    }),
})
