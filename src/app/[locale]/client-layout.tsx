"use client"
import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { clearLocalCards } from '@/store/local-cards-slice';
import "remixicon/fonts/remixicon.css";
import LoginedHeader from '../logined-header';
import { UnloginHeader } from './unlogin-header';
import { Footer } from './footer';

export default function ClientLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useDispatch();

    const currentRoute = pathname.split('/').pop() || '';

    const noNavPaths = ["exam", "login", "payment-result"];
    const noNav = noNavPaths.includes(currentRoute);

    const unloginHeaderPaths = ["home", "guide", "pricing", "privacy-policy", "terms-of-service", "business-disclosure"];
    const unloginHeader = unloginHeaderPaths.includes(currentRoute);

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