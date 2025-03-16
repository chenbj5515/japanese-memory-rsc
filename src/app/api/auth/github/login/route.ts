import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { AuthorizationCode } from 'simple-oauth2';

// 设置为动态路由，确保总是从服务器获取最新数据
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const cookieStore = await cookies();
    const cookieToken = cookieStore.get('csrf_token')?.value;
    const headerToken = request.headers.get('X-CSRF-Token');  // 从请求头获取 token
    
    // 验证 CSRF token
    if (!cookieToken || !headerToken || cookieToken !== headerToken) {
        return NextResponse.json({ success: false, error: 'CSRF 令牌无效或已过期' }, { status: 403 });
    }
    
    // 清除CSRF token
    cookieStore.set('csrf_token', '', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 0,
        path: '/'
    });
    
    // 配置 GitHub OAuth2 客户端
    const githubConfig = {
        client: {
            id: process.env.GITHUB_CLIENT_ID || '',
            secret: process.env.GITHUB_CLIENT_SECRET || '',
        },
        auth: {
            tokenHost: 'https://github.com',
            tokenPath: '/login/oauth/access_token',
            authorizePath: '/login/oauth/authorize',
        },
    };

    const githubClient = new AuthorizationCode(githubConfig);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
    const redirectUri = `${baseUrl}/api/auth/github/callback`;
    const authorizationUri = githubClient.authorizeURL({
        redirect_uri: redirectUri,
        scope: 'read:user user:email',
        state: Math.random().toString(36).substring(2),
    });
    
    // 返回 JSON 响应而不是重定向
    return NextResponse.json({
        success: true,
        authUrl: authorizationUri
    });
} 