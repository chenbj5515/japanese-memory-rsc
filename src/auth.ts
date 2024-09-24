
import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import { prisma } from "@/prisma"

export const findUserByPlatformID = async (platform_id: string) => {
  const user = await prisma.user.findFirst({
    where: {
      github_id: platform_id,
    },
  });
  return user;
};

export const createUserInDatabase = async (
  email: string,
  platform_id: string,
  name?: string | null,
  image?: string | null,
) => {
  const newUser = await prisma.user.create({
    data: {
      email,
      name,
      image,
      create_time: new Date(),
      update_time: new Date(),
      github_id: platform_id,
    },
  });
  return newUser;
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub, GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  })],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      const user_mail = user.email;
      const platform_id = profile?.id?.toString() || profile?.sub?.toString();
      if (!user_mail || !platform_id) return false;

      const dbUser = await findUserByPlatformID(platform_id);
      if (!dbUser) {
        // 如果用户不存在，创建新用户
        await createUserInDatabase(user_mail, platform_id, user.name, user.image);
      }
      return true; // 登録を許せる
    },
    async jwt({ token, account, profile }) {
      const platform_id = profile?.id?.toString() || profile?.sub?.toString();

      //　user_idをtokenに追加する
      if (platform_id) {

        const dbUser = await findUserByPlatformID(platform_id);

        token.user_id = dbUser?.user_id;
      }

      return token;
    },

    async session({ session, token }) {
      const userId = token.user_id;
      if (typeof userId === "string") {
        session.userId = userId;
      }
      // user_idをトークンからセッションに追加する
      return session;
    },
  }
})