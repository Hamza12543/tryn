import {z} from "zod"

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required").max(255, "Product name must be less than 255 characters"),
  slug: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  actualPrice: z
    .string()
    .min(1, "Actual price is required")
    .regex(/^\d+(\.\d{1,2})?$/, "Invalid price format"),
  discountedPrice: z.string().optional(),
  stock: z.string().regex(/^\d+$/, "Stock must be a positive integer"),
  status: z.enum(["draft", "active", "out_of_stock"]),
  description: z.string().min(1, "Description is required"),
  shortDescription: z.string().optional(),
  sku: z.string().optional(),
  weight: z.string().optional(),
  dimensions: z.object({
    length: z.string().optional(),
    width: z.string().optional(),
    height: z.string().optional(),
  }),
  features: z.array(z.string()).optional(),
  specifications: z.array(z.string()).optional(),
  careInstructions: z.string().optional(),
  warranty: z.string().optional(),
  deliveryInfo: z.string().optional(),
  returnPolicy: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  hasDiscount: z.boolean(),
  freeShipping: z.boolean(),
  inStock: z.boolean(),
  allowReviews: z.boolean(),
  minOrderQuantity: z.string().regex(/^\d+$/, "Must be a positive integer"),
  maxOrderQuantity: z.string().regex(/^\d+$/, "Must be a positive integer"),
  colors: z.array(z.string()).optional(),
  sizes: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  bannerImages: z.array(z.string()).optional(),
})

export const productUpdateSchema = productSchema.partial()

export type ProductFormData = z.infer<typeof productSchema>
export type ProductUpdateData = z.infer<typeof productUpdateSchema>
