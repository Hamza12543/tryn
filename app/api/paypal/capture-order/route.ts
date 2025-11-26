import { NextResponse } from "next/server"
import { capturePayPalOrder } from "@/lib/paypal"
import { connectDB } from "@/lib/mongodb"
import Order from "@/models/Order"
import OrderItem from "@/models/OrderItem"
import { sendOrderCreatedEmails } from "@/lib/emailService"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { orderID, customerEmail, customerName, shippingFee } = body as {
      orderID: string
      customerEmail?: string
      customerName?: string
      shippingFee?: number
    }
    if (!orderID) return NextResponse.json({ error: "Missing orderID" }, { status: 400 })

    const result = await capturePayPalOrder(orderID)

    // Basic validation
    const status = result?.status
    if (status !== "COMPLETED") {
      return NextResponse.json({ error: `Unexpected PayPal status: ${status}` }, { status: 400 })
    }

    const pu = result.purchase_units?.[0]
    const capturedAmount = pu?.payments?.captures?.[0]?.amount
    const currency = capturedAmount?.currency_code || "GBP"
    const totalValue = parseFloat(capturedAmount?.value || "0")

    // Items (may be absent depending on how order was created)
    const items = (pu?.items || []) as Array<{
      name: string
      unit_amount?: { currency_code: string; value: string }
      quantity?: string
      sku?: string
    }>

    await connectDB()

    // Try to map shipping address from PayPal response if present
    const shipping = (pu as any)?.shipping || {}
    const shippingAddr = shipping?.address || {}
    const street =
      shippingAddr?.address_line_1 || shippingAddr?.addressLine1 || shippingAddr?.line1 || "N/A"
    const city = shippingAddr?.admin_area_2 || shippingAddr?.city || "N/A"
    const state = shippingAddr?.admin_area_1 || shippingAddr?.state || "N/A"
    const postalCode = shippingAddr?.postal_code || shippingAddr?.postalCode || "N/A"
    const country = shippingAddr?.country_code || shippingAddr?.countryCode || "N/A"

    const shippingAmountNum = typeof shippingFee === 'number' ? shippingFee : 0
    const computedSubtotal = Math.max(totalValue - shippingAmountNum, 0)

    const orderDoc = new Order({
      orderNumber: `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      userId: null,
      isGuestOrder: true,
      status: "CONFIRMED",
      totalAmount: totalValue,
      subtotal: computedSubtotal,
      taxAmount: 0,
      shippingAmount: shippingAmountNum,
      discountAmount: 0,
      customerEmail: customerEmail || "",
      customerName: customerName || "",
      paymentStatus: "COMPLETED",
      paymentMethod: "PAYPAL",
      transactionId: pu?.payments?.captures?.[0]?.id,
      stripeSessionId: undefined,
      stripePaymentIntentId: undefined,
      isWholesale: false,
      shippingAddress: {
        street,
        city,
        state,
        postalCode,
        country,
      },
    })

    await orderDoc.save()

    if (items.length) {
      const orderItems = items.map((it) => ({
        orderId: orderDoc._id,
        productId: it.sku || it.name, // fallback if sku absent
        quantity: parseInt(it.quantity || "1", 10),
        unitPrice: parseFloat(it.unit_amount?.value || "0"),
        totalPrice: parseFloat(it.unit_amount?.value || "0") * parseInt(it.quantity || "1", 10),
        productName: it.name,
      }))
      if (orderItems.length) await OrderItem.insertMany(orderItems)
    }

    try {
      await sendOrderCreatedEmails(orderDoc as any)
    } catch {}

    return NextResponse.json({
      success: true,
      order: {
        _id: orderDoc._id.toString(),
        orderNumber: orderDoc.orderNumber,
      },
    })
  } catch (err: any) {
    console.error("PayPal capture-order error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
