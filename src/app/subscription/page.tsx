import type React from "react"
import { Check, X } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function SubscriptionPage() {
    return (
        <div className="container mx-auto">
            <div className="h-[180px] flex items-center justify-center">
                <h1 className="text-3xl font-bold">Choose Your Plan</h1>
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
                            <FeatureItem>YouTube subtitle extraction</FeatureItem>
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
                            <FeatureItem included>YouTube subtitle extraction</FeatureItem>
                            <FeatureItem included>Web page translation plugin</FeatureItem>
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full mt-[30px]" asChild>
                            <Link href="/subscribe">Upgrade Now</Link>
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
