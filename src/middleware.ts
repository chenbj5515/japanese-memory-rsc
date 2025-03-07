import { auth } from "@/auth";
import { NextRequest, NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';

const locales = ['en', 'zh'];
const publicPages = ['/home', '/privacy-policy', '/terms-of-service', '/business-disclosure', '/guide', '/pricing', '/login'];

// 获取用户首选语言
function getPreferredLocale(request: NextRequest): string {
    // 获取 Accept-Language 头
    const acceptLanguage = request.headers.get('Accept-Language');
    if (!acceptLanguage) return 'en';

    // 解析语言偏好
    const preferredLanguages = acceptLanguage.split(',')
        .map(lang => {
            const [language] = lang.trim().split(';');
            return language.split('-')[0]; // 只取主要语言标签
        });

    // 查找第一个匹配的支持语言
    const matchedLocale = preferredLanguages.find(lang => locales.includes(lang));
    return matchedLocale || 'en';
}

// 创建 next-intl 中间件
const intlMiddleware = createIntlMiddleware({
    locales,
    defaultLocale: 'en',
    localePrefix: 'as-needed'
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
        return NextResponse.redirect(new URL(`/${locale}/latest`, req.url));
    }

    // 如果访问的是公共页面
    if (isPublicPage) {
        return intlMiddleware(req);
    }

    if (!session) {
        return NextResponse.redirect(new URL(`/${locale}/home`, req.url));
    }

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
