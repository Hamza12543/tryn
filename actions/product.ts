"use server"

import {getServerSession} from "next-auth"
import {authOptions} from "@/lib/auth"
import {revalidatePath} from "next/cache"
import {productSchema, productUpdateSchema, type ProductFormData, type ProductUpdateData} from "@/validations/product"
import {parseFormData, parseBooleanFields, parseArrayFields} from "@/lib/form"
import {connectDB} from "@/lib/mongodb"
import Product from "@/models/Product"
import User from "@/models/User"

export type ProductActionState = {
  success?: boolean
  error?: string
  fieldErrors?: Record<string, string[]>
}

export async function getProducts(search?: string, status?: string, category?: string, featured?: boolean) {
  try {
    await connectDB()

    const filter: any = {}

    if (search) {
      filter.$or = [
        {name: {$regex: search, $options: "i"}},
        {category: {$regex: search, $options: "i"}},
        {sku: {$regex: search, $options: "i"}},
      ]
    }

    if (status && status !== "all") {
      filter.status = status
    }

    if (category && category !== "all") {
      filter.category = category
    }

    if (typeof featured === "boolean") {
      filter.isFeatured = featured
    }

    const products = await Product.find(filter)
      .select("name category actualPrice discountedPrice stock status images slug colors isFeatured")
      .sort({createdAt: -1})
      .lean()

    return products
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}

export async function getProduct(productId: string) {
  try {
    await connectDB()
    const product = await Product.findById(productId)
    return product
  } catch (error) {
    console.error("Error fetching product:", error)
    return null
  }
}

export async function getProductBySlug(slug: string) {
  try {
    await connectDB()
    const product = await Product.findOne({slug})
    return product
  } catch (error) {
    console.error("Error fetching product by slug:", error)
    return null
  }
}

export async function createProduct(prevState: ProductActionState, formData: FormData): Promise<ProductActionState> {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return {error: "Please sign in to create products"}
    }

    await connectDB()

    // Check if user is admin
    const user = await User.findById(session.user.id)
    if (!user || user.role !== "ADMIN") {
      return {error: "You do not have permission to create products"}
    }

    const rawData = parseFormData(formData)

    // Parse boolean fields
    const booleanFields = ["isActive", "isFeatured", "hasDiscount", "freeShipping", "inStock", "allowReviews"]
    const dataWithBooleans = parseBooleanFields(rawData, booleanFields)

    // Parse array fields
    const arrayFields = ["colors", "sizes", "features", "specifications", "images", "bannerImages"]
    const dataWithArrays = parseArrayFields(dataWithBooleans, arrayFields)

    const validatedData = productSchema.parse(dataWithArrays)

    // Convert string values to numbers for numeric fields
    const productData = {
      ...validatedData,
      actualPrice: parseFloat(validatedData.actualPrice),
      discountedPrice: validatedData.discountedPrice ? parseFloat(validatedData.discountedPrice) : undefined,
      stock: parseInt(validatedData.stock),
      minOrderQuantity: parseInt(validatedData.minOrderQuantity),
      maxOrderQuantity: parseInt(validatedData.maxOrderQuantity),
      weight: validatedData.weight ? parseFloat(validatedData.weight) : undefined,
      dimensions: validatedData.dimensions
        ? {
            length: validatedData.dimensions.length ? parseFloat(validatedData.dimensions.length) : undefined,
            width: validatedData.dimensions.width ? parseFloat(validatedData.dimensions.width) : undefined,
            height: validatedData.dimensions.height ? parseFloat(validatedData.dimensions.height) : undefined,
          }
        : undefined,
      slug:
        validatedData.slug ||
        validatedData.name
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, ""),
    }

    const product = new Product(productData)

    await product.save()

    revalidatePath("/admin/products")
    return {success: true}
  } catch (error) {
    if (error instanceof Error) {
      return {error: error.message}
    }
    return {error: "Something went wrong"}
  }
}

