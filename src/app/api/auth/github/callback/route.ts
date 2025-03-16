import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { fetchGithubToken } from '@/oauth2/github';
import { generateJWTForUser } from '@/services/auth';

// 设置为动态路由，确保总是从服务器获取最新数据
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    
    if (!code) {
        return NextResponse.json({ success: false, error: '未提供授权码' }, { status: 400 });
    }
    
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
    const redirectUri = `${baseUrl}/api/auth/github/callback`;
    
    try {
        // 使用 fetchGithubToken 获取 token 和用户信息
        const { githubUser, access_token } = await fetchGithubToken(code, redirectUri);

        // 根据 GitHub 用户信息生成 JWT
        const jwtToken = await generateJWTForUser(githubUser, githubUser.id);

        // 设置 cookie
        const cookieStore = await cookies();
        cookieStore.set('session', jwtToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60, // 7天
            path: '/'
        });
        
        // 重定向到前端URL
        return NextResponse.redirect(baseUrl);
    } catch (err: any) {
        console.error('GitHub 认证失败:', err);
        return NextResponse.json({ success: false, error: err.message }, { status: 400 });
    }
} 