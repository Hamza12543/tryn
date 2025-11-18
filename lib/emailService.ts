import { sendEmail } from "./mailer";
import { IOrder } from "@/models/Order"; // ✅ use your mongoose interface
import { setTimeout as delay } from "timers/promises";

export async function sendOrderCreatedEmails(order: IOrder) {
  // To customer
  await sendEmail({
    to: order.customerEmail,
    subject: `Order Confirmation - ${order.orderNumber}`,
    html: `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Order Confirmation</title>
  </head>
  <body style="margin:0; padding:0; font-family: Arial, sans-serif; background:#f7f7f7;">

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f7f7f7; padding:20px 0;">
      <tr>
        <td align="center">

          <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 6px rgba(0,0,0,0.1);">
            
            <!-- Header -->
            <tr>
              <td style="background:#4CAF50; padding:20px; text-align:center; color:#fff; font-size:22px; font-weight:bold;">
                Thank you for your order!
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:30px; color:#333; font-size:16px; line-height:1.6;">
                <h2 style="margin-top:0; color:#4CAF50;">Hi ${order.customerName},</h2>
                <p>
                  We’re happy to let you know your order 
                  <b>#${order.orderNumber}</b> has been received.
                </p>

                <p style="margin:20px 0; font-size:18px;">
                  <strong>Total Amount:</strong> £${order.totalAmount.toFixed(2)}
                </p>

                <p>
                  We’ll notify you again once your order is processed.  
                  Thank you for shopping with us!
                </p>

                <!-- Call to action -->
                <p style="text-align:center; margin:30px 0;">
                  <a href="${process.env.NEXT_PUBLIC_APP_URL}/shop" 
                     style="background:#4CAF50; color:#fff; text-decoration:none; padding:12px 24px; border-radius:6px; font-size:16px;">
                     View Your Order
                  </a>
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#f0f0f0; padding:15px; text-align:center; font-size:12px; color:#666;">
                © ${new Date().getFullYear()} Your Store. All rights reserved.
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </body>
  </html>
  `,
  });

  await delay(10000);
  // To admin
  await sendEmail({
    to: process.env.ADMIN_EMAIL!,
    subject: `New Order - ${order.orderNumber}`,
    html: `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>New Order Notification</title>
  </head>
  <body style="margin:0; padding:0; font-family: Arial, sans-serif; background:#f7f7f7;">

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f7f7f7; padding:20px 0;">
      <tr>
        <td align="center">

          <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 6px rgba(0,0,0,0.1);">
            
            <!-- Header -->
            <tr>
              <td style="background:#1976D2; padding:20px; text-align:center; color:#fff; font-size:22px; font-weight:bold;">
                📦 New Order Received
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:30px; color:#333; font-size:16px; line-height:1.6;">
                <h2 style="margin-top:0; color:#1976D2;">Order #${order.orderNumber}</h2>

                <p><strong>Customer Name:</strong> ${order.customerName}</p>
                <p><strong>Customer Email:</strong> ${order.customerEmail}</p>
                <p><strong>Total Amount:</strong> £${order.totalAmount.toFixed(2)}</p>
                <p><strong>Status:</strong> ${order.status}</p>

                <!-- Optional CTA -->
                <p style="text-align:center; margin:30px 0;">
                  <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/orders/${order._id}" 
                     style="background:#1976D2; color:#fff; text-decoration:none; padding:12px 24px; border-radius:6px; font-size:16px;">
                     View Order in Dashboard
                  </a>
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#f0f0f0; padding:15px; text-align:center; font-size:12px; color:#666;">
                This is an automated notification. Do not reply.
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </body>
  </html>
  `,
  });
}

export async function sendOrderStatusUpdateEmail(order: IOrder) {
  await sendEmail({
    to: order.customerEmail,
    subject: `Your Order #${order.orderNumber} is now ${order.status}`,
    html: `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Order Status Update</title>
  </head>
  <body style="margin:0; padding:0; font-family: Arial, sans-serif; background:#f7f7f7;">

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f7f7f7; padding:20px 0;">
      <tr>
        <td align="center">

          <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 6px rgba(0,0,0,0.1);">
            
            <!-- Header -->
            <tr>
              <td style="background:#388E3C; padding:20px; text-align:center; color:#fff; font-size:22px; font-weight:bold;">
                🚚 Order Status Update
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:30px; color:#333; font-size:16px; line-height:1.6;">
                <h2 style="margin-top:0; color:#388E3C;">Hi ${order.customerName},</h2>

                <p>Your order <strong>#${order.orderNumber}</strong> has been updated to:</p>
                <p style="font-size:18px; font-weight:bold; color:#388E3C;">${order.status}</p>

                ${
                  order.trackingInfo
                    ? `
                      <div style="margin-top:20px; padding:15px; background:#f4f4f4; border-radius:6px;">
                        <p style="margin:0;"><strong>Courier:</strong> ${order.trackingInfo.courierName}</p>
                        <p style="margin:0;"><strong>Tracking Number:</strong> ${order.trackingInfo.trackingNumber}</p>
                        ${
                          order.trackingInfo.trackingUrl
                            ? `<p style="margin:10px 0 0;">
                                <a href="${order.trackingInfo.trackingUrl}" target="_blank" style="color:#388E3C; text-decoration:none; font-weight:bold;">
                                  Track Your Shipment
                                </a>
                               </p>`
                            : ""
                        }
                      </div>
                    `
                    : ""
                }

                <p style="margin-top:30px;">Thank you for shopping with us!</p>

                <!-- CTA -->
                <p style="text-align:center; margin:30px 0;">
                  <a href="${process.env.NEXT_PUBLIC_APP_URL}/orders/${order._id}" 
                     style="background:#388E3C; color:#fff; text-decoration:none; padding:12px 24px; border-radius:6px; font-size:16px;">
                     View Your Order
                  </a>
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#f0f0f0; padding:15px; text-align:center; font-size:12px; color:#666;">
                This is an automated update. Please do not reply.
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </body>
  </html>
  `,
  });
}
