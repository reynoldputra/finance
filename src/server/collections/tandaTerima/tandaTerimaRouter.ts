import { MainTrpc } from "@server/trpc";
import { TandaTerimaService } from "./tandaTerimaService";

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
      };
    }
  }),
});
