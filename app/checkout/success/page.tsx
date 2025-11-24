"use client"
import {useEffect, useRef, useState} from "react"
import {useSearchParams} from "next/navigation"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Badge} from "@/components/ui/badge"
import {CheckCircle, Package, Truck, Home} from "lucide-react"
import Link from "next/link"
import {useCartStore} from "@/store/cart-store"

interface OrderData {
  orderNumber: string
  status: string
  totalAmount: number
  customerName: string
  customerEmail: string
  createdAt: string
  items: Array<{
    productName: string
    quantity: number
    unitPrice: number
    totalPrice: number
  }>
}

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const orderId = searchParams.get("orderId")
  const [order, setOrder] = useState<OrderData | null>(null)
  const [loading, setLoading] = useState(true)
  const clearCart = useCartStore((s) => s.clearCart)
  const clearedRef = useRef(false)

  // useEffect(() => {
  //   console.log("Session ID:", order)
  //   if (sessionId) {
  //     // In a real implementation, you would fetch order details from your API
  //     // For now, we'll simulate the order data
  //     setTimeout(() => {
  //       setOrder({
  //         orderNumber: order?.orderNumber || "ORD123456",
  //         status: "CONFIRMED",
  //         totalAmount: 299.99,
  //         customerName: "John Doe",
  //         customerEmail: "john@example.com",
  //         createdAt: new Date().toISOString(),
  //         items: [
  //           {
  //             productName: "Sample Product",
  //             quantity: 2,
  //             unitPrice: 149.99,
  //             totalPrice: 299.98,
  //           },
  //         ],
  //       })
  //       setLoading(false)
  //     }, 1000)
  //   }
  // }, [sessionId])


  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (sessionId) {
          const res = await fetch(`/api/orders/by-session/${sessionId}`)
          if (!res.ok) throw new Error("Failed to fetch order")
          const data = await res.json()
          setOrder(data.order)
        } else if (orderId) {
          const res = await fetch(`/api/orders/${orderId}`)
          if (!res.ok) throw new Error("Failed to fetch order")
          const data = await res.json()
          setOrder(data.order)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [sessionId, orderId])

  // Clear the cart once when we have a confirmed order
  useEffect(() => {
    if (order && !clearedRef.current) {
      try {
        clearCart()
      } catch (e) {
        console.error("Failed to clear cart after success", e)
      }
      clearedRef.current = true
    }
  }, [order, clearCart])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Processing your order...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-6">We couldn&apos;t find your order details.</p>
          <Link href="/shop">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600">Thank you for your order. We&apos;ll send you a confirmation email shortly.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Order Number:</span>
                    <span className="font-mono font-medium">{order.orderNumber}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Status:</span>
                    <Badge className="bg-green-100 text-green-800">{order.status}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Date:</span>
                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="text-xl font-bold">£{order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                    >
                      <div>
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">£{item.totalPrice.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">£{item.unitPrice.toFixed(2)} each</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Customer Info & Next Steps */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium">{order.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{order.customerEmail}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  What&apos;s Next?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-blue-600">1</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">Order Confirmation</p>
                      <p className="text-xs text-gray-600">You&apos;ll receive an email confirmation shortly</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-blue-600">2</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">Order Processing</p>
                      <p className="text-xs text-gray-600">We&apos;ll process your order within 24 hours</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-blue-600">3</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">Shipping</p>
                      <p className="text-xs text-gray-600">You&apos;ll receive tracking information once shipped</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Link href="/dashboard">
                <Button className="w-full" variant="outline">
                  <Package className="h-4 w-4 mr-2" />
                  View My Orders
                </Button>
              </Link>
              <Link href="/shop">
                <Button className="w-full">
                  <Home className="h-4 w-4 mr-2" />
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
