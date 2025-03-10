'use server'

import { auth } from '@/auth';
import { stripe } from '@/stripe'

export async function createPortalSession() {
    const session = await auth();

    if (!session?.user?.email) {
        throw new Error('Not authenticated')
    }

    // 获取用户的 Stripe 客户 ID
    const customer = await stripe.customers.list({
        email: session.email,
        limit: 1
    })

    if (!customer.data.length) {
        throw new Error('No Stripe customer found')
    }

    // 创建一个新的门户会话
    const portalSession = await stripe.billingPortal.sessions.create({
        customer: customer.data[0].id,
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}`,
    })

    return portalSession.url
} 