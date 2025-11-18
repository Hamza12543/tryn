// "use client"
// import {useState, useEffect, useCallback} from "react"
// import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
// import {Button} from "@/components/ui/button"
// import {Input} from "@/components/ui/input"
// import {Badge} from "@/components/ui/badge"
// import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
// import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog"
// import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
// import {Textarea} from "@/components/ui/textarea"
// import {Label} from "@/components/ui/label"
// import {Search, Filter, Eye, Package, Truck, CheckCircle, XCircle, Loader2, AlertCircle} from "lucide-react"
// import {useSession} from "next-auth/react"
// import {useRouter} from "next/navigation"
// import {getOrders, updateOrder} from "@/actions/order"
// import {toast} from "sonner"

// interface Order {
//   _id: string
//   orderNumber: string
//   customerName: string
//   customerEmail: string
//   totalAmount: number
//   status: string
//   paymentStatus: string
//   createdAt: string
//   items: Array<{
//     productName: string
//     quantity: number
//     unitPrice: number
//     totalPrice: number
//   }>
//   shippingAddress: {
//     street: string
//     city: string
//     state: string
//     postalCode: string
//     country: string
//   }
//   trackingInfo?: {
//     courierName: string
//     trackingNumber: string
//     trackingUrl?: string
//     shippedAt?: string
//   }
//   adminNotes?: string
// }

// const statusColors = {
//   PENDING: "bg-yellow-100 text-yellow-800",
//   CONFIRMED: "bg-blue-100 text-blue-800",
//   PROCESSING: "bg-purple-100 text-purple-800",
//   SHIPPED: "bg-indigo-100 text-indigo-800",
//   DELIVERED: "bg-green-100 text-green-800",
//   CANCELLED: "bg-red-100 text-red-800",
//   REFUNDED: "bg-gray-100 text-gray-800",
// }

// const paymentStatusColors = {
//   PENDING: "bg-yellow-100 text-yellow-800",
//   PROCESSING: "bg-blue-100 text-blue-800",
//   COMPLETED: "bg-green-100 text-green-800",
//   FAILED: "bg-red-100 text-red-800",
//   CANCELLED: "bg-gray-100 text-gray-800",
//   REFUNDED: "bg-orange-100 text-orange-800",
// }

// export default function OrdersPage() {
//   const {data: session} = useSession()
//   const router = useRouter()
//   const [orders, setOrders] = useState<Order[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
//   const [statusFilter, setStatusFilter] = useState("all")
//   const [searchTerm, setSearchTerm] = useState("")
//   const [updating, setUpdating] = useState(false)

//   const fetchOrders = useCallback(async () => {
//     try {
//       setError(null)
//       const data = await getOrders(statusFilter !== "all" ? statusFilter : undefined, searchTerm || undefined)
//       setOrders(data.orders || [])
//     } catch (error) {
//       console.error("Error fetching orders:", error)
//       const errorMessage = error instanceof Error ? error.message : "Failed to fetch orders"
//       setError(errorMessage)
//       toast.error(errorMessage)
//     } finally {
//       setLoading(false)
//     }
//   }, [statusFilter, searchTerm])

//   useEffect(() => {
//     if (!session?.user) {
//       router.push("/login")
//       return
//     }
//     fetchOrders()
//   }, [session, fetchOrders, router])

//   const handleStatusChange = async (orderId: string, newStatus: string) => {
//     setUpdating(true)
//     try {
//       const {order} = await updateOrder(orderId, {status: newStatus})
//       setOrders((prev) => prev.map((o) => (o._id === orderId ? order : o)))
//       setSelectedOrder(order)
//       toast.success("Order status updated successfully")
//     } catch (error) {
//       console.error("Error updating order:", error)
//       const errorMessage = error instanceof Error ? error.message : "Failed to update order status"
//       toast.error(errorMessage)
//     } finally {
//       setUpdating(false)
//     }
//   }

