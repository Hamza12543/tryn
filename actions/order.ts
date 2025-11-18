// "use server"

// import {getServerSession} from "next-auth"
// import {authOptions} from "@/lib/auth"
// import {connectDB} from "@/lib/mongodb"
// import Order from "@/models/Order"
// import OrderItem from "@/models/OrderItem"
// import User from "@/models/User"
// import {revalidatePath} from "next/cache"

// export async function getOrders(status?: string, search?: string, page: number = 1, limit: number = 10) {
//   try {
//     const session = await getServerSession(authOptions)

//     if (!session?.user) {
//       throw new Error("Please sign in to view orders")
//     }

//     await connectDB()

//     // Check if user is admin
//     const user = await User.findById(session.user.id)
//     if (!user || user.role !== "ADMIN") {
//       throw new Error("You do not have permission to view all orders")
//     }

//     const query: any = {}

//     if (status && status !== "all") {
//       query.status = status
//     }

//     if (search) {
//       query.$or = [
//         {orderNumber: {$regex: search, $options: "i"}},
//         {customerName: {$regex: search, $options: "i"}},
//         {customerEmail: {$regex: search, $options: "i"}},
//       ]
//     }

//     const skip = (page - 1) * limit

//     const orders = await Order.find(query)
//       .populate("userId", "name email")
//       .sort({createdAt: -1})
//       .skip(skip)
//       .limit(limit)

//     const total = await Order.countDocuments(query)

//     return {
//       orders,
//       pagination: {
//         page,
//         limit,
//         total,
//         pages: Math.ceil(total / limit),
//       },
//     }
//   } catch (error) {
//     console.error("Error fetching orders:", error)
//     if (error instanceof Error) {
//       throw error
//     }
//     throw new Error("Failed to fetch orders. Please try again.")
//   }
// }

// export async function updateOrder(
//   orderId: string,
//   updates: {
//     status?: string
//     trackingInfo?: {
//       courierName: string
//       trackingNumber: string
//       trackingUrl?: string
//       shippedAt?: string
//     }
//     adminNotes?: string
//   }
// ) {
//   try {
//     const session = await getServerSession(authOptions)

//     if (!session?.user) {
//       throw new Error("Please sign in to update orders")
//     }

//     await connectDB()

//     // Check if user is admin
//     const user = await User.findById(session.user.id)
//     if (!user || user.role !== "ADMIN") {
//       throw new Error("You do not have permission to update orders")
//     }

//     if (!orderId) {
//       throw new Error("Order ID is required")
//     }

//     const updateData: any = {}

//     if (updates.status) {
//       updateData.status = updates.status
//     }

//     if (updates.trackingInfo) {
//       updateData.trackingInfo = {
//         ...updates.trackingInfo,
//         shippedAt: updates.trackingInfo.shippedAt ? new Date(updates.trackingInfo.shippedAt) : new Date(),
//       }
//     }

//     if (updates.adminNotes !== undefined) {
//       updateData.adminNotes = updates.adminNotes
//     }

//     const order = await Order.findByIdAndUpdate(orderId, updateData, {new: true}).populate("userId", "name email")

//     if (!order) {
//       throw new Error("Order not found")
//     }

//     revalidatePath("/admin/orders")
//     return {order}
//   } catch (error) {
//     console.error("Error updating order:", error)
//     if (error instanceof Error) {
//       throw error
//     }
//     throw new Error("Failed to update order. Please try again.")
//   }
// }

// export async function getOrderById(orderId: string) {
//   try {
//     const session = await getServerSession(authOptions)

//     if (!session?.user) {
//       throw new Error("Please sign in to view order details")
//     }

//     if (!orderId) {
//       throw new Error("Order ID is required")
//     }

//     await connectDB()

//     const order = await Order.findById(orderId).populate("userId", "name email")

//     if (!order) {
//       throw new Error("Order not found")
//     }

//     // Check if user is admin or the order owner
//     const user = await User.findById(session.user.id)
//     if (!user || (user.role !== "ADMIN" && order.userId.toString() !== session.user.id)) {
//       throw new Error("You do not have permission to view this order")
//     }

//     // Get order items
//     const orderItems = await OrderItem.find({orderId: order._id}).populate("productId", "name images sku")

