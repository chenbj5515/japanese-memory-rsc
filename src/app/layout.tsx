import localFont from "next/font/local";
import { SpeedInsights } from "@vercel/speed-insights/next"
import Provider from "./provider";
import "./globals.css";
import { Pacifico } from 'next/font/google';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bunn',
  description: 'A Japanese learning application',
  icons: {
    icon: '/icon/brand.png',
    apple: '/icon/brand.png',
  },
};

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
// 配置字体，只会执行一次
const pacifico = Pacifico({
  weight: '400',  // 字体粗细
  subsets: ['latin'],  // 字符子集
  display: 'swap',  // 字体显示策略
  variable: '--font-pacifico',  // CSS 变量名（可选）
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${pacifico.variable} antialiased`}>
        <Provider>
          {/* <SpeedInsights /> */}
          <main className="flex flex-col dark:bg-bgDark relative">
            {children}
          </main>
        </Provider>
      </body>
    </html>
  );
}
