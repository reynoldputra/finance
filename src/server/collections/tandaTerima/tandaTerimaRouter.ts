import { MainTrpc } from "@server/trpc";
import { TandaTerimaService } from "./tandaTerimaService";
import { z } from "zod";
import { createTandaTerimaInput, TCreateTandaTerimaInput } from "./tandaTerimaSchema";

const tandaTerimaTrpc = new MainTrpc();

export const TandaterimaRouter = tandaTerimaTrpc.router({
  getTandaTerimaTable: tandaTerimaTrpc.publicProcedure.query(async () => {
    try {
      const res = await TandaTerimaService.getTandaTerimaTable();
      return {
        status: true,
        data: res,
      };
    } catch (err) {
      return {
        status: false,
        err: err,
      };
    }
  }),
  getTandaTerimaDetail: tandaTerimaTrpc.publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      try {
        const res = await TandaTerimaService.getDetailTandaTerima(input);
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
    createTandaTerima: tandaTerimaTrpc.publicProcedure
      .input(createTandaTerimaInput)
      .mutation(async ({input} : {input: TCreateTandaTerimaInput}) => {
        try {
          const res = await TandaTerimaService.createTandaTerima(input);
          return {
            status: true,
            data: res,
          }
        } catch (err) {
          return {
            status: false
          }
        }
      })
});
