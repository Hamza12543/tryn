"use server"

import {getServerSession} from "next-auth"
import {authOptions} from "@/lib/auth"
import {createCheckoutSession} from "@/lib/stripe"
import {constructValidUrl} from "@/lib/utils"

export async function createCheckout(data: {
  items: Array<{
    id: string
    name: string
    price: number
    originalPrice: number
    quantity: number
    image?: string
  }>
  customerEmail: string
  customerName: string
  customerPhone?: string
  notes?: string
  shippingAddress?: {
    street: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  isGuestCheckout?: boolean
  shippingMethod?: "standard" | "fast"
  shippingFee?: number
}) {
  try {
    const session = await getServerSession(authOptions)
    const isGuest = data.isGuestCheckout === true
    
    // Allow guest checkout or authenticated users
    if (!isGuest && !session?.user) {
      throw new Error("Please sign in to complete your purchase or proceed as guest")
    }

    if (!data.items || data.items.length === 0) {
      throw new Error("Your cart is empty. Please add items before checkout.")
    }

    if (!data.customerEmail || !data.customerName) {
      throw new Error("Please provide your name and email address")
    }

    // Construct valid URLs with fallback handling
    const successUrl = constructValidUrl(process.env.NEXTAUTH_URL, "/checkout/success?session_id={CHECKOUT_SESSION_ID}")
    const cancelUrl = constructValidUrl(process.env.NEXTAUTH_URL, "/shop")

    const stripeSession = await createCheckoutSession({
      items: data.items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      customerEmail: data.customerEmail,
      customerName: data.customerName,
      successUrl,
      cancelUrl,
      metadata: {
        userId: session?.user?.id || 'guest',
        isGuestOrder: isGuest ? 'true' : 'false',
        shippingMethod: data.shippingMethod || 'standard',
        shippingFee: (data.shippingFee ?? 0).toString(),
        customerPhone: data.customerPhone || '',
        notes: data.notes || '',
        shippingStreet: data.shippingAddress?.street || '',
        shippingCity: data.shippingAddress?.city || '',
        shippingState: data.shippingAddress?.state || '',
        shippingPostalCode: data.shippingAddress?.postalCode || '',
        shippingCountry: data.shippingAddress?.country || '',
      },
      shippingFee: data.shippingFee,
    })

    return {
      sessionId: stripeSession.id,
      url: stripeSession.url,
    }
  } catch (error) {
    console.error("Checkout error:", error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Failed to create checkout session. Please try again.")
  }
}
