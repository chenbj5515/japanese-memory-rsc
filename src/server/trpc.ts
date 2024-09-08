/**
 * Initialization of tRPC backend
 * @link https://trpc.io/docs/server/routers
 */
import { initTRPC } from '@trpc/server'
import { getSession } from 'next-auth/react';

const t = initTRPC.create()

/**
 * Create router
 * @link https://trpc.io/docs/v11/router
 */
export const router = t.router

/**
 * Create public procedure
 * @link https://trpc.io/docs/v11/procedures
 **/
export const procedure = t.procedure

/**
 * Create createCallerFactory
 * @link https://trpc.io/docs/v11/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory


// 创建一个鉴权中间件
const isAuthed = t.middleware(async ({ ctx, next }) => {
  // 从请求上下文中获取 session
  const session = await getSession(ctx);

  // 如果用户没有登录，抛出错误
  if (!session) {
    throw new Error('Not authenticated');
  }

  // 将用户信息附加到上下文中，继续请求
  return next({
    ctx: {
      ...ctx,
      session,
    },
  });
});

// 创建一个受保护的路由
export const protectedProcedure = t.procedure.use(isAuthed);