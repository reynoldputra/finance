import { MainTrpc } from "../../trpc";
import { InvoiceService } from "./invoiceService";
import {
  createInvoiceInput,
  TCreateInvoiceInput,
  updateInvoiceInput,
  TUpdateInvoiceInput,
  inputInvoiceFileArray,
  TInputInvoiceFileArray,
} from "./invoiceSchema";
import { z } from "zod";

const invoiceTrpc = new MainTrpc();

export const InvoiceRouter = invoiceTrpc.router({
  createInvoice: invoiceTrpc.publicProcedure
    .input(createInvoiceInput)
    .mutation(async ({ input }: { input: TCreateInvoiceInput }) => {
      try {
        const res = await InvoiceService.createInvoice(input);
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

  updateInvoice: invoiceTrpc.publicProcedure
    .input(updateInvoiceInput)
    .mutation(async ({ input }: { input: TUpdateInvoiceInput }) => {
      try {
        const res = await InvoiceService.updateInvoice(input);
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

  deleteInvoice: invoiceTrpc.publicProcedure
    .input(z.string())
    .mutation(async ({ input: id }) => {
      try {
        const res = await InvoiceService.deleteInvoice(id);
        return {
          status: true,
          data: res,
        };
      } catch (err) {
        return {
          status: false,
          message: (err as Error).message ?? "",
        };
      }
    }),

  getInvoices: invoiceTrpc.publicProcedure.query(async () => {
    try {
      const res = await InvoiceService.getAllInvoices();
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

  createInvoiceFromFile: invoiceTrpc.publicProcedure
    .input(inputInvoiceFileArray)
    .mutation(async ({ input }: { input: TInputInvoiceFileArray }) => {
      try {
        const res = await InvoiceService.createInvoiceFromFile(input);
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
