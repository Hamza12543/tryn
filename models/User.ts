import mongoose, {Schema, Document} from "mongoose"

export interface IUser extends Document {
  name?: string
  email: string
  emailVerified?: Date
  image?: string
  password?: string
  firstName?: string
  lastName?: string
  phone?: string
  avatar?: string
  address?: {
    addressLine1?: string
    addressLine2?: string
    apartment?: string
    city?: string
    county?: string
    postcode?: string
    country?: string
    isDefault?: boolean
    addressType?: "HOME" | "WORK" | "BILLING" | "SHIPPING"
  }
  addresses?: Array<{
    addressLine1?: string
    addressLine2?: string
    apartment?: string
    city?: string
    county?: string
    postcode?: string
    country?: string
    isDefault?: boolean
    addressType?: "HOME" | "WORK" | "BILLING" | "SHIPPING"
  }>
  isActive: boolean
  role: "ADMIN" | "CUSTOMER" | "WHOLESALE"
  createdAt: Date
  updatedAt: Date
}

const AddressSchema = new Schema(
  {
    addressLine1: {type: String},
    addressLine2: {type: String},
    apartment: {type: String},
    city: {type: String},
    county: {type: String},
    postcode: {type: String},
    country: {type: String, default: "United Kingdom"},
    isDefault: {type: Boolean, default: false},
    addressType: {
      type: String,
      enum: ["HOME", "WORK", "BILLING", "SHIPPING"],
      default: "HOME",
    },
  },
  {_id: false}
)

const UserSchema = new Schema<IUser>(
  {
    name: {type: String},
    email: {type: String, required: true, unique: true},
    emailVerified: {type: Date},
    image: {type: String},
    password: {type: String},
    firstName: {type: String},
    lastName: {type: String},
    phone: {type: String},
    avatar: {type: String},
    address: AddressSchema,
    addresses: [AddressSchema],
    isActive: {type: Boolean, default: true},
    role: {
      type: String,
      enum: ["ADMIN", "CUSTOMER", "WHOLESALE"],
      default: "CUSTOMER",
    },
  },
  {
    timestamps: true,
    collection: "users",
  }
)

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema)
