// pages/api/auth/mobile/google.ts

import { NextApiRequest, NextApiResponse } from "next";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { idToken } = req.body;
  if (!idToken) {
    return res.status(400).json({ error: "Missing idToken" });
  }

  try {
    // 第一步：验证 Google 的 id_token
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(401).json({ error: "Invalid Google idToken" });
    }

    // 取出感兴趣的字段
    const { sub, email, name, picture } = payload;
    // 在这里你可以查数据库，看用户是否已存在，不存在就创建一个
    // 假设简单起见，不做数据库操作，直接使用 sub 作为用户id

    // 第二步：颁发自定义 JWT
    //    - 你可以把想放进 JWT 的字段都塞进去
    const token = jwt.sign(
      { userId: sub, email, name, picture },
      process.env.JWT_SECRET!, 
      { expiresIn: "1d" } // Token 有效期
    );

    // 第三步：返回 token + 用户信息给前端
    return res.status(200).json({
      success: true,
      token,
      user: {
        id: sub,
        email,
        name,
        picture
      }
    });
  } catch (err: any) {
    console.error("Google token verify error:", err);
    return res.status(401).json({ error: "Invalid or expired Google idToken" });
  }
}
