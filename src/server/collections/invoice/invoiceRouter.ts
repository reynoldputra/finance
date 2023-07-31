import { MainTrpc } from "../../trpc";
import { InvoiceService } from "./invoiceService";
import { createInvoiceInput, TCreateInvoiceInput } from "./invoiceSchema";

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
});
