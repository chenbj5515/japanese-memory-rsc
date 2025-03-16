import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// 设置为动态路由，确保总是从服务器获取最新数据
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const cookieStore = await cookies();
    
    // 通过设置maxAge为0来清除session cookie
    cookieStore.set('session', '', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 0,
        path: '/'
    });
    
    return NextResponse.json({ success: true, message: '已成功登出' });
} 