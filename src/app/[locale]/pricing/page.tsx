'use client';
import { useTranslations } from 'next-intl';
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export default function PricingPage() {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="mx-auto mb-10 max-w-md text-center">
          <h2 className="text-3xl font-bold">{t('pricing.title')}</h2>
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          {/* Free Plan */}
          <Card className="flex flex-col p-6">
            <div className="flex-1">
              <h3 className="text-2xl font-bold">{t('pricing.freePlan.title')}</h3>
              <p className="mt-2 text-gray-500">{t('pricing.freePlan.description')}</p>
              <div className="mt-4">
                <span className="text-4xl font-bold">{t('pricing.freePlan.price')}</span>
              </div>
              <ul className="mt-6 space-y-4">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="ml-2">{t('pricing.freePlan.features.sentences')}</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="ml-2">{t('pricing.freePlan.features.words')}</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="ml-2">{t('pricing.freePlan.features.subtitle')}</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="ml-2">{t('pricing.freePlan.features.webTranslation')}</span>
                </li>
              </ul>
            </div>
            <Button className="mt-8" variant="outline">
              {t('pricing.freePlan.currentPlan')}
            </Button>
          </Card>
          {/* Pro Plan */}
          <Card className="relative flex flex-col p-6">
            <div className="flex-1">
              <h3 className="text-2xl font-bold">{t('pricing.proPlan.title')}</h3>
              <p className="mt-2 text-gray-500">{t('pricing.proPlan.description')}</p>
              <div className="mt-4">
                <span className="text-4xl font-bold">{t('pricing.proPlan.price')}</span>
              </div>
              <ul className="mt-6 space-y-4">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="ml-2">{t('pricing.proPlan.features.sentences')}</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="ml-2">{t('pricing.proPlan.features.words')}</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="ml-2">{t('pricing.proPlan.features.subtitle')}</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="ml-2">{t('pricing.proPlan.features.webTranslation')}</span>
                </li>
              </ul>
            </div>
            <Button className="mt-8">
              {t('pricing.proPlan.upgrade')}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
} 