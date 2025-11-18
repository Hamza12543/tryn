import mongoose, {Schema, Document} from "mongoose"

export interface IPayment extends Document {
  orderId: mongoose.Types.ObjectId
  amount: number
  method: "CREDIT_CARD" | "DEBIT_CARD" | "PAYPAL" | "BANK_TRANSFER" | "CASH_ON_DELIVERY" | "WHOLESALE_ACCOUNT"
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | "CANCELLED" | "REFUNDED"
  transactionId?: string
  gateway?: string
  gatewayData?: string
}

const PaymentSchema = new Schema<IPayment>(
  {
    orderId: {type: Schema.Types.ObjectId, ref: "Order", required: true},
    amount: {type: Number, required: true},
    method: {
      type: String,
      enum: ["CREDIT_CARD", "DEBIT_CARD", "PAYPAL", "BANK_TRANSFER", "CASH_ON_DELIVERY", "WHOLESALE_ACCOUNT"],
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "PROCESSING", "COMPLETED", "FAILED", "CANCELLED", "REFUNDED"],
      default: "PENDING",
    },
    transactionId: {type: String},
    gateway: {type: String},
    gatewayData: {type: String},
  },
  {
    timestamps: true,
    collection: "payments",
  }
)

export default mongoose.models.Payment || mongoose.model<IPayment>("Payment", PaymentSchema)