//   // const handleTrackingUpdate = async (orderId: string, trackingInfo: any) => {
//   //   setUpdating(true)
//   //   try {
//   //     const {order} = await updateOrder(orderId, {trackingInfo})
//   //     setOrders((prev) => prev.map((o) => (o._id === orderId ? order : o)))
//   //     setSelectedOrder(order)
//   //     toast.success("Tracking information updated successfully")
//   //   } catch (error) {
//   //     console.error("Error updating tracking:", error)
//   //     const errorMessage = error instanceof Error ? error.message : "Failed to update tracking information"
//   //     toast.error(errorMessage)
//   //   } finally {
//   //     setUpdating(false)
//   //   }
//   // }

//   const handleTrackingUpdate = async (orderId: string, trackingInfo: any) => {
//   // setUpdating(true)
//   try {
//     const response = await updateOrder(orderId, { trackingInfo })

//     // If backend returns { order: {...} }
//     const updatedOrder = response.order || response

//     setOrders((prev) =>
//       prev.map((o) => (o._id === orderId ? updatedOrder : o))
//     )
//     setSelectedOrder(updatedOrder)

//     toast.success("Tracking information updated successfully")
//   } catch (error) {
//     console.error("Error updating tracking:", error)
//     const errorMessage =
//       error instanceof Error
//         ? error.message
//         : "Failed to update tracking information"
//     toast.error(errorMessage)
//   } finally {
//     setUpdating(false)
//   }
// }


//   // const handleNotesUpdate = async (orderId: string, adminNotes: string) => {
//   //   setUpdating(true)
//   //   try {
//   //     const {order} = await updateOrder(orderId, {adminNotes})
//   //     setOrders((prev) => prev.map((o) => (o._id === orderId ? order : o)))
//   //     setSelectedOrder(order)
//   //     toast.success("Admin notes updated successfully")
//   //   } catch (error) {
//   //     console.error("Error updating notes:", error)
//   //     const errorMessage = error instanceof Error ? error.message : "Failed to update admin notes"
//   //     toast.error(errorMessage)
//   //   } finally {
//   //     setUpdating(false)
//   //   }
//   // }

//   const handleNotesUpdate = async (orderId: string, adminNotes: string) => {
//   // setUpdating(true)
//   try {
//     const response = await updateOrder(orderId, { adminNotes })

//     // Handle different possible API response shapes
//     const updatedOrder = response.order || response

//     setOrders((prev) =>
//       prev.map((o) => (o._id === orderId ? updatedOrder : o))
//     )
//     setSelectedOrder(updatedOrder)

//     toast.success("Admin notes updated successfully")
//   } catch (error) {
//     console.error("Error updating notes:", error)
//     const errorMessage =
//       error instanceof Error
//         ? error.message
//         : "Failed to update admin notes"
//     toast.error(errorMessage)
//   } finally {
//     setUpdating(false)
//   }
// }


//   console.log("Orders:", orders)
//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <Loader2 className="h-8 w-8 animate-spin" />
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="space-y-6">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
//             <p className="text-muted-foreground">Manage and track customer orders.</p>
//           </div>
//         </div>
//         <Card>
//           <CardContent className="flex flex-col items-center justify-center h-64">
//             <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
//             <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load orders</h3>
//             <p className="text-gray-500 mb-4 text-center">{error}</p>
//             <Button onClick={fetchOrders} variant="outline">
//               Try Again
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
//           <p className="text-muted-foreground">Manage and track customer orders.</p>
//         </div>
//       </div>

