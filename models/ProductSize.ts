import mongoose, {Schema, Document} from "mongoose"

export interface IProductSize extends Document {
  value: string
  label: string
  isActive: boolean
}

const ProductSizeSchema = new Schema<IProductSize>(
  {
    value: {type: String, required: true, unique: true},
    label: {type: String, required: true},
    isActive: {type: Boolean, default: true},
  },
  {
    timestamps: true,
    collection: "productSizes",
  }
)

export default mongoose.models.ProductSize || mongoose.model<IProductSize>("ProductSize", ProductSizeSchema)
