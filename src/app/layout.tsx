"use client"
import localFont from "next/font/local";
import Provider from "./provider";
import "./globals.css";
import { Pacifico } from 'next/font/google';

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
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${pacifico.variable} antialiased`}
      >
        <main className="flex flex-col dark:bg-bgDark relative">
          <Provider>{children}</Provider>
        </main>
      </body>
    </html>
  );
}
