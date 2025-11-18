import mongoose, {Schema, Document} from "mongoose"

export interface IProductImage extends Document {
  productId: mongoose.Types.ObjectId
  url: string
  alt?: string
  isPrimary: boolean
  order: number
}

const ProductImageSchema = new Schema<IProductImage>(
  {
    productId: {type: Schema.Types.ObjectId, ref: "Product", required: true},
    url: {type: String, required: true},
    alt: {type: String},
    isPrimary: {type: Boolean, default: false},
    order: {type: Number, default: 0},
  },
  {
    timestamps: true,
    collection: "productImages",
  }
)

export default mongoose.models.ProductImage || mongoose.model<IProductImage>("ProductImage", ProductImageSchema)
