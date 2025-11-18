import mongoose, {Schema, Document} from "mongoose"

export interface IOrder extends Document {
  orderNumber: string
  userId: mongoose.Types.ObjectId | string
  isGuestOrder: boolean
  status: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED"
  totalAmount: number
  subtotal: number
  taxAmount: number
  shippingAmount: number
  discountAmount: number
  customerEmail: string
  customerName: string
  customerPhone?: string
  paymentStatus: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | "CANCELLED" | "REFUNDED"
  paymentMethod?: "CREDIT_CARD" | "DEBIT_CARD" | "PAYPAL" | "BANK_TRANSFER" | "CASH_ON_DELIVERY" | "WHOLESALE_ACCOUNT"
  transactionId?: string
  stripeSessionId?: string
  stripePaymentIntentId?: string
  notes?: string
  isWholesale: boolean
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
    shippedAt?: Date
  }
  adminNotes?: string
}

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: {type: String, required: true, unique: true},
    userId: {type: Schema.Types.ObjectId, ref: "User", required: false},
    isGuestOrder: {type: Boolean, default: false},
    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"],
      default: "PENDING",
    },
    totalAmount: {type: Number, required: true},
    subtotal: {type: Number, required: true},
    taxAmount: {type: Number, default: 0},
    shippingAmount: {type: Number, default: 0},
    discountAmount: {type: Number, default: 0},
    customerEmail: {type: String, required: true},
    customerName: {type: String, required: true},
    customerPhone: {type: String},
    paymentStatus: {
      type: String,
      enum: ["PENDING", "PROCESSING", "COMPLETED", "FAILED", "CANCELLED", "REFUNDED"],
      default: "PENDING",
    },
    paymentMethod: {
      type: String,
      enum: ["CREDIT_CARD", "DEBIT_CARD", "PAYPAL", "BANK_TRANSFER", "CASH_ON_DELIVERY", "WHOLESALE_ACCOUNT"],
    },
    transactionId: {type: String},
    stripeSessionId: {type: String},
    stripePaymentIntentId: {type: String},
    notes: {type: String},
    isWholesale: {type: Boolean, default: false},
    shippingAddress: {
      street: {type: String, required: true},
      city: {type: String, required: true},
      state: {type: String, required: true},
      postalCode: {type: String, required: true},
      country: {type: String, required: true},
    },
    trackingInfo: {
      courierName: {type: String},
      trackingNumber: {type: String},
      trackingUrl: {type: String},
      shippedAt: {type: Date},
    },
    adminNotes: {type: String},
  },
  {
    timestamps: true,
    collection: "orders",
  }
)

export default mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema)
