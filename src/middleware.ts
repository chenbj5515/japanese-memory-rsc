import { auth } from "@/auth";
import { NextRequest, NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';

const locales = ['en', 'zh'];
const publicPages = ['/home', '/privacy-policy', '/terms-of-service', '/business-disclosure', '/guide', '/pricing', '/login'];

// 获取用户首选语言
function getPreferredLocale(request: NextRequest): string {
    // 首先检查 Cookie 中是否有语言偏好
    const localeCookie = request.cookies.get('NEXT_LOCALE');
    if (localeCookie?.value && locales.includes(localeCookie.value)) {
        return localeCookie.value;
    }

    return 'en';
}

// 创建 next-intl 中间件
const intlMiddleware = createIntlMiddleware({
    locales,
    defaultLocale: 'en',
    localePrefix: 'always'
});

export async function middleware(req: NextRequest) {
    const publicPathnameRegex = RegExp(
        `^(/(${locales.join('|')}))?(${publicPages.join('|')})?/?$`,
        'i'
    );

    const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname);
    const preferredLocale = getPreferredLocale(req);
    const locale = req.nextUrl.locale || preferredLocale;

    const session = await auth();

    // 如果是跟路由，那么重定向
    if (req.nextUrl.pathname === '/') {
        if (!session) {
            return NextResponse.redirect(new URL(`/${locale}/home`, req.url));
        }
        // 检查URL参数中是否有redirect
        const redirectParam = req.nextUrl.searchParams.get('redirect');
        if (redirectParam) {
          // 确保redirect以/开头
          const redirectPath = redirectParam.startsWith('/') ? redirectParam : `/${redirectParam}`;
          return NextResponse.redirect(new URL(`/${locale}${redirectPath}`, req.url));
        }
        return NextResponse.redirect(new URL(`/${locale}/latest`, req.url));
    }

    // 如果访问的是公共页面
    if (isPublicPage) {
        const response = intlMiddleware(req);
        // 设置语言偏好 Cookie
        response.cookies.set('NEXT_LOCALE', locale, {
            path: '/',
            maxAge: 365 * 24 * 60 * 60, // 一年有效期
            sameSite: 'lax'
        });
        return response;
    }

    if (!session) {
        return NextResponse.redirect(new URL(`/${locale}/home`, req.url));
    }

    const response = intlMiddleware(req);
    // 设置语言偏好 Cookie
    response.cookies.set('NEXT_LOCALE', locale, {
        path: '/',
        maxAge: 365 * 24 * 60 * 60, // 一年有效期
        sameSite: 'lax'
    });
    return response;
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