//       <Card>
//         <CardHeader>
//           <div className="flex items-center justify-between">
//             <CardTitle>All Orders</CardTitle>
//             <div className="flex items-center space-x-2">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
//                 <Input
//                   placeholder="Search orders..."
//                   className="w-64 pl-10"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
//               <Select value={statusFilter} onValueChange={setStatusFilter}>
//                 <SelectTrigger className="w-32">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All</SelectItem>
//                   <SelectItem value="PENDING">Pending</SelectItem>
//                   <SelectItem value="CONFIRMED">Confirmed</SelectItem>
//                   <SelectItem value="PROCESSING">Processing</SelectItem>
//                   <SelectItem value="SHIPPED">Shipped</SelectItem>
//                   <SelectItem value="DELIVERED">Delivered</SelectItem>
//                   <SelectItem value="CANCELLED">Cancelled</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             {orders.length === 0 ? (
//               <div className="text-center py-12">
//                 <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//                 <h3 className="text-lg font-medium text-gray-900 mb-2">
//                   {searchTerm || statusFilter !== "all" ? "No orders found" : "No orders yet"}
//                 </h3>
//                 <p className="text-gray-500">
//                   {searchTerm || statusFilter !== "all"
//                     ? "Try adjusting your search or filter criteria."
//                     : "Orders will appear here once customers start making purchases."}
//                 </p>
//               </div>
//             ) : (
//               orders.map((order) => (
//                 <div key={order._id} className="flex items-center space-x-4 rounded-lg border p-4">
//                   <Avatar className="h-10 w-10">
//                     <AvatarFallback>
//                       {order.customerName
//                         ? order.customerName
//                             .split(" ")
//                             .map((n) => n[0])
//                             .join("")
//                         : "NA"}
//                     </AvatarFallback>
//                   </Avatar>
//                   <div className="flex-1 space-y-1">
//                     <div className="flex items-center space-x-2">
//                       <p className="text-sm font-medium">{order.orderNumber}</p>
//                       <Badge className={statusColors[order.status as keyof typeof statusColors]}>{order.status}</Badge>
//                       <Badge className={paymentStatusColors[order.paymentStatus as keyof typeof paymentStatusColors]}>
//                         {order.paymentStatus}
//                       </Badge>
//                     </div>
//                     <p className="text-sm text-muted-foreground">{order.customerName}</p>
//                     <p className="text-xs text-muted-foreground">{order.customerEmail}</p>
//                     <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
//                   </div>
//                   <div className="text-right">
//                     <p className="text-sm font-medium">£{order.totalAmount.toFixed(2)}</p>
//                     <p className="text-xs text-muted-foreground">{order.items?.length || 0} items</p>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <Dialog>
//                       <DialogTrigger asChild>
//                         <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(order)}>
//                           <Eye className="h-4 w-4" />
//                         </Button>
//                       </DialogTrigger>
//                       <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
//                         <DialogHeader>
//                           <DialogTitle>Order Details - {order.orderNumber}</DialogTitle>
//                         </DialogHeader>
//                         {selectedOrder && (
//                           <div className="space-y-6">
//                             {/* Order Info */}
//                             <div className="grid grid-cols-2 gap-4">
//                               <div>
//                                 <Label>Status</Label>
//                                 <Select
//                                   value={selectedOrder.status}
//                                   onValueChange={(value) => handleStatusChange(selectedOrder._id, value)}
//                                   disabled={updating}>
//                                   <SelectTrigger>
//                                     <SelectValue />
//                                   </SelectTrigger>
//                                   <SelectContent>
//                                     <SelectItem value="PENDING">Pending</SelectItem>
//                                     <SelectItem value="CONFIRMED">Confirmed</SelectItem>
//                                     <SelectItem value="PROCESSING">Processing</SelectItem>
//                                     <SelectItem value="SHIPPED">Shipped</SelectItem>
//                                     <SelectItem value="DELIVERED">Delivered</SelectItem>
//                                     <SelectItem value="CANCELLED">Cancelled</SelectItem>
//                                   </SelectContent>
//                                 </Select>
//                               </div>
//                               <div>
//                                 <Label>Payment Status</Label>
//                                 <Badge
//                                   className={
//                                     paymentStatusColors[selectedOrder.paymentStatus as keyof typeof paymentStatusColors]
//                                   }>
//                                   {selectedOrder.paymentStatus}
//                                 </Badge>
//                               </div>
//                             </div>

//                             {/* Tracking Info */}
//                             <div>
//                               <Label>Tracking Information</Label>
//                               <div className="grid grid-cols-2 gap-2 mt-2">
//                                 <Input
//                                   placeholder="Courier Name"
//                                   value={selectedOrder.trackingInfo?.courierName || ""}
//                                   onChange={(e) =>
//                                     handleTrackingUpdate(selectedOrder._id, {
//                                       ...(selectedOrder.trackingInfo || {}),
//                                       courierName: e.target.value,
//                                     })
//                                   }
//                                   disabled={updating}
//                                 />
//                                 <Input
//                                   placeholder="Tracking Number"
//                                   value={selectedOrder.trackingInfo?.trackingNumber || ""}
//                                   onChange={(e) =>
//                                     handleTrackingUpdate(selectedOrder._id, {
//                                       ...selectedOrder.trackingInfo,
//                                       trackingNumber: e.target.value,
//                                     })
//                                   }
//                                   disabled={updating}
//                                 />
//                               </div>
//                             </div>

