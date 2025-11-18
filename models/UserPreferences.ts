import mongoose, {Schema, Document} from "mongoose"

export interface IUserPreferences extends Document {
  userId: mongoose.Types.ObjectId
  emailNotifications: boolean
  smsNotifications: boolean
  marketingEmails: boolean
  orderUpdates: boolean
  newProducts: boolean
}

const UserPreferencesSchema = new Schema<IUserPreferences>(
  {
    userId: {type: Schema.Types.ObjectId, ref: "User", required: true, unique: true},
    emailNotifications: {type: Boolean, default: true},
    smsNotifications: {type: Boolean, default: false},
    marketingEmails: {type: Boolean, default: true},
    orderUpdates: {type: Boolean, default: true},
    newProducts: {type: Boolean, default: false},
  },
  {
    timestamps: true,
    collection: "userPreferences",
  }
)

export default mongoose.models.UserPreferences ||
  mongoose.model<IUserPreferences>("UserPreferences", UserPreferencesSchema)
