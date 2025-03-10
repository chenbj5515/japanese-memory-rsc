'use server'

import { auth } from "@/auth"
import { cookies } from 'next/headers'
import { stripe } from '@/stripe'


export async function createCheckoutSession() {
  const session = await auth()
  const cookieStore = await cookies()
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en'
  
  if (!session?.userId) {
    return { url: `/${locale}/login?redirect=/pricing` }
    // throw new Error('User must be logged in')
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    client_reference_id: session.userId,
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-result?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing`,
  })

  return { url: checkoutSession.url }
} 