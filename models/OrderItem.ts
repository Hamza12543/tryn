import mongoose, {Schema, Document} from "mongoose"

export interface IOrderItem extends Document {
  orderId: mongoose.Types.ObjectId
  // productId: mongoose.Types.ObjectId
  productId: string
  variantId?: mongoose.Types.ObjectId
  quantity: number
  unitPrice: number
  totalPrice: number
  productName: string
  productSku?: string
  color?: string
  size?: string
}

// const OrderItemSchema = new Schema<IOrderItem>(
//   {
//     orderId: {type: Schema.Types.ObjectId, ref: "Order", required: true},
//     productId: {type: Schema.Types.ObjectId, ref: "Product", required: true},
//     variantId: {type: Schema.Types.ObjectId, ref: "ProductVariant"},
//     quantity: {type: Number, required: true},
//     unitPrice: {type: Number, required: true},
//     totalPrice: {type: Number, required: true},
//     productName: {type: String, required: true},
//     productSku: {type: String},
//     color: {type: String},
//     size: {type: String},
//   },
//   {
//     timestamps: true,
//     collection: "orderItems",
//   }
// )

const OrderItemSchema = new Schema<IOrderItem>(
  {
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    productId: { type: String, required: true }, // 👈 change here
    variantId: { type: Schema.Types.ObjectId, ref: "ProductVariant" },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    productName: { type: String, required: true },
    productSku: { type: String },
    color: { type: String },
    size: { type: String },
  },
  {
    timestamps: true,
    collection: "orderItems",
  }
);


export default mongoose.models.OrderItem || mongoose.model<IOrderItem>("OrderItem", OrderItemSchema)
