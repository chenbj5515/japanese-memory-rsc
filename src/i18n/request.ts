import {getRequestConfig} from 'next-intl/server';

// 定义支持的语言列表
const locales = ['en', 'zh'];

export default getRequestConfig(async ({requestLocale}) => {
  // 这里使用 requestLocale 而不是 locale
  let locale = await requestLocale;
  // console.log('requestLocale', locale)
  // 确保使用有效的locale
  if (!locale || !locales.includes(locale as any)) {
    locale = 'zh'; // 设置默认语言
  }

  return {
    locale,
    messages: (await import(`./locales/${locale}.ts`)).default
  };
}); 