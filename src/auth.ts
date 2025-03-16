// import NextAuth from "next-auth"
// import GitHub from "next-auth/providers/github"
// import GoogleProvider from "next-auth/providers/google"
// import { prisma } from "@/prisma"

// function getRandomNumber() {
//     return Math.floor(Math.random() * 5) + 1;
// }

// export const findUserByPlatformID = async (platform_id: string) => {
//     const user = await prisma.user.findFirst({
//         where: {
//             github_id: platform_id,
//         },
//     });
//     return user;
// };

// export const createUserInDatabase = async (
//     email: string,
//     platform_id: string,
//     name?: string | null,
//     image?: string | null,
// ) => {
//     const newUser = await prisma.user.create({
//         data: {
//             email,
//             name,
//             image,
//             create_time: new Date(),
//             update_time: new Date(),
//             github_id: platform_id,
//             profile: `/assets/profiles/0${getRandomNumber()}.png`
//         },
//     });
//     return newUser;
// };

// export const { handlers, signIn, signOut, auth } = NextAuth({
//     trustHost: true,
//     providers: [GitHub, GoogleProvider({
//         clientId: process.env.GOOGLE_CLIENT_ID,
//         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     })],
//     callbacks: {
//         async signIn({ user, account, profile, email, credentials }) {
//             const user_mail = user.email;
//             const platform_id = profile?.id?.toString() || profile?.sub?.toString();
//             if (!user_mail || !platform_id) return false;

//             const dbUser = await findUserByPlatformID(platform_id);
//             if (!dbUser) {
//                 // 如果用户不存在，创建新用户
//                 await createUserInDatabase(user_mail, platform_id, user.name, user.image);
//             }
//             return true; // 登録を許せる
//         },
//         async jwt({ token, account, profile }) {
//             const platform_id = profile?.id?.toString() || profile?.sub?.toString();

//             //　user_idをtokenに追加する
//             if (platform_id) {
//                 const dbUser = await findUserByPlatformID(platform_id);

//                 token.user_id = dbUser?.user_id;
//                 token.profile = dbUser?.profile;
//                 token.email = dbUser?.email;

//                 // 查询用户的订阅信息
//                 if (dbUser?.user_id) {
//                     const subscription = await prisma.user_subscription.findFirst({
//                         where: {
//                             user_id: dbUser.user_id,
//                             active: true,
//                         },
//                         orderBy: {
//                             end_time: 'desc'
//                         }
//                     });

//                     if (subscription) {
//                         token.subscription_end_time = subscription.end_time.toISOString();
//                     }
//                 }
//             }

//             return token;
//         },

//         async session({ session, token }) {
//             const userId = token.user_id;
//             const profile = token.profile;
//             const email = token.email;
//             const subscription_end_time = token.subscription_end_time;

//             if (typeof userId === "string" && typeof profile === "string" && typeof email === "string") {
//                 session.user_id = userId;
//                 session.profile = profile;
//                 session.email = email;
//             }
//             if (typeof subscription_end_time === "string") {
//                 session.subscription_end_time = subscription_end_time;
//             }
//             // user_idをトークンからセッションに追加する
//             return session;
//         },
//     },
// })

import { headers } from 'next/headers';
import { cookies } from 'next/headers';
import { fetchApi } from "./utils/fetchApi";
import { cache } from 'react';
import { NextRequest } from 'next/server';


export type Session = {
    expires: string;
    user_id?: string;
    profile?: string;
    email?: string;
    subscription_end_time?: string;
    has_subscription: boolean,
    name: string,
    exp: number,
    iat: number,
    today_ocr_count: number,
    today_translation_count: number
};

// 修改 auth 函数，接受请求对象作为参数
export const auth = cache(async (req?: NextRequest): Promise<Session | null> => {
    try {
        // 构建请求头
        const requestHeaders: HeadersInit = {};

        // 方式1：如果传入了请求对象(中间件环境)
        if (req) {
            const cookieHeader = req.headers.get('cookie');
            if (cookieHeader) {
                requestHeaders['Cookie'] = cookieHeader;
            }
            console.log('从中间件环境获取的Cookies:', req.headers.get('cookie'));
        }
        // 方式2：如果没有传入请求对象(RSC或Server Actions环境)
        else {
            try {
                // 获取cookie店铺实例
                const cookieStore = await cookies();

                // 获取所有cookie并组装成一个字符串
                const allCookies = cookieStore.getAll();
                if (allCookies.length > 0) {
                    const cookieString = allCookies
                        .map(cookie => `${cookie.name}=${cookie.value}`)
                        .join('; ');

                    // 将所有cookie添加到请求头
                    requestHeaders['Cookie'] = cookieString;
                    console.log('从服务端环境获取的Cookies:', cookieString);
                } else {
                    console.log('服务端环境中未找到cookie');
                }
            } catch (e) {
                console.error("获取cookies失败:", e);

                // 备选方案：尝试从headers获取cookie
                try {
                    const headersList = await headers();
                    const cookieHeader = headersList.get('cookie');

                    if (cookieHeader) {
                        requestHeaders['Cookie'] = cookieHeader;
                        console.log('从headers获取的Cookie:', cookieHeader);
                    }
                } catch (headerError) {
                    console.error("从headers获取cookie失败:", headerError);
                }
            }
        }

        // 调用后端 API 获取用户信息，同时传递cookie
        const data = await fetchApi("/api/user/info", {
            credentials: "include", // 客户端环境下有效
            headers: requestHeaders // 服务端环境下手动传递cookie
        });

        return data?.user || null;
    } catch (error) {
        console.error("获取用户信息失败:", error);
        return null;
    }
});

// 兼容 NextAuth 的路由处理器
// export const handlers = {
//   GET: async () => new Response("Auth handler not implemented", { status: 501 }),
//   POST: async () => new Response("Auth handler not implemented", { status: 501 })
// };

// 登出方法
export const signOut = async () => {
    try {
        await fetchApi("/api/user/logout", {
            method: "POST",
            credentials: "include"
        });
        return true;
    } catch (error) {
        console.error("登出失败:", error);
        return false;
    }
};

