import mongoose, {Schema, Document} from "mongoose"

export interface IAddress extends Document {
  userId: mongoose.Types.ObjectId
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

const AddressSchema = new Schema<IAddress>(
  {
    userId: {type: Schema.Types.ObjectId, ref: "User", required: true, unique: true},
    street: {type: String, required: true},
    city: {type: String, required: true},
    state: {type: String, required: true},
    zipCode: {type: String, required: true},
    country: {type: String, default: "United States"},
  },
  {
    timestamps: true,
    collection: "addresses",
  }
)

export default mongoose.models.Address || mongoose.model<IAddress>("Address", AddressSchema)
