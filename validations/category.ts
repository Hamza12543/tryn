import {z} from "zod"

export const categorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(255, "Category name must be less than 255 characters"),
  description: z.string().optional(),
  slug: z.string().optional(),
})

export const categoryUpdateSchema = categorySchema.partial()

export type CategoryFormData = z.infer<typeof categorySchema>
export type CategoryUpdateData = z.infer<typeof categoryUpdateSchema>
