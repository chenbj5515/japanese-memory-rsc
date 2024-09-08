
import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
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
  providers: [GitHub],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      const user_mail = user.email;
      const github_id = profile?.id?.toString();
      if (!user_mail || !github_id) return false;
      const dbUser = await findUserByPlatformID(github_id);
      if (!dbUser) {
        // 如果用户未注册，注册用户
        await createUserInDatabase(user_mail, github_id, user.name, user.image);
      }
      return true; // 允许登录
    },
    async jwt({ token, account, profile }) {
      const github_id = profile?.id?.toString();

      // 在首次登录时，将 user_id 传递到 token
      if (github_id) {

        // 查找数据库中的用户（这里可以重新查找，或优化缓存逻辑）
        const dbUser = await findUserByPlatformID(github_id);

        // 将 user_id 添加到 token 中
        token.user_id = dbUser?.user_id;
      }

      return token;
    },

    async session({ session, token }) {
      const userId = token.user_id;
      if (typeof userId === "string") {
        session.userId = userId;
      }
      // 将 user_id 从 token 中传递到 session
      return session;
    },
  }
})