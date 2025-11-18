import mongoose, {Schema, Document} from "mongoose"

export interface ICategory extends Document {
  name: string
  description?: string
  slug: string
  isActive: boolean
}

const CategorySchema = new Schema<ICategory>(
  {
    name: {type: String, required: true, unique: true},
    description: {type: String},
    slug: {type: String, required: true, unique: true},
    isActive: {type: Boolean, default: true},
  },
  {
    timestamps: true,
    collection: "categories",
  }
)

export default mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema)
