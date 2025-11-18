// import {NextRequest, NextResponse} from "next/server"
// import {stripe} from "@/lib/stripe"
// import {connectDB} from "@/lib/mongodb"
// import Order from "@/models/Order"
// import OrderItem from "@/models/OrderItem"
// import {headers} from "next/headers"

// export async function POST(request: NextRequest) {
//   const body = await request.text()
//   const signature = (await headers()).get("stripe-signature")

//   if (!signature) {
//     return NextResponse.json({error: "No signature"}, {status: 400})
//   }

//   let event

//   try {
//     event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
//     // event = stripe.webhooks.constructEvent(body, signature, "whsec_bf05ca768bc8e3fb2919fb3497df03cb5e8e6c3c491d9cf60111f4d9a7430ca8")
//   } catch (err) {
//     console.error("Webhook signature verification failed:", err)
//     return NextResponse.json({error: "Invalid signature"}, {status: 400})
//   }

//   try {
//     await connectDB()

//     switch (event.type) {
//       case "checkout.session.completed": {
//         const session = event.data.object

//         // Create order in database
//         const orderData = {
//           orderNumber: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
//           userId: session.metadata?.userId,
//           status: "CONFIRMED",
//           totalAmount: session.amount_total ? session.amount_total / 100 : 0,
//           subtotal: session.amount_subtotal ? session.amount_subtotal / 100 : 0,
//           taxAmount: session.total_details?.amount_tax ? session.total_details.amount_tax / 100 : 0,
//           shippingAmount: session.total_details?.amount_shipping ? session.total_details.amount_shipping / 100 : 0,
//           discountAmount: session.total_details?.amount_discount ? session.total_details.amount_discount / 100 : 0,
//           customerEmail: session.customer_details?.email || "",
//           customerName: session.customer_details?.name || session.metadata?.customerName || "",
//           customerPhone: session.customer_details?.phone || "",
//           paymentStatus: "COMPLETED",
//           paymentMethod: "CREDIT_CARD",
//           transactionId: session.payment_intent as string,
//           stripeSessionId: session.id,
//           stripePaymentIntentId: session.payment_intent as string,
//           isWholesale: false,
//           shippingAddress: {
//             street: (session as any).shipping?.address?.line1 || "",
//             city: (session as any).shipping?.address?.city || "",
//             state: (session as any).shipping?.address?.state || "",
//             postalCode: (session as any).shipping?.address?.postal_code || "",
//             country: (session as any).shipping?.address?.country || "",
//           },
//         }

//         const order = new Order(orderData)
//         await order.save()

//         // Create order items
//         if (session.line_items?.data) {
//           const orderItems = session.line_items.data.map((item: any) => ({
//             orderId: order._id,
//             productId: item.price?.product as string,
//             quantity: item.quantity,
//             unitPrice: item.amount_unit ? item.amount_unit / 100 : 0,
//             totalPrice: item.amount_total ? item.amount_total / 100 : 0,
//             productName: item.description || "",
//           }))

//           await OrderItem.insertMany(orderItems)
//         }

//         console.log("Order created:", order.orderNumber)
//         break
//       }

//       case "payment_intent.payment_failed": {
//         const paymentIntent = event.data.object

//         // Update order status to failed
//         await Order.findOneAndUpdate(
//           {stripePaymentIntentId: paymentIntent.id},
//           {
//             paymentStatus: "FAILED",
//             status: "CANCELLED",
//           }
//         )

//         console.log("Payment failed for payment intent:", paymentIntent.id)
//         break
//       }

//       case "payment_intent.canceled": {
//         const paymentIntent = event.data.object

//         // Update order status to cancelled
//         await Order.findOneAndUpdate(
//           {stripePaymentIntentId: paymentIntent.id},
//           {
//             paymentStatus: "CANCELLED",
//             status: "CANCELLED",
//           }
//         )

//         console.log("Payment cancelled for payment intent:", paymentIntent.id)
//         break
//       }

//       default:
//         console.log(`Unhandled event type: ${event.type}`)
//     }

//     return NextResponse.json({received: true})
//   } catch (error) {
//     console.error("Webhook error:", error)
//     return NextResponse.json({error: "Webhook handler failed"}, {status: 500})
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import OrderItem from "@/models/OrderItem";
import { headers } from "next/headers";
import { sendOrderCreatedEmails, sendOrderStatusUpdateEmail } from "@/lib/emailService";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    await connectDB();

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as any;

        console.log("✅ Checkout session completed:", session.id);

        // fetch line items (Stripe does NOT include them in event)
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

        // get shipping safely
        const shipping = session.collected_information?.shipping_details;

        const orderData = {
          orderNumber: `ORD-${Date.now()}-${Math.random()
            .toString(36)
            .substr(2, 9)}`,
          userId: session.metadata?.userId === 'guest' ? null : session.metadata?.userId,
          isGuestOrder: session.metadata?.isGuestOrder === 'true',
          status: "CONFIRMED",
          totalAmount: (session.amount_total ?? 0) / 100,
          subtotal: (session.amount_subtotal ?? 0) / 100,
          taxAmount: session.total_details?.amount_tax
            ? session.total_details.amount_tax / 100
            : 0,
          shippingAmount: session.total_details?.amount_shipping
            ? session.total_details.amount_shipping / 100
            : 0,
          discountAmount: session.total_details?.amount_discount
            ? session.total_details.amount_discount / 100
            : 0,
          customerEmail: session.customer_details?.email ?? "",
          customerName:
            session.customer_details?.name ??
            session.metadata?.customerName ??
            "",
          customerPhone: session.customer_details?.phone ?? "",
          paymentStatus: "COMPLETED",
          paymentMethod: "CREDIT_CARD", // 👈 matches your schema
          transactionId: session.payment_intent as string,
          stripeSessionId: session.id,
          stripePaymentIntentId: session.payment_intent as string,
          isWholesale: false,
          shippingAddress: {
            street: shipping?.address?.line1 ?? "",
            city: shipping?.address?.city ?? "",
            state: shipping?.address?.state ?? "N/A", // 👈 fallback added
            postalCode: shipping?.address?.postal_code ?? "",
            country: shipping?.address?.country ?? "",
          },
        };

        console.log("🔎 Order data:", orderData);

        const order = new Order(orderData);
        await order.save();

        // Save order items
        if (lineItems?.data?.length) {
          const orderItems = lineItems.data.map((item: any) => ({
            orderId: order._id,
            productId: item.price?.product as string,
            quantity: item.quantity,
            unitPrice: (item.price?.unit_amount ?? 0) / 100,
            totalPrice: (item.amount_total ?? 0) / 100,
            productName: item.description ?? "",
          }));

          await OrderItem.insertMany(orderItems);
        }

        console.log("✅ Order saved:", order.orderNumber);
         await sendOrderCreatedEmails(order);
        break;
      }

      case "payment_intent.payment_failed": {
        const pi = event.data.object as any;
        await Order.findOneAndUpdate(
          { stripePaymentIntentId: pi.id },
          { paymentStatus: "FAILED", status: "CANCELLED" }
        );
        console.log("❌ Payment failed:", pi.id);
        break;
      }

      case "payment_intent.canceled": {
        const pi = event.data.object as any;
        await Order.findOneAndUpdate(
          { stripePaymentIntentId: pi.id },
          { paymentStatus: "CANCELLED", status: "CANCELLED" }
        );
        console.log("⚠️ Payment cancelled:", pi.id);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("❌ Webhook error:", error.message, error.stack);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
