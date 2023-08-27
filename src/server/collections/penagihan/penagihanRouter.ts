import { z } from "zod";
import { MainTrpc } from "../../trpc";
import {
  createPenagihanInput,
  TCreatePenagihanInput,
  updatePenagihanInput,
  TUpdatePenagihanInput,
  updateTT,
  TUpdateTT,
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
  getReportAccounting: penagihanTrpc.publicProcedure
    .input(z.object({
      tanggalPenagihan : z.date(),
      tanggalPembayaran : z.date()
    }))
    .query(async ({input}) => {
    try {
      const res = await PenagihanService.getAccoutingReport(input.tanggalPenagihan, input.tanggalPembayaran);
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
  getPenagihanById: penagihanTrpc.publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      try {
        const res = await PenagihanService.getPenagihan(input);
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
  getPenagihanSisa: penagihanTrpc.publicProcedure.query(async () => {
    try {
      const res = await PenagihanService.getPenagihanSisa();
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
  getPenagihanByCarabayar: penagihanTrpc.publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      try {
        const res = await PenagihanService.getPenagihanByCarabayar(input);
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

  getPenagihanByDate: penagihanTrpc.publicProcedure
    .input(z.date())
    .query(async ({ input }) => {
      try {
        const res = await PenagihanService.getPenagihanByDate(input);
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

  createManyPenagihan: penagihanTrpc.publicProcedure
    .input(z.array(createPenagihanInput))
    .mutation(async ({ input }: { input: TCreatePenagihanInput[] }) => {
      try {
        const res = await PenagihanService.createManyPenagihan(input);
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

  updateStatusToNihil: penagihanTrpc.publicProcedure
    .input(z.string())
    .mutation(async ({ input: id }) => {
      try {
        const res = await PenagihanService.updateStatusToNihil(id);
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
  updateTT: penagihanTrpc.publicProcedure
    .input(updateTT)
    .mutation(async ({ input }: { input: TUpdateTT }) => {
      try {
        const res = await PenagihanService.updateTT(input);
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
