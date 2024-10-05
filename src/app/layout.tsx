import React from "react";
import { Inter } from "next/font/google";
import Provider from "./provider";
import './globals.css';

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="flex flex-col dark:bg-bgDark bg-[#fff]">
          <Provider>{children}</Provider>
        </main>
      </body>
    </html>
  );
}