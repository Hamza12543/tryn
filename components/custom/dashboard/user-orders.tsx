"use client"
import {useState, useEffect} from "react"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog"
import {Package, Truck, CheckCircle, Clock, XCircle, Eye, Loader2, AlertCircle} from "lucide-react"
import {useSession} from "next-auth/react"
import {getUserOrders} from "@/actions/order"
import {toast} from "sonner"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

interface Order {
  _id: string
  orderNumber: string
  status: string
  paymentStatus: string
  totalAmount: number
  createdAt: string
  items: Array<{
    productName: string
    quantity: number
    unitPrice: number
    totalPrice: number
  }>
  trackingInfo?: {
    courierName: string
    trackingNumber: string
    trackingUrl?: string
    shippedAt?: string
  }
  shippingAddress: {
    street: string
    city: string
    state: string
    postalCode: string
    country: string
  }
}

const statusConfig = {
  PENDING: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800",
    icon: Clock,
  },
  CONFIRMED: {
    label: "Confirmed",
    color: "bg-blue-100 text-blue-800",
    icon: CheckCircle,
  },
  PROCESSING: {
    label: "Processing",
    color: "bg-purple-100 text-purple-800",
    icon: Package,
  },
  SHIPPED: {
    label: "Shipped",
    color: "bg-indigo-100 text-indigo-800",
    icon: Truck,
  },
  DELIVERED: {
    label: "Delivered",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
  },
  CANCELLED: {
    label: "Cancelled",
    color: "bg-red-100 text-red-800",
    icon: XCircle,
  },
}

export default function UserOrders() {
  const {data: session} = useSession()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  useEffect(() => {
    if (session?.user) {
      fetchUserOrders()
    }
  }, [session])

  const fetchUserOrders = async () => {
    try {
      setError(null)
      const data = await getUserOrders()
      
      setOrders(data.orders as any || [])
    } catch (error) {
      console.error("Error fetching user orders:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch orders"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const getStatusConfig = (status: string) => {
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load orders</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <Button onClick={fetchUserOrders} variant="outline">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Orders</CardTitle>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-500 mb-4">Start shopping to see your orders here</p>
            <Button asChild>
              <a href="/shop">Browse Products</a>
            </Button>
          </div>
        ) : (
          <div className="space-y-4 max-h-[300px] overflow-y-auto">
            {orders.map((order) => {
              const status = getStatusConfig(order.status)
              const StatusIcon = status.icon

              return (
                <div key={order._id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <StatusIcon className="h-5 w-5 text-gray-600" />
                      <div>
                        <h3 className="font-medium">{order.orderNumber}</h3>
                        <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">£{order.totalAmount.toFixed(2)}</p>
                      <Badge className={status.color}>{status.label}</Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                    </div>
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </SheetTrigger>
                      <SheetContent className="max-w-2xl px-4 overflow-y-auto">
                        <SheetHeader>
                          <SheetTitle>Order Details - {order.orderNumber}</SheetTitle>
                        </SheetHeader>
                        {selectedOrder && (
                          <div className="space-y-6">
                            {/* Order Summary */}
                            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                              <div>
                                <p className="text-sm text-gray-600">Status</p>
                                <Badge className={status.color}>{status.label}</Badge>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Total</p>
                                <p className="font-bold">£{selectedOrder.totalAmount.toFixed(2)}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Date</p>
                                <p>{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Payment</p>
                                <Badge
                                  className={
                                    selectedOrder.paymentStatus === "COMPLETED"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  }
                                >
                                  {selectedOrder.paymentStatus}
                                </Badge>
                              </div>
                            </div>

                            {/* Tracking Info */}
                            {selectedOrder.trackingInfo && (
                              <div>
                                <h4 className="font-medium mb-2">Tracking Information</h4>
                                <div className="p-3 bg-blue-50 rounded-lg">
                                  <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                      <p className="text-gray-600">Courier</p>
                                      <p className="font-medium">{selectedOrder.trackingInfo.courierName}</p>
                                    </div>
                                    <div>
                                      <p className="text-gray-600">Tracking Number</p>
                                      <p className="font-medium">{selectedOrder.trackingInfo.trackingNumber}</p>
                                    </div>
                                  </div>
                                  {selectedOrder.trackingInfo.trackingUrl && (
                                    <div className="mt-2">
                                      <a
                                        href={selectedOrder.trackingInfo.trackingUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline text-sm"
                                      >
                                        Track Package →
                                      </a>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Order Items */}
                            <div>
                              <h4 className="font-medium mb-2">Order Items</h4>
                              <div className="space-y-2">
                                {selectedOrder.items.map((item, index) => (
                                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
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
                            </div>

                            {/* Shipping Address */}
                            <div>
                              <h4 className="font-medium mb-2">Shipping Address</h4>
                              <div className="p-3 bg-gray-50 rounded text-sm">
                                <p>{selectedOrder.shippingAddress.street}</p>
                                <p>
                                  {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}
                                </p>
                                <p>
                                  {selectedOrder.shippingAddress.postalCode}, {selectedOrder.shippingAddress.country}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </SheetContent>
                    </Sheet>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
