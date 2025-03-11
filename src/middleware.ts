import { auth } from "@/auth";
import { NextRequest, NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';

const locales = ['en', 'zh'];
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

export async function middleware(req: NextRequest) {
    const locale = getAndSetLocale(req);
    const pathname = req.nextUrl.pathname;

    // 处理根路由重定向
    if (pathname === '/') {
        const session = await auth();
        if (!session) {
            return NextResponse.redirect(new URL(`/${locale}/home`, req.url));
        }
        const redirectParam = req.nextUrl.searchParams.get('redirect');
        if (redirectParam) {
            const redirectPath = redirectParam.startsWith('/') ? redirectParam : `/${redirectParam}`;
            return NextResponse.redirect(new URL(`/${locale}${redirectPath}`, req.url));
        }
        return NextResponse.redirect(new URL(`/${locale}/latest`, req.url));
    }

    // 检查是否是受保护的页面
    const isPublicPage = publicPages.some(page => pathname.endsWith(page));
    if (!isPublicPage) {
        const session = await auth();
        if (!session) {
            return NextResponse.redirect(new URL(`/${locale}/home`, req.url));
        }
    }

    // 应用国际化中间件
    return intlMiddleware(req);
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|assets|icon).*)',
    ],
};
