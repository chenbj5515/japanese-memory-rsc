"use client"
import localFont from "next/font/local";
import Provider from "./provider";
import "./globals.css";
import { usePathname } from "next/navigation";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased ${pathname === '/daily-report' ? 'bg-[#f1f1f1]' : ''}`}
      >
        <main className="flex flex-col dark:bg-bgDark">
          <Provider>{children}</Provider>
        </main>
      </body>
    </html>
  );
}
