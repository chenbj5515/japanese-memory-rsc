import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJWTToken } from '@/utils/jwt';
// import { prisma } from '@/prisma';
// import { action_type_enum } from '@prisma/client';
import { checkSubscription } from '@/server-actions/check-subscription';

// 设置为动态路由，确保总是从服务器获取最新数据
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;

    if (!token) {
        return NextResponse.json({ success: false, error: '未登录' }, { status: 401 });
    }

    try {
        // 解析为完整对象
        const decoded = verifyJWTToken(token) as {
            user_id: string;
            name: string;
            email: string;
            profile: string;
            has_subscription: boolean;
            exp: number;
        };

        // 获取今天的开始时间
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // 检查订阅状态
        // const has_subscription = await checkSubscription();

        return NextResponse.json({ 
            success: true, 
            user: decoded
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ success: false, error: '无效的会话' }, { status: 401 });
    }
} 