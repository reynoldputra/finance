import { MainTrpc } from "@server/trpc";
import { KolektorService } from "./kolektorService";
import {
  createKolektorInput,
  TCreateKolektorInput,
  TUpdateKolektorInput,
  updateKolektorInput,
} from "./kolektorSchema";
import { z } from "zod";

const kolektorTrpc = new MainTrpc();

export const KolektorRouter = kolektorTrpc.router({
  getAllKolektor: kolektorTrpc.publicProcedure.query(async () => {
    try {
      const res = await KolektorService.getAllKolektor();
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
  createKolektor: kolektorTrpc.publicProcedure
    .input(createKolektorInput)
    .mutation(async ({ input }: { input: TCreateKolektorInput }) => {
      try {
        const res = await KolektorService.createKolektor(input);
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
  deleteKolektor: kolektorTrpc.publicProcedure
    .input(z.string())
    .mutation(async ({ input }: { input: string }) => {
      try {
        const res = await KolektorService.deleteKolektor(input);
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
  updateKolektor: kolektorTrpc.publicProcedure
    .input(updateKolektorInput)
    .mutation(async ({ input }: { input: TUpdateKolektorInput }) => {
      try {
        const res = await KolektorService.updateKolektor(input);
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