//     return {
//       order,
//       items: orderItems,
//     }
//   } catch (error) {
//     console.error("Error fetching order:", error)
//     if (error instanceof Error) {
//       throw error
//     }
//     throw new Error("Failed to fetch order details. Please try again.")
//   }
// }

// export async function getUserOrders() {
//   try {
//     const session = await getServerSession(authOptions)

//     if (!session?.user) {
//       throw new Error("Please sign in to view your orders")
//     }

//     await connectDB()

//     const orders = await Order.find({userId: session.user.id}).sort({createdAt: -1}).populate("userId", "name email")

//     // Get order items for each order
//     const ordersWithItems = await Promise.all(
//       orders.map(async (order) => {
//         const orderItems = await OrderItem.find({orderId: order._id}).populate("productId", "name images sku")

//         return {
//           ...order.toObject(),
//           items: orderItems.map((item) => ({
//             productName: item.productName,
//             quantity: item.quantity,
//             unitPrice: item.unitPrice,
//             totalPrice: item.totalPrice,
//           })),
//         }
//       })
//     )

//     return {
//       orders: ordersWithItems,
//     }
//   } catch (error) {
//     console.error("Error fetching user orders:", error)
//     if (error instanceof Error) {
//       throw error
//     }
//     throw new Error("Failed to fetch your orders. Please try again.")
//   }
// }

"use server"

import {getServerSession} from "next-auth"
import {authOptions} from "@/lib/auth"
import {connectDB} from "@/lib/mongodb"
import Order from "@/models/Order"
import OrderItem from "@/models/OrderItem"
import User from "@/models/User"
import {revalidatePath} from "next/cache"
import mongoose from "mongoose"
import {sendOrderCreatedEmails, sendOrderStatusUpdateEmail} from "@/lib/emailService"

// 🔒 helper to strip Mongoose docs into plain JSON
function serialize<T>(data: T): T {
  return JSON.parse(JSON.stringify(data))
}

export async function getOrders(status?: string, search?: string, page: number = 1, limit: number = 10) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) throw new Error("Please sign in to view orders")

    await connectDB()
    const user = (await User.findById(session.user.id).lean()) as {role?: string} | null
    if (!user || user.role !== "ADMIN") throw new Error("You do not have permission to view all orders")

    const query: any = {}
    if (status && status !== "all") query.status = status
    if (search) {
      query.$or = [
        {orderNumber: {$regex: search, $options: "i"}},
        {customerName: {$regex: search, $options: "i"}},
        {customerEmail: {$regex: search, $options: "i"}},
      ]
    }

    const skip = (page - 1) * limit
    const orders = await Order.find(query)
      .populate("userId", "name email")
      .sort({createdAt: -1})
      .skip(skip)
      .limit(limit)
      .lean()

    // 🔥 fetch items for each order
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const orderItems = await OrderItem.find({orderId: order._id}).populate("productId", "name images sku").lean()

        return {
          ...order,
          items: orderItems.map((item) => ({
            productName: item.productName,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
          })),
        }
      })
    )

    const total = await Order.countDocuments(query)

    return serialize({
      orders: ordersWithItems,
      pagination: {page, limit, total, pages: Math.ceil(total / limit)},
    })
  } catch (error) {
    console.error("Error fetching orders:", error)
    throw error instanceof Error ? error : new Error("Failed to fetch orders. Please try again.")
  }
}

export async function updateOrder(orderId: string, updates: any) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) throw new Error("Please sign in to update orders")

    await connectDB()
    const user = (await User.findById(session.user.id).lean()) as {role?: string} | null
    if (!user || user.role !== "ADMIN") throw new Error("You do not have permission to update orders")

    if (!mongoose.Types.ObjectId.isValid(orderId)) throw new Error("Invalid order ID")

    const updateData: any = {}
    if (updates.status) updateData.status = updates.status
    if (updates.trackingInfo) {
      updateData.trackingInfo = {
        ...updates.trackingInfo,
        shippedAt: updates.trackingInfo.shippedAt ? new Date(updates.trackingInfo.shippedAt) : new Date(),
      }
    }
    if (updates.adminNotes !== undefined) updateData.adminNotes = updates.adminNotes

    const order = await Order.findByIdAndUpdate(orderId, updateData, {new: true})
      .populate("userId", "name email")
      .lean()

    if (!order) throw new Error("Order not found")

    // 📧 Send status update emails
    await sendOrderStatusUpdateEmail(order as any)

    revalidatePath("/admin/orders")
    return serialize(order)
  } catch (error) {
    console.error("Error updating order:", error)
    throw error instanceof Error ? error : new Error("Failed to update order")
  }
}

