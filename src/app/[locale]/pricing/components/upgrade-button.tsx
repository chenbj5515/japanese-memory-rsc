'use client'

import { Button } from "@/components/ui/button"
import { createCheckoutSession } from "../server-actions/create-checkout-session"

export function UpgradeButton({ upgradeText }: { upgradeText: string }) {
  
  const handleUpgrade = async () => {
    try {
      const { url } = await createCheckoutSession()
      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error('Failed to create checkout session:', error)
    }
  }

  return (
    <Button onClick={handleUpgrade} className="w-full mt-[30px]">
      {upgradeText}
    </Button>
  )
} 