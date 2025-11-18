import mongoose, {Schema, Document} from "mongoose"

export interface IReview extends Document {
  productId: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  orderId?: mongoose.Types.ObjectId
  rating: number
  title?: string
  comment?: string
  isApproved: boolean
  isVerified: boolean
}

const ReviewSchema = new Schema<IReview>(
  {
    productId: {type: Schema.Types.ObjectId, ref: "Product", required: true},
    userId: {type: Schema.Types.ObjectId, ref: "User", required: true},
    orderId: {type: Schema.Types.ObjectId, ref: "Order"},
    rating: {type: Number, required: true, min: 1, max: 5},
    title: {type: String},
    comment: {type: String},
    isApproved: {type: Boolean, default: false},
    isVerified: {type: Boolean, default: false},
  },
  {
    timestamps: true,
    collection: "reviews",
  }
)

ReviewSchema.index({productId: 1, userId: 1}, {unique: true})

export default mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema)
