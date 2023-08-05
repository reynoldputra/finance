import { MainTrpc } from "../../trpc";
import { CustomerService } from "./customerService";
import {
  TCreateCustomerInput,
  TUpdateCustomerInput,
  createCustomerInput,
  updateCustomerInput,
} from "./customerSchema";
import { z } from "zod";

const customerTrpc = new MainTrpc();

export const CustomerRouter = customerTrpc.router({
  customerTable: customerTrpc.publicProcedure.query(() => {
    return CustomerService.getCustomerTable();
  }),
  customerOption: customerTrpc.publicProcedure.query(() => {
    return CustomerService.getAllCustomer();
  }),
  customerDetail: customerTrpc.publicProcedure
    .input(z.string())
    .query(({ input }: { input: string }) => {
      return CustomerService.getDetailCustomer(input);
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
    .input(z.string())
    .mutation(async ({ input }: { input: string }) => {
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
  getKolektorHistory: customerTrpc.publicProcedure
    .input(z.string())
    .mutation(async ({ input }: { input: string }) => {
      try {
        const res = await CustomerService.getKolektorHistory(input);
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
