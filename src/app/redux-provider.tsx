"use client"
import React from "react";
import { Provider } from "react-redux";
import store from "@/store";
import ClientLayout from "./client-layout";

export default function ReduxProvider({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <Provider store={store}>
            <ClientLayout children={children} />
        </Provider>
    )
}