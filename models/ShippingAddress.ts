import mongoose, {Schema, Document} from "mongoose"

export interface IShippingAddress extends Document {
  orderId: mongoose.Types.ObjectId
  firstName: string
  lastName: string
  company?: string
  address1: string
  address2?: string
  city: string
  state: string
  zipCode: string
  country: string
  phone?: string
}

const ShippingAddressSchema = new Schema<IShippingAddress>(
  {
    orderId: {type: Schema.Types.ObjectId, ref: "Order", required: true, unique: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    company: {type: String},
    address1: {type: String, required: true},
    address2: {type: String},
    city: {type: String, required: true},
    state: {type: String, required: true},
    zipCode: {type: String, required: true},
    country: {type: String, default: "United States"},
    phone: {type: String},
  },
  {
    timestamps: true,
    collection: "shippingAddresses",
  }
)

export default mongoose.models.ShippingAddress ||
  mongoose.model<IShippingAddress>("ShippingAddress", ShippingAddressSchema)
