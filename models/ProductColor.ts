import mongoose, {Schema, Document} from "mongoose"

export interface IProductColor extends Document {
  name: string
  hexCode: string
  isActive: boolean
}

const ProductColorSchema = new Schema<IProductColor>(
  {
    name: {type: String, required: true, unique: true},
    hexCode: {type: String, required: true},
    isActive: {type: Boolean, default: true},
  },
  {
    timestamps: true,
    collection: "productColors",
  }
)

export default mongoose.models.ProductColor || mongoose.model<IProductColor>("ProductColor", ProductColorSchema)