//                             {/* Admin Notes */}
//                             <div>
//                               <Label>Admin Notes</Label>
//                               <Textarea
//                                 placeholder="Add admin notes..."
//                                 value={selectedOrder.adminNotes || ""}
//                                 onChange={(e) => handleNotesUpdate(selectedOrder._id, e.target.value)}
//                                 rows={3}
//                                 disabled={updating}
//                               />
//                             </div>

//                             {/* Order Items */}
//                             <div>
//                               <Label>Order Items</Label>
//                               <div className="space-y-2 mt-2">
//                                 {selectedOrder.items?.map((item, index) => (
//                                   <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
//                                     <div>
//                                       <p className="font-medium">{item.productName}</p>
//                                       <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
//                                     </div>
//                                     <div className="text-right">
//                                       <p className="font-medium">£{item.totalPrice.toFixed(2)}</p>
//                                       <p className="text-sm text-gray-600">£{item.unitPrice.toFixed(2)} each</p>
//                                     </div>
//                                   </div>
//                                 ))}
//                               </div>
//                             </div>

//                             {/* Shipping Address */}
//                             <div>
//                               <Label>Shipping Address</Label>
//                               <div className="mt-2 p-3 bg-gray-50 rounded text-sm">
//                                 <p>{selectedOrder.shippingAddress.street}</p>
//                                 <p>
//                                   {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}
//                                 </p>
//                                 <p>
//                                   {selectedOrder.shippingAddress.postalCode}, {selectedOrder.shippingAddress.country}
//                                 </p>
//                               </div>
//                             </div>
//                           </div>
//                         )}
//                       </DialogContent>

                      
//                     </Dialog>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }


"use client"
import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Search, Package, Eye, Loader2, AlertCircle } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { getOrders, updateOrder } from "@/actions/order"
import { toast } from "sonner"

interface Order {
  _id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  totalAmount: number
  status: string
  paymentStatus: string
  createdAt: string
  items: Array<{
    productName: string
    quantity: number
    unitPrice: number
    totalPrice: number
  }>
  shippingAddress: {
    street: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  trackingInfo?: {
    courierName: string
    trackingNumber: string
    trackingUrl?: string
    shippedAt?: string
  }
  adminNotes?: string
}

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-purple-100 text-purple-800",
  SHIPPED: "bg-indigo-100 text-indigo-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  REFUNDED: "bg-gray-100 text-gray-800",
}

const paymentStatusColors = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-green-100 text-green-800",
  FAILED: "bg-red-100 text-red-800",
  CANCELLED: "bg-gray-100 text-gray-800",
  REFUNDED: "bg-orange-100 text-orange-800",
}

