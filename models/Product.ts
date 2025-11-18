import mongoose, {Schema, Document} from "mongoose"

export interface IProduct extends Document {
  name: string
  slug: string
  category: string
  shortDescription?: string
  description: string
  sku?: string
  actualPrice: number
  discountedPrice?: number
  hasDiscount: boolean
  freeShipping: boolean
  stock: number
  status: "draft" | "active" | "out_of_stock"
  inStock: boolean
  minOrderQuantity: number
  maxOrderQuantity: number
  weight?: number
  dimensions?: {
    length?: number
    width?: number
    height?: number
  }
  colors: string[]
  sizes: string[]
  features: string[]
  specifications: string[]
  careInstructions?: string
  warranty?: string
  deliveryInfo?: string
  returnPolicy?: string
  seoTitle?: string
  seoDescription?: string
  isActive: boolean
  isFeatured: boolean
  allowReviews: boolean
  images?: string[]
  bannerImages?: string[]
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {type: String, required: true},
    slug: {type: String, required: true, unique: true},
    category: {type: String, required: true},
    shortDescription: {type: String},
    description: {type: String, required: true},
    sku: {type: String, unique: true, sparse: true},
    actualPrice: {type: Number, required: true},
    discountedPrice: {type: Number},
    hasDiscount: {type: Boolean, default: false},
    freeShipping: {type: Boolean, default: false},
    stock: {type: Number, required: true},
    status: {
      type: String,
      enum: ["draft", "active", "out_of_stock"],
      default: "draft",
    },
    inStock: {type: Boolean, default: true},
    minOrderQuantity: {type: Number, default: 1},
    maxOrderQuantity: {type: Number, default: 100},
    weight: {type: Number},
    dimensions: {
      length: {type: Number},
      width: {type: Number},
      height: {type: Number},
    },
    colors: [{type: String}],
    sizes: [{type: String}],
    features: [{type: String}],
    specifications: [{type: String}],
    careInstructions: {type: String},
    warranty: {type: String},
    deliveryInfo: {type: String},
    returnPolicy: {type: String},
    seoTitle: {type: String},
    seoDescription: {type: String},
    isActive: {type: Boolean, default: true},
    isFeatured: {type: Boolean, default: false},
    allowReviews: {type: Boolean, default: true},
    images: [{type: String}],
    bannerImages: [{type: String}],
  },
  {
    timestamps: true,
    collection: "products",
  }
)

export default mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema)
