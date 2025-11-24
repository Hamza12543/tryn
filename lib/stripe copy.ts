import Stripe from "stripe"
import {isValidUrl} from "@/lib/utils"

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set in environment variables")
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-07-30.basil",
})

export const createCheckoutSession = async ({
  items,
  customerEmail,
  customerName,
  successUrl,
  cancelUrl,
  metadata = {},
}: {
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
    image?: string
  }>
  customerEmail: string
  customerName: string
  successUrl: string
  cancelUrl: string
  metadata?: Record<string, string>
}) => {
  // Validate URLs before creating session
  if (!isValidUrl(successUrl)) {
    throw new Error(`Invalid success URL: ${successUrl}`)
  }

  if (!isValidUrl(cancelUrl)) {
    throw new Error(`Invalid cancel URL: ${cancelUrl}`)
  }

  // Create line items without images to avoid Stripe URL length issues
  const validatedItems = items.map((item) => ({
    price_data: {
      currency: "gbp",
      product_data: {
        name: item.name,
        // images: [item.image], // Commented out to prevent Stripe URL length errors
      },
      unit_amount: Math.round(item.price * 100), // Convert to pence
    },
    quantity: item.quantity,
  }))

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    payment_method_options: {
      card: {
        request_three_d_secure: "automatic",
      },
    },
    line_items: validatedItems,
    mode: "payment",
    success_url: successUrl,
    cancel_url: cancelUrl,
    customer_email: customerEmail,
    metadata: {
      customerName,
      ...metadata,
    },
     shipping_address_collection: {
      allowed_countries: ["GB"],
    },
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: 0,
            currency: "gbp",
          },
          display_name: "Free shipping",
          delivery_estimate: {
            minimum: {
              unit: "business_day",
              value: 3,
            },
            maximum: {
              unit: "business_day",
              value: 7,
            },
          },
        },
      },
    ],
  })

  return session
}

export const createPaymentIntent = async ({
  amount,
  currency = "gbp",
  metadata = {},
}: {
  amount: number
  currency?: string
  metadata?: Record<string, string>
}) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency,
    metadata,
  })

  return paymentIntent
}

export const retrieveSession = async (sessionId: string) => {
  return await stripe.checkout.sessions.retrieve(sessionId)
}

export const retrievePaymentIntent = async (paymentIntentId: string) => {
  return await stripe.paymentIntents.retrieve(paymentIntentId)
}
