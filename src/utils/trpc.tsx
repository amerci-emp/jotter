import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import { QueryClient } from "@tanstack/react-query";
import type { AppRouter } from "../server/trpc/router";

export const trpc = createTRPCReact<AppRouter>();

export const queryClient = new QueryClient();

console.log("In Utils Trpc")
export const trpcClient = trpc.createClient({
   transformer: superjson,
   links: [
      httpBatchLink({
         url: "/api/trpc",
      }),
   ],
});
