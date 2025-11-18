import mongoose, {Schema, Document} from "mongoose"

export interface IWishlistItem extends Document {
  userId: mongoose.Types.ObjectId
  productId: mongoose.Types.ObjectId
}

const WishlistItemSchema = new Schema<IWishlistItem>(
  {
    userId: {type: Schema.Types.ObjectId, ref: "User", required: true},
    productId: {type: Schema.Types.ObjectId, ref: "Product", required: true},
  },
  {
    timestamps: true,
    collection: "wishlistItems",
  }
)

WishlistItemSchema.index({userId: 1, productId: 1}, {unique: true})

export default mongoose.models.WishlistItem || mongoose.model<IWishlistItem>("WishlistItem", WishlistItemSchema)
