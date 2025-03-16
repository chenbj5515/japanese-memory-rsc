import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { generateToken } from '@/utils/token';

// 设置为动态路由，确保总是从服务器获取最新数据
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const token = generateToken();
    
    // 将 token 设置到 cookie 中，有效期 1 分钟
    const cookieStore = await cookies();
    cookieStore.set('csrf_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 60,  // 1分钟
        path: '/'
    });
    
    // 同时返回 token
    return NextResponse.json({ csrf_token: token });
} 