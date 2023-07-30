import { MainTrpc } from "../../trpc";
import { CustomerService } from "./customerService";
import {
  TCreateCustomerInput,
  TDeleteCustomerInput,
  TUpdateCustomerInput,
  createCustomerInput,
  deleteCustomerInput,
  updateCustomerInput,
} from "./customerSchema";

const customerTrpc = new MainTrpc();

export const CustomerRouter = customerTrpc.router({
  customerTable: customerTrpc.publicProcedure.query(() => {
    return CustomerService.getCustomerTable();
  }),
  createCustomer: customerTrpc.publicProcedure
    .input(createCustomerInput)
    .mutation(async ({ input }: { input: TCreateCustomerInput }) => {
      try {
        const res = await CustomerService.createCustomer(input);
        return {
          status: true,
          data: res,
        };
      } catch (err) {
        return {
          status: false,
        };
      }
    }),
  updateCustomer: customerTrpc.publicProcedure
    .input(updateCustomerInput)
    .mutation(async ({ input }: { input: TUpdateCustomerInput }) => {
      try {
        const res = await CustomerService.updateCostumer(input);
        return {
          status: true,
          data: res,
        };
      } catch (err) {
        return {
          status: false,
        };
      }
    }),
  deleteCustomer: customerTrpc.publicProcedure
    .input(deleteCustomerInput)
    .mutation(async ({ input }: { input: TDeleteCustomerInput }) => {
      try {
        const res = await CustomerService.deleteCustomer(input);
        return {
          status: true,
          data: res,
        };
      } catch (err) {
        return {
          status: false,
        };
      }
    }),
});
