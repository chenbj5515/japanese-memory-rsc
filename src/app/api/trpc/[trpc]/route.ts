import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter } from '@/server'

/**
 * tRPC's HTTP response handler
 * @link https://trpc.io/docs/server/adapters/nextjs
 */
const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => ({}),
  })

export { handler as GET, handler as POST }
