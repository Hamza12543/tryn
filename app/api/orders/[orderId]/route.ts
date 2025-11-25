import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Order from "@/models/Order"
import OrderItem from "@/models/OrderItem"
import { Types } from "mongoose"

interface OrderDocument {
  _id: Types.ObjectId
  userId?: Types.ObjectId | null
  [key: string]: any
}

interface OrderItemDocument {
  _id: Types.ObjectId
  orderId: Types.ObjectId
  productId: string
  [key: string]: any
}

export async function GET(
  request: Request,
  context: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await context.params
    await connectDB()

    const order = (await Order.findById(orderId).lean()) as OrderDocument | null
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    const items = (await OrderItem.find({ orderId: order._id }).lean()) as unknown as OrderItemDocument[]

    const responseOrder = {
      ...order,
      _id: order._id.toString(),
      userId: order.userId ? order.userId.toString() : null,
      items: items.map((item) => ({
        ...item,
        _id: item._id.toString(),
        orderId: item.orderId.toString(),
      })),
    }

    return NextResponse.json({ order: responseOrder })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