export async function updateProduct(
  productId: string,
  prevState: ProductActionState,
  formData: FormData
): Promise<ProductActionState> {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return {error: "Please sign in to update products"}
    }

    await connectDB()

    // Check if user is admin
    const user = await User.findById(session.user.id)
    if (!user || user.role !== "ADMIN") {
      return {error: "You do not have permission to update products"}
    }

    const rawData = parseFormData(formData)

    // Parse boolean fields
    const booleanFields = ["isActive", "isFeatured", "hasDiscount", "freeShipping", "inStock", "allowReviews"]
    const dataWithBooleans = parseBooleanFields(rawData, booleanFields)

    // Parse array fields
    const arrayFields = ["colors", "sizes", "features", "specifications", "images", "bannerImages"]
    const dataWithArrays = parseArrayFields(dataWithBooleans, arrayFields)

    const validatedData = productUpdateSchema.parse(dataWithArrays)

    // Convert string values to numbers for numeric fields
    const updateData = {
      ...validatedData,
      actualPrice: validatedData.actualPrice ? parseFloat(validatedData.actualPrice) : undefined,
      discountedPrice: validatedData.discountedPrice ? parseFloat(validatedData.discountedPrice) : undefined,
      stock: validatedData.stock ? parseInt(validatedData.stock) : undefined,
      minOrderQuantity: validatedData.minOrderQuantity ? parseInt(validatedData.minOrderQuantity) : undefined,
      maxOrderQuantity: validatedData.maxOrderQuantity ? parseInt(validatedData.maxOrderQuantity) : undefined,
      weight: validatedData.weight ? parseFloat(validatedData.weight) : undefined,
      dimensions: validatedData.dimensions
        ? {
            length: validatedData.dimensions.length ? parseFloat(validatedData.dimensions.length) : undefined,
            width: validatedData.dimensions.width ? parseFloat(validatedData.dimensions.width) : undefined,
            height: validatedData.dimensions.height ? parseFloat(validatedData.dimensions.height) : undefined,
          }
        : undefined,
    }

    const product = await Product.findByIdAndUpdate(productId, updateData, {new: true})

    if (!product) {
      return {error: "Product not found"}
    }

    revalidatePath("/admin/products")
    revalidatePath(`/admin/products/${productId}`)
    return {success: true}
  } catch (error) {
    if (error instanceof Error) {
      return {error: error.message}
    }
    return {error: "Something went wrong"}
  }
}

export async function deleteProduct(productId: string, prevState: ProductActionState): Promise<ProductActionState> {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return {error: "Please sign in to delete products"}
    }

    await connectDB()

    // Check if user is admin
    const user = await User.findById(session.user.id)
    if (!user || user.role !== "ADMIN") {
      return {error: "You do not have permission to delete products"}
    }

    const product = await Product.findByIdAndDelete(productId)

    if (!product) {
      return {error: "Product not found"}
    }

    revalidatePath("/admin/products")
    return {success: true}
  } catch (error) {
    if (error instanceof Error) {
      return {error: error.message}
    }
    return {error: "Something went wrong"}
  }
}

export async function toggleProductStatus(
  productId: string,
  status: "active" | "inactive",
  prevState: ProductActionState
): Promise<ProductActionState> {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return {error: "Please sign in to update product status"}
    }

    await connectDB()

    // Check if user is admin
    const user = await User.findById(session.user.id)
    if (!user || user.role !== "ADMIN") {
      return {error: "You do not have permission to update product status"}
    }

    const product = await Product.findByIdAndUpdate(productId, {isActive: status === "active"}, {new: true})

    if (!product) {
      return {error: "Product not found"}
    }

    revalidatePath("/admin/products")
    return {success: true}
  } catch (error) {
    if (error instanceof Error) {
      return {error: error.message}
    }
    return {error: "Something went wrong"}
  }
}

export async function updateProductStatus(
  productId: string,
  status: "draft" | "active" | "out_of_stock",
  prevState: ProductActionState
): Promise<ProductActionState> {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return {error: "Please sign in to update product status"}
    }

    await connectDB()

    // Check if user is admin
    const user = await User.findById(session.user.id)
    if (!user || user.role !== "ADMIN") {
      return {error: "You do not have permission to update product status"}
    }

    const product = await Product.findByIdAndUpdate(
      productId,
      {
        status,
        inStock: status === "active",
      },
      {new: true}
    )

    if (!product) {
      return {error: "Product not found"}
    }

    revalidatePath("/admin/products")
    return {success: true}
  } catch (error) {
    if (error instanceof Error) {
      return {error: error.message}
    }
    return {error: "Something went wrong"}
  }
}
