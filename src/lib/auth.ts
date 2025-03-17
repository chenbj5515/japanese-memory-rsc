import { betterAuth } from 'better-auth';
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/prisma"; // your drizzle instance
import { headers } from "next/headers";

export const auth = betterAuth({
  // 使用标准Prisma适配器
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),

  // 配置Providers
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    },
  },

  // JWT配置
  jwt: {
    secret: process.env.JWT_SECRET || 'your-jwt-secret',
    expiresIn: '7d',
  },

  // Cookie配置
  cookie: {
    name: 'session',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
  },

  // 页面配置
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },

  // 跨域支持
  cors: {
    origin: true,
    credentials: true,
  },
});

// API包装函数
export async function getSession() {
  return await auth.api.getSession({
    headers: await headers() // you need to pass the headers object.
  })
}

export async function signIn(provider: string, options?: any) {
  return { url: `/api/auth/better-auth/signin/${provider}` };
}

export async function signOut() {
  return { redirect: '/api/auth/better-auth/signout' };
}