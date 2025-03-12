import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import ClientLayout from "./client-layout";

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'zh' }, { locale: 'zh-TW' }];
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // 等待并解构params
  const { locale } = await params;

  // 验证locale
  if (!['en', 'zh', 'zh-TW'].includes(locale)) {
    notFound();
  }

  let messages;
  try {
    messages = (await import(`../../i18n/locales/${locale}.ts`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <ClientLayout>{children}</ClientLayout>
    </NextIntlClientProvider>
  );
} 