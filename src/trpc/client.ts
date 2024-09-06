import { createTRPCReact } from '@trpc/react-query'
import type { AppRouter } from '@/server'

/**
 * React hooks from `AppRouter`
 * @link https://trpc.io/docs/client/react/setup#2-import-your-approuter
 */
export const trpc = createTRPCReact<AppRouter>()