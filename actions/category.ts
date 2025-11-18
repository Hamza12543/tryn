"use server"

import {getServerSession} from "next-auth"
import {authOptions} from "@/lib/auth"
import {revalidatePath} from "next/cache"
import {
  categorySchema,
  categoryUpdateSchema,
  type CategoryFormData,
  type CategoryUpdateData,
} from "@/validations/category"
import {parseFormData} from "@/lib/form"
import {connectDB} from "@/lib/mongodb"
import Category from "@/models/Category"
import User from "@/models/User"

export type CategoryActionState = {
  success?: boolean
  error?: string
  fieldErrors?: Record<string, string[]>
}

export async function createCategory(prevState: CategoryActionState, formData: FormData): Promise<CategoryActionState> {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return {error: "Please sign in to create categories"}
    }

    await connectDB()

    // Check if user is admin
    const user = await User.findById(session.user.id)
    if (!user || user.role !== "ADMIN") {
      return {error: "You do not have permission to create categories"}
    }

    const rawData = parseFormData(formData)

    const validatedData = categorySchema.parse(rawData)

    // Generate slug if not provided
    const slug =
      validatedData.slug ||
      validatedData.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")

    // Check if category with same name or slug already exists
    const existingCategory = await Category.findOne({
      $or: [{name: {$regex: new RegExp(`^${validatedData.name}$`, "i")}}, {slug: slug}],
    })

    if (existingCategory) {
      return {error: "Category with this name or slug already exists"}
    }

    const categoryData = {
      ...validatedData,
      slug,
      description: validatedData.description || null,
    }

    const category = new Category(categoryData)
    await category.save()

    revalidatePath("/admin/categories")
    return {success: true}
  } catch (error) {
    if (error instanceof Error) {
      return {error: error.message}
    }
    return {error: "Something went wrong"}
  }
}

export async function updateCategory(
  categoryId: string,
  prevState: CategoryActionState,
  formData: FormData
): Promise<CategoryActionState> {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return {error: "Please sign in to update categories"}
    }

    await connectDB()

    // Check if user is admin
    const user = await User.findById(session.user.id)
    if (!user || user.role !== "ADMIN") {
      return {error: "You do not have permission to update categories"}
    }

    const rawData = parseFormData(formData)

    const validatedData = categoryUpdateSchema.parse(rawData)

    const existingCategory = await Category.findById(categoryId)

    if (!existingCategory) {
      return {error: "Category not found"}
    }

    // Generate slug if name is being updated and slug is not provided
    let slug = existingCategory.slug
    if (validatedData.name && !validatedData.slug) {
      slug = validatedData.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
    } else if (validatedData.slug) {
      slug = validatedData.slug
    }

    // Check if category with same name or slug already exists (excluding current category)
    const duplicateCategory = await Category.findOne({
      _id: {$ne: categoryId},
      $or: [{name: {$regex: new RegExp(`^${validatedData.name || existingCategory.name}$`, "i")}}, {slug: slug}],
    })

    if (duplicateCategory) {
      return {error: "Category with this name or slug already exists"}
    }

    const updateData = {
      ...validatedData,
      slug,
      description: validatedData.description || null,
    }

    const category = await Category.findByIdAndUpdate(categoryId, updateData, {new: true})

    if (!category) {
      return {error: "Category not found"}
    }

    revalidatePath("/admin/categories")
    return {success: true}
  } catch (error) {
    if (error instanceof Error) {
      return {error: error.message}
    }
    return {error: "Something went wrong"}
  }
}

export async function deleteCategory(categoryId: string, prevState: CategoryActionState): Promise<CategoryActionState> {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return {error: "Please sign in to delete categories"}
    }

    await connectDB()

    // Check if user is admin
    const user = await User.findById(session.user.id)
    if (!user || user.role !== "ADMIN") {
      return {error: "You do not have permission to delete categories"}
    }

    const category = await Category.findByIdAndDelete(categoryId)

    if (!category) {
      return {error: "Category not found"}
    }

    revalidatePath("/admin/categories")
    return {success: true}
  } catch (error) {
    if (error instanceof Error) {
      return {error: error.message}
    }
    return {error: "Something went wrong"}
  }
}

export async function getCategories() {
  try {
    await connectDB()
    const categories = await Category.find({}).sort({createdAt: -1})
    // Serialize MongoDB documents to plain objects
    return JSON.parse(JSON.stringify(categories))
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

export async function getCategory(categoryId: string) {
  try {
    await connectDB()
    const category = await Category.findById(categoryId)
    // Serialize MongoDB document to plain object
    return category ? JSON.parse(JSON.stringify(category)) : null
  } catch (error) {
    console.error("Error fetching category:", error)
    return null
  }
}
