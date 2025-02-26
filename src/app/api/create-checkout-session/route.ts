import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia",
});

export async function POST() {
  try {
    console.log(process.env.STRIPE_PRICE_ID, "process.env.STRIPE_PRICE_ID")
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID, // 您需要在Stripe后台创建价格并获取ID
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/subscription`,
    });

    console.log(session, "session")

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    return NextResponse.json({ error: "Error creating checkout session" }, { status: 500 });
  }
} 