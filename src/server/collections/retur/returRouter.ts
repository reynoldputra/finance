import { MainTrpc } from "@server/trpc";
import { z } from "zod";
import { returService } from "./returService";
import { TInputReturFileArray, inputReturFileArray } from "./returSchema";

const returTrpc = new MainTrpc();

export const returRouter = returTrpc.router({
  createReturFromFile: returTrpc.publicProcedure
    .input(inputReturFileArray)
    .mutation(async ({ input }: { input: TInputReturFileArray }) => {
      try {
        const res = await returService.createReturFromFile(input);
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
  getAllRetur: returTrpc.publicProcedure.query(async () => {
    try {
      const res = await returService.getAllRetur();
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
