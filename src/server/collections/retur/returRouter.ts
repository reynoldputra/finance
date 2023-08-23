import { MainTrpc } from "@server/trpc";
import { z } from "zod";
import { returService } from "./returService";
import {
  TCreateReturInput,
  TInputReturFileArray,
  TUpdateReturInput,
  createReturInput,
  inputReturFileArray,
  updateReturInput,
} from "./returSchema";

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
  createRetur: returTrpc.publicProcedure
    .input(createReturInput)
    .mutation(async ({ input }: { input: TCreateReturInput }) => {
      try {
        const res = await returService.createRetur(input);
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
  deleteRetur: returTrpc.publicProcedure
    .input(z.string())
    .mutation(async ({ input: id }) => {
      try {
        const res = await returService.deleteRetur(id);
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
  updateRetur: returTrpc.publicProcedure
    .input(updateReturInput)
    .mutation(async ({ input }: { input: TUpdateReturInput }) => {
      try {
        const res = await returService.updateRetur(input);
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