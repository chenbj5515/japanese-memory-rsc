'use client'

import type React from "react"
import { Check, X } from "lucide-react"
import Link from "next/link"
import { loadStripe } from "@stripe/stripe-js"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

// 确保在组件外部初始化
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function SubscriptionPage() {
    const handleSubscribe = async () => {
        try {
            const response = await fetch("/api/create-checkout-session", {
                method: "POST",
            });
            console.log(response, "response")
            const { sessionId } = await response.json();

            // const stripe = await stripePromise;
            // await stripe?.redirectToCheckout({ sessionId });
            const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
            
            console.log(stripe, sessionId, "stripe, sessionId")
            await stripe?.redirectToCheckout({
                sessionId: sessionId  // 这里必须提供 sessionId
            });
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className="container mx-auto">
            <div className="h-[100px] flex mt-2 justify-center">
                <h1 className="text-3xl font-bold">Pricing</h1>
            </div>
            <div className="grid md:grid-cols-2 gap-20 max-w-[700px] mx-auto">
                <Card className="w-[324px] h-[400px] transition-all duration-300 hover:border-primary">
                    <CardHeader>
                        <CardTitle>Free Plan</CardTitle>
                        <CardDescription>Basic features for casual users</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold mb-4">$0 / month</p>
                        <ul className="space-y-2">
                            <FeatureItem included>20 sentences per day</FeatureItem>
                            <FeatureItem included>20 words per day</FeatureItem>
                            <FeatureItem>Subtitle extraction plugin</FeatureItem>
                            <FeatureItem>Web page translation plugin</FeatureItem>
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full mt-[30px]" variant="outline">
                            Current Plan
                        </Button>
                    </CardFooter>
                </Card>

                <Card className="w-[324px] h-[400px] transition-all duration-300 hover:border-primary">
                    <CardHeader>
                        <CardTitle>Premium Plan</CardTitle>
                        <CardDescription>Unlimited access and advanced features</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold mb-4">$5 / month</p>
                        <ul className="space-y-2">
                            <FeatureItem included>Unlimited sentences</FeatureItem>
                            <FeatureItem included>Unlimited words</FeatureItem>
                            <FeatureItem included>Subtitle extraction plugin</FeatureItem>
                            <FeatureItem included>Web page translation plugin</FeatureItem>
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full mt-[30px]" onClick={handleSubscribe}>
                            Upgrade Now
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}

function FeatureItem({ children, included = false }: { children: React.ReactNode; included?: boolean }) {
    return (
        <li className="flex items-center space-x-2">
            {included ? <Check className="h-5 w-5 text-green-500" /> : <X className="h-5 w-5 text-red-500" />}
            <span>{children}</span>
        </li>
    )
}
