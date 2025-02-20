import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '../../../../server/trpc/router';

const handler = (req: Request) => {
  console.log("Received request to /api/trpc");
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => ({})
  });
};

export { handler as GET, handler as POST };
