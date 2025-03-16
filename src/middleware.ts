import { auth } from "@/auth";
import { NextRequest, NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';

const locales = ['en', 'zh', 'zh-TW'];
const publicPages = ['/home', '/privacy-policy', '/terms-of-service', '/business-disclosure', '/guide', '/pricing', '/login'];

// 获取并设置用户语言偏好
function getAndSetLocale(request: NextRequest): string {
    // 检查 Cookie 中是否有语言偏好
    const localeCookie = request.cookies.get('NEXT_LOCALE');
    if (localeCookie?.value && locales.includes(localeCookie.value)) {
        return localeCookie.value;
    }

    // 获取系统语言偏好
    const acceptLanguage = request.headers.get('accept-language') || '';
    const systemLocale = acceptLanguage.split(',')[0].split('-')[0].toLowerCase();
    
    // 确定最终使用的语言
    const finalLocale = locales.includes(systemLocale) ? systemLocale : 'en';
    
    // 创建响应对象来设置 cookie
    const response = NextResponse.next();
    response.cookies.set('NEXT_LOCALE', finalLocale, {
        path: '/',
        maxAge: 365 * 24 * 60 * 60, // 一年有效期
        sameSite: 'lax'
    });
    
    return finalLocale;
}

// 创建 next-intl 中间件
const intlMiddleware = createIntlMiddleware({
    locales,
    defaultLocale: 'en',
    localePrefix: 'always'
});

// 更明确的matcher配置，使中间件只处理页面路由，不拦截API请求
export const config = {
    matcher: [
        // 只匹配页面路由，不匹配API和静态资源
        '/((?!api|_next/static|_next/image|public|scribble.svg|manifest.json|favicon.ico|assets|icon).*)',
    ],
};

export async function middleware(req: NextRequest) {
    const pathname = req.nextUrl.pathname;

    // // 处理API路由的CORS
    if (pathname.startsWith('/api/')) {
        // 获取请求的Origin
        const origin = req.headers.get('origin');
        const response = NextResponse.next();
        
        // 允许特定的Chrome扩展访问
        if (origin === 'chrome-extension://lmepenbgdgfihjehjnanphnfhobclghl') {
            response.headers.set('Access-Control-Allow-Origin', origin);
            response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            response.headers.set('Access-Control-Allow-Credentials', 'true');
        }
        
        // 处理预检请求
        if (req.method === 'OPTIONS') {
            return new NextResponse(null, { 
                status: 200,
                headers: response.headers
            });
        }
        
        return response;
    }

    // 如果是monitoring路由，直接放行
    if (pathname.includes('/monitoring')) {
        return NextResponse.next();
    }

    const locale = getAndSetLocale(req);

    // 处理根路由重定向
    if (pathname === '/') {
        const session = await auth(req);
        if (!session) {
            return NextResponse.redirect(new URL(`/${locale}/home`, req.url));
        }
        const redirectParam = req.nextUrl.searchParams.get('redirect');
        if (redirectParam) {
            const redirectPath = redirectParam.startsWith('/') ? redirectParam : `/${redirectParam}`;
            return NextResponse.redirect(new URL(`/${locale}${redirectPath}`, req.url));
        }
        return NextResponse.redirect(new URL(`/${locale}/memo-cards`, req.url));
    }

    // 检查是否是受保护的页面
    const isPublicPage = publicPages.some(page => pathname.endsWith(page));
    if (!isPublicPage) {
        const session = await auth(req);
        if (!session) {
            return NextResponse.redirect(new URL(`/${locale}/home`, req.url));
        }
    }

    // 应用国际化中间件
    return intlMiddleware(req);
}
