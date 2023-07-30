import { z } from "zod";
import { MainTrpc } from "../../trpc";
import {
  createPenagihanInput,
  TCreatePenagihanInput,
  updatePenagihanInput,
  TUpdatePenagihanInput,
} from "./penagihanSchema";
import { PenagihanService } from "./penagihanService";

const penagihanTrpc = new MainTrpc();

export const PenagihanRouter = penagihanTrpc.router({
  getAllPenagihan: penagihanTrpc.publicProcedure.query(async () => {
    try {
      const res = await PenagihanService.getAllPenagihan();
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

  createPenagihan: penagihanTrpc.publicProcedure
    .input(createPenagihanInput)
    .mutation(async ({ input }: { input: TCreatePenagihanInput }) => {
      try {
        const res = await PenagihanService.createPenagihan(input);
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

  updatePenagihan: penagihanTrpc.publicProcedure
    .input(updatePenagihanInput)
    .mutation(async ({ input }: { input: TUpdatePenagihanInput }) => {
      try {
        const res = await PenagihanService.updatePenagihan(input);
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

  deletePenagihan: penagihanTrpc.publicProcedure
    .input(z.string())
    .mutation(async ({ input: id }) => {
      try {
        const res = await PenagihanService.deletePenagihan(id);
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