export async function getOrderById(orderId: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) throw new Error("Please sign in to view order details")
    if (!mongoose.Types.ObjectId.isValid(orderId)) throw new Error("Invalid order ID")

    await connectDB()
    const order = await Order.findById(orderId).populate("userId", "name email").lean()
    if (!order) throw new Error("Order not found")

    const user = (await User.findById(session.user.id).lean()) as {role?: string; _id?: any} | null
    const typedOrder = order as unknown as {userId: any}
    if (!user || (user.role !== "ADMIN" && typedOrder.userId.toString() !== session.user.id)) {
      throw new Error("You do not have permission to view this order")
    }

    const orderItems = await OrderItem.find({orderId: (order as {_id: any})._id})
      .populate("productId", "name images sku")
      .lean()

    return serialize({order, items: orderItems})
  } catch (error) {
    console.error("Error fetching order:", error)
    throw error instanceof Error ? error : new Error("Failed to fetch order details")
  }
}

export async function acceptOrder(orderId: string, trackingInfo?: any) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) throw new Error("Please sign in to accept orders")

    await connectDB()
    const user = (await User.findById(session.user.id).lean()) as {role?: string} | null
    if (!user || user.role !== "ADMIN") throw new Error("You do not have permission to accept orders")

    if (!mongoose.Types.ObjectId.isValid(orderId)) throw new Error("Invalid order ID")

    const updateData: any = {status: "CONFIRMED"}
    if (trackingInfo?.courierName && trackingInfo?.trackingNumber) {
      updateData.status = "SHIPPED"
      updateData.trackingInfo = {...trackingInfo, shippedAt: new Date()}
    }

    const order = await Order.findByIdAndUpdate(orderId, updateData, {new: true})
      .populate("userId", "name email")
      .lean()

    if (!order) throw new Error("Order not found")

    // 📧 Use your service to send status update email
    await sendOrderStatusUpdateEmail(order as any)

    revalidatePath("/admin/orders")
    return serialize(order)
  } catch (error) {
    console.error("Error accepting order:", error)
    throw error instanceof Error ? error : new Error("Failed to accept order")
  }
}

export async function declineOrder(orderId: string, reason?: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) throw new Error("Please sign in to decline orders")

    await connectDB()
    const user = (await User.findById(session.user.id).lean()) as {role?: string} | null
    if (!user || user.role !== "ADMIN") throw new Error("You do not have permission to decline orders")

    if (!mongoose.Types.ObjectId.isValid(orderId)) throw new Error("Invalid order ID")

    const updateData: any = {status: "CANCELLED"}
    if (reason) updateData.adminNotes = reason

    const order = await Order.findByIdAndUpdate(orderId, updateData, {new: true})
      .populate("userId", "name email")
      .lean()

    if (!order) throw new Error("Order not found")

    // 📧 Reuse your service for cancelled orders
    await sendOrderStatusUpdateEmail(order as any)

    revalidatePath("/admin/orders")
    return serialize(order)
  } catch (error) {
    console.error("Error declining order:", error)
    throw error instanceof Error ? error : new Error("Failed to decline order")
  }
}

export async function getUserOrders() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) throw new Error("Please sign in to view your orders")

    await connectDB()
    const orders = await Order.find({userId: session.user.id})
      .sort({createdAt: -1})
      .populate("userId", "name email")
      .lean()

    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const orderItems = await OrderItem.find({orderId: order._id}).populate("productId", "name images sku").lean()

        return {
          ...order,
          items: orderItems.map((item) => ({
            productName: item.productName,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
          })),
        }
      })
    )

    return serialize({orders: ordersWithItems})
  } catch (error) {
    console.error("Error fetching user orders:", error)
    throw error instanceof Error ? error : new Error("Failed to fetch your orders")
  }
}
