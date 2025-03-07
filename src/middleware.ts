import { auth } from "@/auth";
import { NextRequest, NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';

const locales = ['en', 'zh'];
const publicPages = ['/home', '/privacy-policy', '/terms-of-service', '/business-disclosure', '/guide', '/pricing'];

// 创建 next-intl 中间件
const intlMiddleware = createIntlMiddleware({
    locales,
    defaultLocale: 'zh',
    localePrefix: 'as-needed'
});

export async function middleware(req: NextRequest) {
    const publicPathnameRegex = RegExp(
        `^(/(${locales.join('|')}))?(${publicPages.join('|')})?/?$`,
        'i'
    );
    const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname);

    if (isPublicPage) {
        return intlMiddleware(req);
    }

    const session = await auth();
    if (!session) {
        return NextResponse.redirect(new URL('/home', req.url));
    }
    if (req.nextUrl.pathname === '/') {
        return NextResponse.redirect(new URL('/latest', req.url));
    }

    return intlMiddleware(req);
}

export const config = {
    matcher: [
        '/',
        '/latest',
        '/random',
        '/translation',
        '/word-cards',
        '/guide',
        '/pricing',
        '/test',
        '/home',
        '/privacy-policy',
        '/terms-of-service',
        '/business-disclosure',
        // 添加语言前缀匹配
        '/(zh|en)/:path*'
    ],
};
