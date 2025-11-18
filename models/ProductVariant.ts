import mongoose, {Schema, Document} from "mongoose"

export interface IProductVariant extends Document {
  productId: mongoose.Types.ObjectId
  colorId?: mongoose.Types.ObjectId
  sizeId?: mongoose.Types.ObjectId
  sku?: string
  price?: number
  stock: number
  isActive: boolean
}

const ProductVariantSchema = new Schema<IProductVariant>(
  {
    productId: {type: Schema.Types.ObjectId, ref: "Product", required: true},
    colorId: {type: Schema.Types.ObjectId, ref: "ProductColor"},
    sizeId: {type: Schema.Types.ObjectId, ref: "ProductSize"},
    sku: {type: String, unique: true},
    price: {type: Number},
    stock: {type: Number, default: 0},
    isActive: {type: Boolean, default: true},
  },
  {
    timestamps: true,
    collection: "productVariants",
  }
)

export default mongoose.models.ProductVariant || mongoose.model<IProductVariant>("ProductVariant", ProductVariantSchema)
