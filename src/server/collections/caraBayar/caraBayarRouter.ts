import { z } from "zod";
import { MainTrpc } from "../../trpc";
import { createCaraBayarInput, TCreateCaraBayarInput, updateCaraBayarInput, TUpdateCaraBayarInput } from "./caraBayarSchema";
import { CaraBayarService } from "./caraBayarService";

const carabayarTrpc = new MainTrpc();

export const CarabayarRouter = carabayarTrpc.router({
  getCarabayar: carabayarTrpc.publicProcedure.query(async () => {
    try {
      const res = await CaraBayarService.getCaraBayar();
      return {
        status: true,
        data: res,
      };
    } catch (err) {
      console.log(err)
      return {
        status: false,
      };
    }
  }),
  getReportSetoranBank: carabayarTrpc.publicProcedure
    .input(z.object({
      tanggalPenagihan: z.date(),
      tanggalPembayaran: z.date(),
    }))
    .query(async ({ input }) => {
      try {
        const res = await CaraBayarService.getReportSetoranBank(input.tanggalPenagihan, input.tanggalPembayaran);
        return {
          status: true,
          data: res,
        };
      } catch (err) {
        console.log(err)
        return {
          status: false,
        };
      }
    }),
  createCarabayar: carabayarTrpc.publicProcedure
    .input(createCaraBayarInput)
    .mutation(async ({ input }: { input: TCreateCaraBayarInput }) => {
      try {
        const res = await CaraBayarService.createCaraBayar(input);
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
  updateCarabayar: carabayarTrpc.publicProcedure
    .input(updateCaraBayarInput)
    .mutation(async ({ input }: { input: TUpdateCaraBayarInput }) => {
      try {
        const res = await CaraBayarService.updateCaraBayar(input);
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
  deleteCarabayar: carabayarTrpc.publicProcedure
    .input(z.string())
    .mutation(async ({ input: id }) => {
      try {
        const res = await CaraBayarService.deleteCaraBayar(id);
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
