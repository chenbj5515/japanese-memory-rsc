import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJWTToken } from '@/utils/jwt';
import { checkSubscription } from '@/server-actions/check-subscription';

// OpenAI 接口认证中间件
export async function openaiAuthMiddleware(request: NextRequest) {
    // 验证用户身份
    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;
    
    if (!token) {
        return NextResponse.json({ success: false, error: '未登录' }, { status: 401 });
    }

    let decoded: any;
    try {
        decoded = verifyJWTToken(token);
    } catch (err) {
        return NextResponse.json({ success: false, error: '无效的会话' }, { status: 401 });
    }

    if (!decoded?.user_id) {
        return NextResponse.json({ success: false, error: '用户未登录' }, { status: 401 });
    }

    const has_subscription = await checkSubscription();
    
    // 将用户信息添加到请求对象
    // 由于NextRequest是不可变的，我们需要克隆它并添加属性
    // 这里我们将用户信息添加到headers中，在处理程序中再提取出来
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', decoded.user_id);
    requestHeaders.set('x-user-email', decoded.email);
    requestHeaders.set('x-user-name', decoded.name);
    requestHeaders.set('x-user-profile', decoded.profile || '');
    requestHeaders.set('x-user-has-subscription', has_subscription ? 'true' : 'false');
    
    // 创建新的请求对象
    const newRequest = new NextRequest(request.url, {
        method: request.method,
        headers: requestHeaders,
        body: request.body,
        cache: request.cache,
        credentials: request.credentials,
        integrity: request.integrity,
        keepalive: request.keepalive,
        mode: request.mode,
        redirect: request.redirect,
        referrer: request.referrer,
        referrerPolicy: request.referrerPolicy,
        signal: request.signal,
    });
    
    return newRequest;
} 