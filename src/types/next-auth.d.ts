// src/types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    userId: string;
    profile: string;
    email: string;
    subscription_end_time?: string;
  }
  interface JWT {
    profile: string;
    subscription_end_time?: string;
  }
}
