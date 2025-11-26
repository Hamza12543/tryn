// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/mongodb";
// import Order from "@/models/Order";
// import OrderItem from "@/models/OrderItem";

// export async function GET(
//   req: Request,
//   { params }: { params: { sessionId: string } }
// ) {
//   try {
//     await connectDB();

//     const order = await Order.findOne({ stripeSessionId: params.sessionId }).lean();
//     if (!order) {
//       return NextResponse.json({ error: "Order not found" }, { status: 404 });
//     }

//     const items = await OrderItem.find({ orderId: order._id }).lean();

//     return NextResponse.json({
//       order: {
//         ...order,
//         items,
//       },
//     });
//   } catch (err: any) {
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }


// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/mongodb";
// import Order from "@/models/Order";
// import OrderItem from "@/models/OrderItem";
// import { Types } from "mongoose";

// // Define interfaces for better type safety
// interface OrderDocument {
//   _id: Types.ObjectId;
//   userId?: Types.ObjectId | null;
//   stripeSessionId: string;
//   [key: string]: any;
// }

// interface OrderItemDocument {
//   _id: Types.ObjectId;
//   orderId: Types.ObjectId;
//   productId: Types.ObjectId;
//   [key: string]: any;
// }

// export async function GET(
//   request: Request,
//   { params }: { params: { sessionId: string } }
// ) {
//   try {
//     await connectDB();
//     console.log("Looking for order with sessionId:", params.sessionId);

//     const order = await Order.findOne({ 
//       stripeSessionId: params.sessionId 
//     }).lean() as OrderDocument | null;
    
//     if (!order) {
//       console.log("Order not found for sessionId:", params.sessionId);
//       return NextResponse.json({ error: "Order not found" }, { status: 404 });
//     }

//     console.log("Order found:", order._id);
//     const items = await OrderItem.find({
//       orderId: order._id
//     }).lean() as unknown as OrderItemDocument[];

//     // Convert ObjectIds to strings for JSON serialization
//     const responseOrder = {
//       ...order,
//       _id: order._id.toString(),
//       userId: order.userId ? order.userId.toString() : null,
//       items: items.map(item => ({
//         ...item,
//         _id: item._id.toString(),
//         orderId: item.orderId.toString(),
//         productId: item.productId.toString(),
//       })),
//     };

//     return NextResponse.json({
//       order: responseOrder
//     });
//   } catch (err: any) {
//     console.error("Error fetching order:", err);
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import OrderItem from "@/models/OrderItem";
import { Types } from "mongoose";
export const runtime = "nodejs";
// Define interfaces for better type safety
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
  { params }: { params: { sessionId: string } } // params is now a Promise
) {
  try {
    // Await the params to get the actual values
    const { sessionId } = params;
    console.log("API HIT:", params)
    await connectDB();
    console.log("Looking for order with sessionId:", sessionId);

    const order = await Order.findOne({ 
      stripeSessionId: sessionId 
    }).lean() as OrderDocument | null;
    
    if (!order) {
      console.log("Order not found for sessionId:", sessionId);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    console.log("Order found:", order._id);
    const items = await OrderItem.find({
      orderId: order._id
    }).lean() as unknown as OrderItemDocument[];

    // Convert ObjectIds to strings for JSON serialization
    const responseOrder = {
      ...order,
      _id: order._id.toString(),
      userId: order.userId ? order.userId.toString() : null,
      items: items.map(item => ({
        ...item,
        _id: item._id.toString(),
        orderId: item.orderId.toString(),
        productId: item.productId.toString(),
      })),
    };

    return NextResponse.json({
      order: responseOrder
    });
  } catch (err: any) {
    console.error("Error fetching order:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

