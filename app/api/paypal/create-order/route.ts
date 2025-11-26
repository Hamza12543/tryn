import { NextResponse } from "next/server"
import { createPayPalOrder } from "@/lib/paypal"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const items = (body?.items || []) as Array<{ id: string; name: string; price: number; quantity: number }>
    const customerEmail = body?.customerEmail as string | undefined
    const customerName = body?.customerName as string | undefined
    const shippingFee = typeof body?.shippingFee === "number" ? body.shippingFee : 0
    const shippingMethod = (body?.shippingMethod as string | undefined) || "standard"

    if (!items.length) {
      return NextResponse.json({ error: "No items" }, { status: 400 })
    }

    // PayPal items do not require ids, but we can put our id in sku for later mapping
    const orderId = await createPayPalOrder({
      items: items.map((i) => ({ name: i.name, price: i.price, quantity: i.quantity })),
      currency: "GBP",
      shippingFee,
    })

    return NextResponse.json({ orderID: orderId, customerEmail, customerName, shippingFee, shippingMethod })
  } catch (err: any) {
    console.error("PayPal create-order error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

