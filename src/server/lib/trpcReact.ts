import { createTRPCReact } from "@trpc/react-query";
import { AppRouter } from "../router";

export const trpcReact = createTRPCReact<AppRouter>();