export default function OrdersPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [formData, setFormData] = useState<Order | null>(null)
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [updating, setUpdating] = useState(false)

  const fetchOrders = useCallback(async () => {
    try {
      setError(null)
      const data = await getOrders(
        statusFilter !== "all" ? statusFilter : undefined,
        searchTerm || undefined
      )
      setOrders(
        (data.orders || []).map((o: any) => ({
          _id: o._id,
          orderNumber: o.orderNumber,
          customerName: o.customerName,
          customerEmail: o.customerEmail,
          totalAmount: o.totalAmount,
          status: o.status,
          paymentStatus: o.paymentStatus,
          createdAt: o.createdAt,
          items: o.items as Array<{
          productName: string
          quantity: number
          unitPrice: number
          totalPrice: number
        }>,
          shippingAddress: o.shippingAddress,
          trackingInfo: o.trackingInfo,
          adminNotes: o.adminNotes,
        }))
      )
    } catch (error) {
      console.error("Error fetching orders:", error)
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch orders"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [statusFilter, searchTerm])

  useEffect(() => {
    if (!session?.user) {
      router.push("/login")
      return
    }
    fetchOrders()

    console.log("Session:", orders)
  }, [session, fetchOrders, router])

  const openOrderDialog = (order: Order) => {
    setSelectedOrder(order)
    setFormData(order) // copy data for editing
  }

  const handleSaveChanges = async (orderId: string, data: Order) => {
    setUpdating(true)
    try {
      const response = await updateOrder(orderId, {
        status: data.status,
        trackingInfo: data.trackingInfo,
        adminNotes: data.adminNotes,
      })

      const rawOrder = Array.isArray(response) ? response[0] : response
      const orderData = {
        _id: rawOrder._id as string,
        orderNumber: rawOrder.orderNumber as string,
        customerName: rawOrder.customerName as string,
        customerEmail: rawOrder.customerEmail as string,
        totalAmount: rawOrder.totalAmount as number,
        status: rawOrder.status as string,
        paymentStatus: rawOrder.paymentStatus as string,
        createdAt: rawOrder.createdAt as string,
        items: rawOrder.items as Array<{
          productName: string
          quantity: number
          unitPrice: number
          totalPrice: number
        }>,
        shippingAddress: rawOrder.shippingAddress as {
          street: string
          city: string
          state: string
          postalCode: string
          country: string
        },
        trackingInfo: rawOrder.trackingInfo,
        adminNotes: rawOrder.adminNotes,
      }
      const updatedOrder: Order = orderData
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? updatedOrder : o))
      )
      setSelectedOrder(updatedOrder)
      setFormData(updatedOrder)

      toast.success("Order updated successfully")
    } catch (error) {
      console.error("Error updating order:", error)
      toast.error("Failed to update order")
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
            <p className="text-muted-foreground">
              Manage and track customer orders.
            </p>
          </div>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Unable to load orders
            </h3>
            <p className="text-gray-500 mb-4 text-center">{error}</p>
            <Button onClick={fetchOrders} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">
            Manage and track customer orders.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Orders</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search orders..."
                  className="w-64 pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                  <SelectItem value="PROCESSING">Processing</SelectItem>
                  <SelectItem value="SHIPPED">Shipped</SelectItem>
                  <SelectItem value="DELIVERED">Delivered</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm || statusFilter !== "all"
                    ? "No orders found"
                    : "No orders yet"}
                </h3>
                <p className="text-gray-500">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your search or filter criteria."
                    : "Orders will appear here once customers start making purchases."}
                </p>
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order._id}
                  className="flex items-center space-x-4 rounded-lg border p-4"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {order.customerName
                        ? order.customerName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                        : "NA"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium">{order.orderNumber}</p>
                      <Badge
                        className={
                          statusColors[
                            order.status as keyof typeof statusColors
                          ]
                        }
                      >
                        {order.status}
                      </Badge>
                      <Badge
                        className={
                          paymentStatusColors[
                            order.paymentStatus as keyof typeof paymentStatusColors
                          ]
                        }
                      >
                        {order.paymentStatus}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {order.customerName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {order.customerEmail}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      £{order.totalAmount.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {order.items?.length || 0} items
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                 
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openOrderDialog(order)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </SheetTrigger>
                      <SheetContent  className="max-w-2xl px-4 overflow-y-auto">
                        <SheetHeader>
                          <SheetTitle>
                            Order Details - {order.orderNumber}
                          </SheetTitle>
                        </SheetHeader>
                        {formData && (
                          <form
                            className="space-y-6"
                            onSubmit={(e) => {
                              e.preventDefault()
                              handleSaveChanges(order._id, formData)
                            }}
                          >
                            {/* Order Info */}
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Status</Label>
                                <Select
                                  value={formData.status}
                                  onValueChange={(value) =>
                                    setFormData((prev) =>
                                      prev
                                        ? { ...prev, status: value }
                                        : prev
                                    )
                                  }
                                  disabled={updating}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="PENDING">
                                      Pending
                                    </SelectItem>
                                    <SelectItem value="CONFIRMED">
                                      Confirmed
                                    </SelectItem>
                                    <SelectItem value="PROCESSING">
                                      Processing
                                    </SelectItem>
                                    <SelectItem value="SHIPPED">
                                      Shipped
                                    </SelectItem>
                                    <SelectItem value="DELIVERED">
                                      Delivered
                                    </SelectItem>
                                    <SelectItem value="CANCELLED">
                                      Cancelled
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label>Payment Status</Label>
                                <Badge
                                  className={
                                    paymentStatusColors[
                                      formData.paymentStatus as keyof typeof paymentStatusColors
                                    ]
                                  }
                                >
                                  {formData.paymentStatus}
                                </Badge>
                              </div>
                            </div>

                            {/* Tracking Info */}
                            <div>
                              <Label>Tracking Information</Label>
                              <div className="grid grid-cols-2 gap-2 mt-2">
                                <Input
                                  placeholder="Courier Name"
                                  value={formData.trackingInfo?.courierName || ""}
                                  onChange={(e) =>
                                    setFormData((prev) =>
                                      prev
                                        ? {
                                            ...prev,
                                            trackingInfo: {
                                              ...(prev.trackingInfo || {}),
                                              courierName: e.target.value,
                                              trackingNumber:
                                                prev.trackingInfo?.trackingNumber ?? "",
                                              trackingUrl: prev.trackingInfo?.trackingUrl,
                                              shippedAt: prev.trackingInfo?.shippedAt,
                                            },
                                          }
                                        : prev
                                    )
                                  }
                                  disabled={updating}
                                />
                                <Input
                                  placeholder="Tracking Number"
                                  value={
                                    formData.trackingInfo?.trackingNumber ?? ""
                                  }
                                  onChange={(e) =>
                                    setFormData((prev) =>
                                      prev
                                        ? {
                                            ...prev,
                                            trackingInfo: {
                                              ...(prev.trackingInfo || {}),
                                              trackingNumber: e.target.value,
                                              courierName: prev.trackingInfo?.courierName ?? "",
                                              trackingUrl: prev.trackingInfo?.trackingUrl,
                                              shippedAt: prev.trackingInfo?.shippedAt,
                                            },
                                          }
                                        : prev
                                    )
                                  }
                                  disabled={updating}
                                />
                              </div>
                            </div>

                            {/* Admin Notes */}
                            <div>
                              <Label className="mb-2">Admin Notes</Label>
                              <Textarea
                                placeholder="Add admin notes..."
                                value={formData.adminNotes || ""}
                                onChange={(e) =>
                                  setFormData((prev) =>
                                    prev
                                      ? {
                                          ...prev,
                                          adminNotes: e.target.value,
                                        }
                                      : prev
                                  )
                                }
                                rows={3}
                                disabled={updating}
                              />
                            </div>

                            {/* Order Items */}
                            <div>
                              <Label>Order Items</Label>
                              <div className="space-y-2 mt-2">
                                {formData.items?.map((item, index) => (
                                  <div
                                    key={index}
                                    className="flex justify-between items-center p-2 bg-gray-50 rounded"
                                  >
                                    <div>
                                      <p className="font-medium">
                                        {item.productName}
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        Qty: {item.quantity}
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-medium">
                                        £{item.totalPrice.toFixed(2)}
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        £{item.unitPrice.toFixed(2)} each
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Shipping Address */}
                            <div>
                              <Label>Shipping Address</Label>
                              <div className="mt-2 p-3 bg-gray-50 rounded text-sm">
                                <p>{formData.shippingAddress.street}</p>
                                <p>
                                  {formData.shippingAddress.city},{" "}
                                  {formData.shippingAddress.state}
                                </p>
                                <p>
                                  {formData.shippingAddress.postalCode},{" "}
                                  {formData.shippingAddress.country}
                                </p>
                              </div>
                            </div>

                            {/* Save Button */}
                            <div className="flex justify-end">
                              <Button type="submit" disabled={updating}>
                                {updating ? "Saving..." : "Save Changes"}
                              </Button>
                            </div>
                          </form>
                        )}
                      </SheetContent>
                    </Sheet>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
