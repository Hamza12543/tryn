import mongoose, {Schema, Document} from "mongoose"

export interface IDimensions extends Document {
  productId: mongoose.Types.ObjectId
  length: number
  width: number
  height: number
}

const DimensionsSchema = new Schema<IDimensions>(
  {
    productId: {type: Schema.Types.ObjectId, ref: "Product", required: true, unique: true},
    length: {type: Number, required: true},
    width: {type: Number, required: true},
    height: {type: Number, required: true},
  },
  {
    timestamps: true,
    collection: "dimensions",
  }
)

export default mongoose.models.Dimensions || mongoose.model<IDimensions>("Dimensions", DimensionsSchema)
