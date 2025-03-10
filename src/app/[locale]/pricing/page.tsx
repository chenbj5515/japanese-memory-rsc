import type React from "react"
import { Check, X } from "lucide-react"
import { getTranslations } from 'next-intl/server'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { UpgradeButton } from "./components/upgrade-button"

const FeatureItem = ({ children, included = false }: { children: React.ReactNode; included?: boolean }) => (
  <li className="flex items-center">
    {included ? (
      <Check className="mr-2 h-4 w-4 text-primary" />
    ) : (
      <X className="mr-2 h-4 w-4 text-gray-300" />
    )}
    <span className={included ? 'text-gray-700' : 'text-gray-400'}>{children}</span>
  </li>
)

export default async function SubscriptionPage() {
  const t = await getTranslations('pricing');

  return (
    <div className="container mx-auto">
      <div className="h-[100px] flex mt-2 justify-center">
        <h1 className="text-3xl font-bold">{t('title')}</h1>
      </div>
      <div className="grid md:grid-cols-2 gap-20 max-w-[700px] mx-auto">
        <Card className="w-[324px] h-[400px] transition-all duration-300 hover:border-primary">
          <CardHeader>
            <CardTitle>{t('freePlan.title')}</CardTitle>
            <CardDescription>{t('freePlan.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold mb-4">{t('freePlan.price')}</p>
            <ul className="space-y-2">
              <FeatureItem included>{t('freePlan.features.sentences')}</FeatureItem>
              <FeatureItem included>{t('freePlan.features.words')}</FeatureItem>
              <FeatureItem>{t('freePlan.features.subtitle')}</FeatureItem>
              <FeatureItem>{t('freePlan.features.webTranslation')}</FeatureItem>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full mt-[30px]" variant="outline">
              {t('freePlan.currentPlan')}
            </Button>
          </CardFooter>
        </Card>

        <Card className="w-[324px] h-[400px] transition-all duration-300 hover:border-primary">
          <CardHeader>
            <CardTitle>{t('proPlan.title')}</CardTitle>
            <CardDescription>{t('proPlan.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold mb-4">{t('proPlan.price')}</p>
            <ul className="space-y-2">
              <FeatureItem included>{t('proPlan.features.sentences')}</FeatureItem>
              <FeatureItem included>{t('proPlan.features.words')}</FeatureItem>
              <FeatureItem included>{t('proPlan.features.subtitle')}</FeatureItem>
              <FeatureItem included>{t('proPlan.features.webTranslation')}</FeatureItem>
            </ul>
          </CardContent>
          <CardFooter>
            <UpgradeButton upgradeText={t('proPlan.upgrade')} />
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}