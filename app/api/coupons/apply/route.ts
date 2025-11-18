// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/mongodb";
// import Coupon from "@/models/Coupon";

// export async function POST(req: Request) {
//   try {
//     await connectDB();
//     const { code, cartTotal } = await req.json();

//     if (!code || !cartTotal) {
//       return NextResponse.json(
//         { success: false, message: "Coupon code and cart total required" },
//         { status: 400 }
//       );
//     }

//     const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

//     if (!coupon) {
//       return NextResponse.json({ success: false, message: "Invalid coupon" }, { status: 404 });
//     }

//     if (new Date(coupon.expiryDate) < new Date()) {
//       return NextResponse.json({ success: false, message: "Coupon expired" }, { status: 400 });
//     }

//     const discount = (cartTotal * coupon.discountValue) / 100;
//     const finalTotal = Math.max(cartTotal - discount, 0);

//     return NextResponse.json({
//       success: true,
//       discount,
//       finalTotal,
//       appliedCoupon: coupon.code,
//     });
//   } catch (err: any) {
//     return NextResponse.json(
//       { success: false, message: err.message },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Coupon from "@/models/Coupon";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { code, cartTotal } = await req.json();

    if (!code || !cartTotal) {
      return NextResponse.json(
        { success: false, message: "Coupon code and cart total required" },
        { status: 400 }
      );
    }

    // 1️⃣ Special case: SAVE10 (always available)
    if (code.toUpperCase() === "SAVE10") {
      if (cartTotal >= 30) {
        const discount = (cartTotal * 10) / 100; // 10% off
        const finalTotal = Math.max(cartTotal - discount, 0);

        return NextResponse.json({
          success: true,
          discount,
          finalTotal,
          appliedCoupon: "SAVE10",
          message: "10% off applied with SAVE10 🎉",
        });
      } else {
        return NextResponse.json(
          { success: false, message: "SAVE10 requires a minimum spend of £30" },
          { status: 400 }
        );
      }
    }

    // 2️⃣ Check DB coupons
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

    if (!coupon) {
      return NextResponse.json({ success: false, message: "Invalid coupon" }, { status: 404 });
    }

    if (new Date(coupon.expiryDate) < new Date()) {
      return NextResponse.json({ success: false, message: "Coupon expired" }, { status: 400 });
    }

    const discount = (cartTotal * coupon.discountValue) / 100;
    const finalTotal = Math.max(cartTotal - discount, 0);

    return NextResponse.json({
      success: true,
      discount,
      finalTotal,
      appliedCoupon: coupon.code,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

