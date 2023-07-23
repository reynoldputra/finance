import { initTRPC } from '@trpc/server';
import superjson from 'superjson'
 
export class MainTrpc {
  private t = initTRPC.create({
    transformer : superjson
  });

  public middleware = this.t.middleware;
  public publicProcedure = this.t.procedure;
  public router = this.t.router;
}
