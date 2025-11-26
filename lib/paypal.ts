const getBaseUrl = () =>
  process.env.PAYPAL_MODE === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com"

let cachedToken: { token: string; expiresAt: number } | null = null

async function getAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET
  if (!clientId || !clientSecret) {
    throw new Error("Missing PAYPAL_CLIENT_ID or PAYPAL_CLIENT_SECRET")
  }

  // Return cached token if not expired (skew of 30s)
  const now = Date.now()
  if (cachedToken && cachedToken.expiresAt - 30_000 > now) {
    return cachedToken.token
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64")
  const res = await fetch(`${getBaseUrl()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`PayPal auth failed: ${res.status} ${text}`)
  }

  const data = (await res.json()) as { access_token: string; expires_in?: number }
  const ttlMs = Math.max(60, data.expires_in ?? 300) * 1000 // default 5m if missing
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + ttlMs,
  }
  return cachedToken.token
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
  // totals
  const itemTotalCents = items.reduce((sum, i) => sum + Math.round(i.price * 100) * i.quantity, 0)
  const shippingCents = Math.round((shippingFee || 0) * 100)
  const totalCents = itemTotalCents + shippingCents
  const totalStr = (totalCents / 100).toFixed(2)
  const itemTotalStr = (itemTotalCents / 100).toFixed(2)
  const shippingStr = (shippingCents / 100).toFixed(2)

  const body = {
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: currency,
          value: totalStr,
          breakdown: {
            item_total: { currency_code: currency, value: itemTotalStr },
            ...(shippingCents > 0
              ? { shipping: { currency_code: currency, value: shippingStr } }
              : {}),
          },
        },
        items: items.map((i) => ({
          name: i.name,
          unit_amount: { currency_code: currency, value: (Math.round(i.price * 100) / 100).toFixed(2) },
          quantity: String(i.quantity),
        })),
      },
    ],
  }

  const token = await getAccessToken()
  const res = await fetch(`${getBaseUrl()}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    // Next.js fetch on server needs this for external POST sometimes
    cache: "no-store",
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`PayPal create order failed: ${res.status} ${text}`)
  }

  const data = (await res.json()) as { id: string }
  return data.id
}

export async function capturePayPalOrder(orderId: string) {
  const token = await getAccessToken()
  const res = await fetch(`${getBaseUrl()}/v2/checkout/orders/${orderId}/capture`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
    cache: "no-store",
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`PayPal capture failed: ${res.status} ${text}`)
  }

  return (await res.json()) as any
}
