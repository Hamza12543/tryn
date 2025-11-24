import paypal from "@paypal/checkout-server-sdk"

export function getPayPalClient() {
  const clientId = process.env.PAYPAL_CLIENT_ID
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET
  const mode = process.env.PAYPAL_MODE === "live" ? "live" : "sandbox"

  if (!clientId || !clientSecret) {
    throw new Error("Missing PAYPAL_CLIENT_ID or PAYPAL_CLIENT_SECRET")
  }

  const environment =
    mode === "live"
      ? new paypal.core.LiveEnvironment(clientId, clientSecret)
      : new paypal.core.SandboxEnvironment(clientId, clientSecret)

  return new paypal.core.PayPalHttpClient(environment)
}

export async function createPayPalOrder({
  items,
  currency = "GBP",
  shippingFee = 0,
}: {
  items: Array<{ name: string; price: number; quantity: number }>
  currency?: string
  shippingFee?: number
}) {
  const client = getPayPalClient()

  // Work in minor units (cents) to avoid floating point rounding issues
  const itemTotalCents = items.reduce(
    (sum, i) => sum + Math.round(i.price * 100) * i.quantity,
    0,
  )
  const shippingCents = Math.round((shippingFee || 0) * 100)
  const totalCents = itemTotalCents + shippingCents
  const totalStr = (totalCents / 100).toFixed(2)
  const itemTotalStr = (itemTotalCents / 100).toFixed(2)
  const shippingStr = (shippingCents / 100).toFixed(2)

  const request = new paypal.orders.OrdersCreateRequest()
  request.prefer("return=representation")
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: currency,
          value: totalStr,
          breakdown: {
            item_total: {
              currency_code: currency,
              value: itemTotalStr,
            },
            ...(shippingCents > 0
              ? {
                  shipping: {
                    currency_code: currency,
                    value: shippingStr,
                  },
                }
              : {}),
          },
        },
        items: items.map((i) => ({
          name: i.name,
          unit_amount: {
            currency_code: currency,
            value: (Math.round(i.price * 100) / 100).toFixed(2),
          },
          quantity: String(i.quantity),
        })),
      },
    ],
  })

  const response = await client.execute(request)
  return response.result.id as string
}

export async function capturePayPalOrder(orderId: string) {
  const client = getPayPalClient()
  const request = new paypal.orders.OrdersCaptureRequest(orderId)
  request.requestBody({})
  const response = await client.execute(request)
  return response.result
}
