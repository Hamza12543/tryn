import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import OrderItem from "@/models/OrderItem";
import { Types } from "mongoose";
export const runtime = "nodejs";
interface OrderDocument {
  _id: Types.ObjectId;
  userId?: Types.ObjectId | null;
  stripeSessionId: string;
  [key: string]: any;
}
interface OrderItemDocument {
  _id: Types.ObjectId;
  orderId: Types.ObjectId;
  productId: Types.ObjectId;
  [key: string]: any;
}
export async function GET(
  request: Request,
  // 1. Params is now a Promise in Next.js 15
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    await connectDB();
    // 2. Await the params before using them
    const { sessionId } = await params;
    const order = await Order.findOne({
      stripeSessionId: sessionId,
    }).lean() as OrderDocument | null;
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    const items = await OrderItem.find({
      orderId: order._id,
    }).lean() as unknown as OrderItemDocument[];
    return NextResponse.json({
      order: {
        ...order,
        _id: order._id.toString(),
        items: items.map(item => ({
          ...item,
          _id: item._id.toString(),
          orderId: item.orderId.toString(),
          productId: item.productId.toString(),
        })),
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}