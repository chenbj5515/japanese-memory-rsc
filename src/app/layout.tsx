import React from "react";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import ReduxProvider from "./redux-provider";
import './globals.css';

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="flex flex-col dark:bg-bgDark bg-[#fff]">
          <SessionProvider session={session}>
            <ReduxProvider children={children} />
          </SessionProvider>
        </main>
      </body>
    </html>
  );
}