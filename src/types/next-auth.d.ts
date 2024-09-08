// src/types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    userId: string; // 为 session 添加 userId 字段
  }
}
