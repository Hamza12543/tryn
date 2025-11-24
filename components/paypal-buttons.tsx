"use client"
import {useEffect, useRef} from "react"
import {loadScript, PayPalNamespace} from "@paypal/paypal-js"

type Item = {
  id: string
  name: string
  price: number
  quantity: number
}

export default function PaypalButtons({
  items,
  customerEmail,
  customerName,
  shippingFee = 0,
  shippingMethod = "standard",
  shippingAddress,
  notes,
  customerPhone,
}: {
  items: Item[]
  customerEmail: string
  customerName: string
  shippingFee?: number
  shippingMethod?: "standard" | "fast"
  shippingAddress?: {
    street: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  notes?: string
  customerPhone?: string
}) {
  const divRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    let paypalNS: PayPalNamespace | null = null
    let isMounted = true

    // Temporarily downgrade PayPal SDK console.error to avoid Next.js dev overlay noise
    const originalConsoleError = console.error
    console.error = (...args: any[]) => {
      const first = args?.[0]
      if (typeof first === "string" && first.includes("paypal_js_sdk_v5_unhandled_exception")) {
        console.warn(...args)
        return
      }
      originalConsoleError(...args)
    }

    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
    if (!clientId) {
      console.error("paypal_js_sdk_missing_client_id: set NEXT_PUBLIC_PAYPAL_CLIENT_ID in .env.local")
      return () => {
        // Restore console.error
        console.error = originalConsoleError
      }
    }

    const existingPaypal = (typeof window !== "undefined" && (window as any).paypal) || null
    const ensurePaypal = existingPaypal
      ? Promise.resolve(existingPaypal)
      : loadScript({
          clientId,
          currency: "GBP",
          intent: "capture",
          components: "buttons",
          dataNamespace: "paypal_sdk", // avoid collisions in HMR
        })

    ensurePaypal
      .then((paypal) => {
        if (!paypal || !divRef.current || !isMounted) return
        paypalNS = paypal as any

        if (typeof paypal.Buttons !== "function") {
          console.warn("paypal_buttons_unavailable")
          return
        }

        // Clear any previous content to avoid duplicate renders
        try {
          divRef.current.innerHTML = ""
        } catch {}

        paypal.Buttons({
          onInit: (_data: any, actions: any) => {
            const valid = Boolean(customerName && customerEmail && items.length > 0)
            if (!valid) actions.disable()
            else actions.enable()
          },
          onClick: (_data: any, actions: any) => {
            if (!customerName || !customerEmail || items.length === 0) {
              alert("Please fill in your name, email, and have at least one item in cart before paying with PayPal.")
              return actions.reject()
            }
            return actions.resolve()
          },
          createOrder: async () => {
            try {
              const res = await fetch("/api/paypal/create-order", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                  items,
                  customerEmail,
                  customerName,
                  customerPhone,
                  shippingFee,
                  shippingMethod,
                  shippingAddress,
                  notes,
                }),
              })
              const data = await res.json()
              if (!res.ok) {
                const msg = data?.error || "Failed to create PayPal order"
                console.warn("paypal_create_order_failed", msg)
                return Promise.reject(new Error(msg))
              }
              return data.orderID as string
            } catch (err: any) {
              console.warn("paypal_create_order_exception", err)
              return Promise.reject(err)
            }
          },
          onApprove: async (data: any) => {
            try {
              const res = await fetch("/api/paypal/capture-order", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                  orderID: (data as any).orderID,
                  customerEmail,
                  customerName,
                  customerPhone,
                  shippingFee,
                  shippingMethod,
                  shippingAddress,
                  notes,
                }),
              })
              const result = await res.json()
              if (!res.ok || !result?.order?._id) {
                const msg = result?.error || "Failed to capture PayPal order"
                console.warn("paypal_capture_order_failed", msg)
                return Promise.reject(new Error(msg))
              }
              window.location.href = `/checkout/success?provider=paypal&orderId=${result.order._id}`
            } catch (err: any) {
              console.warn("paypal_capture_order_exception", err)
              return Promise.reject(err)
            }
          },
          onCancel: () => {
            console.warn("paypal_checkout_cancelled")
          },
          onError: (err: any) => {
            console.warn("paypal_checkout_error", err)
            alert("There was a problem with PayPal. Please try again or use another method.")
          },
        }).render(divRef.current)
      })
      .catch((err) => {
        console.warn("paypal_js_sdk_load_error", err)
      })

    return () => {
      isMounted = false
      paypalNS = null
      if (divRef.current) {
        try {
          divRef.current.innerHTML = ""
        } catch {}
      }
      // Restore console.error on unmount
      console.error = originalConsoleError
    }
  }, [items, customerEmail, customerName])

  return <div ref={divRef} />
}
