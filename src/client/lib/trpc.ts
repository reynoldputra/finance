import { createTRPCReact } from "@trpc/react-query";
import { AppRouter } from "@client/../server/router";

export const trpc = createTRPCReact<AppRouter>();
