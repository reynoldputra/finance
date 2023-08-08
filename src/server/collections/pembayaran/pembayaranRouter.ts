import { z } from "zod";
import { MainTrpc } from "../../trpc";
import {
  TCreatePembayaranInput,
  TUpdatePembayaranInput,
  createPembayaranWithCarabayarInput,
  updatePemabayaranWithCarabayarInput,
} from "./pembayaranSchema";
import { PembayaranService } from "./pembayaranService";

const pembayaranTrpc = new MainTrpc();

export const pembayaranRouter = pembayaranTrpc.router({
  getPembayaranByPenagihan: pembayaranTrpc.publicProcedure
    .input(z.string())
    .query(async ({ input: id }) => {
      try {
        const res = await PembayaranService.getPembayaranByPenagihan(id);
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

  getPembayaranLama: pembayaranTrpc.publicProcedure
    .input(z.string())
    .query(async ({ input: id }) => {
      try {
        const res = await PembayaranService.getPembayaranLama(id);
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

  createPembayaran: pembayaranTrpc.publicProcedure
    .input(createPembayaranWithCarabayarInput)
    .mutation(async ({ input }: { input: TCreatePembayaranInput }) => {
      try {
        const res = await PembayaranService.createPembayaran(input);
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

  updatePembayaran: pembayaranTrpc.publicProcedure
    .input(updatePemabayaranWithCarabayarInput)
    .mutation(async ({ input }: { input: TUpdatePembayaranInput }) => {
      try {
        const res = await PembayaranService.updatePembayaran(input);
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
