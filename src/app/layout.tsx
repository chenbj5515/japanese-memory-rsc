import React from "react";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import TrpcProvider from '@/trpc/provider';
import { auth } from "@/auth";
import ClientLayout from "./client-layout";
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
          <TrpcProvider>
            <SessionProvider session={session}>
                <ClientLayout children={children} />
            </SessionProvider>
          </TrpcProvider>
        </main>
      </body>
    </html>
  );
}

// export const dynamic = "force-dynamic";
