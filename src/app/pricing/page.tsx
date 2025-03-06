'use client'

import type React from "react"
import { Check, X } from "lucide-react"
import Link from "next/link"
import { loadStripe } from "@stripe/stripe-js"
import { useLanguage } from "@/i18n/language-context"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

// 确保在组件外部初始化
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const FeatureItem = ({ children, included = false }: { children: React.ReactNode; included?: boolean }) => (
    <li className="flex items-center">
        <Check className={`mr-2 h-4 w-4 ${included ? 'text-primary' : 'text-gray-300'}`} />
        <span className={included ? 'text-gray-700' : 'text-gray-400'}>{children}</span>
    </li>
)

export default function SubscriptionPage() {
    const { t } = useLanguage()

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
                <h1 className="text-3xl font-bold">{t('pricing.title')}</h1>
            </div>
            <div className="grid md:grid-cols-2 gap-20 max-w-[700px] mx-auto">
                <Card className="w-[324px] h-[400px] transition-all duration-300 hover:border-primary">
                    <CardHeader>
                        <CardTitle>{t('pricing.freePlan.title')}</CardTitle>
                        <CardDescription>{t('pricing.freePlan.description')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold mb-4">{t('pricing.freePlan.price')}</p>
                        <ul className="space-y-2">
                            <FeatureItem included>{t('pricing.freePlan.features.sentences')}</FeatureItem>
                            <FeatureItem included>{t('pricing.freePlan.features.words')}</FeatureItem>
                            <FeatureItem>{t('pricing.freePlan.features.subtitle')}</FeatureItem>
                            <FeatureItem>{t('pricing.freePlan.features.webTranslation')}</FeatureItem>
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full mt-[30px]" variant="outline">
                            {t('pricing.freePlan.currentPlan')}
                        </Button>
                    </CardFooter>
                </Card>

                <Card className="w-[324px] h-[400px] transition-all duration-300 hover:border-primary">
                    <CardHeader>
                        <CardTitle>{t('pricing.proPlan.title')}</CardTitle>
                        <CardDescription>{t('pricing.proPlan.description')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold mb-4">{t('pricing.proPlan.price')}</p>
                        <ul className="space-y-2">
                            <FeatureItem included>{t('pricing.proPlan.features.sentences')}</FeatureItem>
                            <FeatureItem included>{t('pricing.proPlan.features.words')}</FeatureItem>
                            <FeatureItem included>{t('pricing.proPlan.features.subtitle')}</FeatureItem>
                            <FeatureItem included>{t('pricing.proPlan.features.webTranslation')}</FeatureItem>
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full mt-[30px]" onClick={handleSubscribe}>
                            {t('pricing.proPlan.upgrade')}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
