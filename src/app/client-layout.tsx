"use client"
import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useSession } from "next-auth/react";
import { useDispatch } from 'react-redux';
import { clearLocalCards } from '@/store/local-cards-slice';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Logout } from "@/server-actions";
import "remixicon/fonts/remixicon.css";
import LoginedHeader from './logined-header';
import UnloginHeader from './unlogin-header';
import Footer from './footer';

export default function ClientLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [theme, setTheme] = React.useState("light");
    const { data } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useDispatch();

    const noNavPaths = ["/exam"];
    const noNav = noNavPaths.includes(pathname);

    const unloginHeaderPaths = ["/home", "/guide", "/login", "/pricing", "/privacy-policy", "/terms-of-service", "/business-disclosure"];
    const unloginHeader = unloginHeaderPaths.includes(pathname);

    function handleToggle() {
        if (theme === "dark") {
            setTheme("light");
        } else {
            setTheme("dark");
        }
        document.body.classList.toggle("dark");
    }

    async function handleLogout() {
        await Logout();
        router.push('/');
    }

    useEffect(() => {
        dispatch(
            clearLocalCards()
        );
    }, [pathname]);

    useEffect(() => {
        router.prefetch("/exam");
    }, [router]);


    return (
        <>
            {
                unloginHeader
                    ? <UnloginHeader />
                    : noNav
                        ? null
                        : <LoginedHeader />
            }
            <div style={{
                paddingTop: noNav ? 0 : "86px",
                paddingBottom: unloginHeader ? "100px" : 0
            }}>
                {children}
            </div>
            {
                unloginHeader ? <Footer /> : null
            }
        </>
    )
}