"use client"

import {useActionState, useEffect, useState} from "react"
import Image from "next/image"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Textarea} from "@/components/ui/textarea"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Switch} from "@/components/ui/switch"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {Separator} from "@/components/ui/separator"
import {ArrowLeft, Plus, X, Upload} from "lucide-react"
import Link from "next/link"
import {createProduct, type ProductActionState} from "@/actions/product"
import {getCategories} from "@/actions/category"
import {toast} from "sonner"
import {useProductFormStore} from "@/store/product-form-store"

interface Category {
  _id: string
  name: string
  slug: string
  isActive: boolean
}

export default function AddProductPage() {
  const [state, formAction, isPending] = useActionState(createProduct, {
    success: false,
    error: undefined,
    fieldErrors: undefined,
  } as ProductActionState)

  // Zustand store
  const {
    // Basic Info
    name,
    slug,
    sku,
    shortDescription,
    description,
    stock,
    selectedCategory,
    // Pricing
    actualPrice,
    discountedPrice,
    hasDiscount,
    // Images
    productImages,
    bannerImages,
    // Variants
    selectedColors,
    selectedSizes,
    customColors,
    customSizes,
    customColorInput,
    customSizeInput,
    // Details
    weight,
    length,
    width,
    careInstructions,
    warranty,
    deliveryInfo,
    returnPolicy,
    features,
    specifications,
    // SEO
    seoTitle,
    seoDescription,
    // Settings
    isActive,
    isFeatured,
    freeShipping,
    inStock,
    allowReviews,
    // Tab navigation
    currentTab,
    // Actions
    setField,
    setCurrentTab,
    addFeature,
    removeFeature,
    updateFeature,
    addSpecification,
    removeSpecification,
    updateSpecification,
    addCustomColor,
    removeCustomColor,
    addCustomSize,
    removeCustomSize,
    toggleColor,
    toggleSize,
    setCustomColorInput,
    setCustomSizeInput,
  } = useProductFormStore()

  const [categories, setCategories] = useState<Category[]>([])

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories()
        setCategories(data)
      } catch (error) {
        console.error("Error fetching categories:", error)
      }
    }
    fetchCategories()
  }, [])

  // Handle form state changes
  useEffect(() => {
    if (state.success) {
      toast.success("Product created successfully!")
      // Redirect to products page after a short delay
      setTimeout(() => {
        window.location.href = "/admin/products"
      }, 1500)
    }
    if (state.error) {
      toast.error(state.error)
    }
  }, [state])

  const colorOptions = [
    {name: "midnight", color: "bg-slate-800", label: "Midnight"},
    {name: "black", color: "bg-black", label: "Black"},
    {name: "purple", color: "bg-purple-400", label: "Purple"},
    {name: "dark", color: "bg-gray-900", label: "Dark"},
    {name: "light", color: "bg-gray-200", label: "Light"},
    {name: "white", color: "bg-white border border-gray-300", label: "White"},
    {name: "red", color: "bg-red-500", label: "Red"},
    {name: "blue", color: "bg-blue-500", label: "Blue"},
    {name: "green", color: "bg-green-500", label: "Green"},
    {name: "yellow", color: "bg-yellow-500", label: "Yellow"},
  ]

  const sizeOptions = [
    {value: "8pcs", label: "8pcs"},
    {value: "3sets", label: "3 Sets"},
    {value: "6pcs", label: "6pcs"},
    {value: "12pcs", label: "12pcs"},
    {value: "16pcs", label: "16pcs"},
    {value: "24pcs", label: "24pcs"},
  ]

  const tabs = [
    {id: "basic", label: "Basic Info"},
    {id: "pricing", label: "Pricing"},
    {id: "images", label: "Images"},
    {id: "variants", label: "Variants"},
    {id: "details", label: "Details"},
    {id: "seo", label: "SEO"},
  ]

  const calculateDiscountPercentage = () => {
    if (actualPrice && discountedPrice) {
      const actual = parseFloat(actualPrice)
      const discounted = parseFloat(discountedPrice)
      return (((actual - discounted) / actual) * 100).toFixed(0)
    }
    return ""
  }

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  }

  // Compress and resize image to reduce file size
  const compressImage = (
    file: File,
    maxWidth: number = 800,
    maxHeight: number = 800,
    quality: number = 0.7
  ): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      if (!ctx) {
        resolve(file) // Fallback if canvas context is not available
        return
      }

      const img = new window.Image()

      img.onload = () => {
        // Calculate new dimensions maintaining aspect ratio
        let {width, height} = img
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height
            height = maxHeight
          }
        }

        canvas.width = width
        canvas.height = height

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height)
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: "image/jpeg",
                lastModified: Date.now(),
              })
              resolve(compressedFile)
            } else {
              resolve(file) // Fallback to original if compression fails
            }
          },
          "image/jpeg",
          quality
        )
      }

      img.src = URL.createObjectURL(file)
    })
  }

  // Check if file size is within limits
  const isFileSizeValid = (file: File, maxSizeMB: number = 1): boolean => {
    return file.size <= maxSizeMB * 1024 * 1024
  }

  const handleProductImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newImages: string[] = []
      for (let i = 0; i < files.length; i++) {
        try {
          const file = files[i]

          // Check file size first - allow up to 5MB before compression
          if (!isFileSizeValid(file, 5)) {
            // Allow up to 5MB before compression
            toast.error(`Image ${file.name} is too large. Please select a smaller image.`)
            continue
          }

          // Compress image if it's large - compress if larger than 1MB
          let processedFile = file
          if (file.size > 1024 * 1024) {
            // If larger than 1MB, compress
            try {
              processedFile = await compressImage(file, 800, 800, 0.7) // Good quality and reasonable dimensions
            } catch (compressError) {
              console.error("Compression failed, using original file:", compressError)
              processedFile = file
            }
          }

          const base64 = await convertToBase64(processedFile)
          newImages.push(base64)
        } catch (error) {
          console.error("Error processing image:", error)
          toast.error(`Failed to process image ${files[i].name}`)
        }
      }
      if (newImages.length > 0) {
        setField("productImages", [...productImages, ...newImages])
        toast.success(`Added ${newImages.length} product image(s)`)
      }
    }
  }

  const handleBannerImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newImages: string[] = []
      for (let i = 0; i < files.length; i++) {
        try {
          const file = files[i]

          // Check file size first - allow up to 5MB before compression
          if (!isFileSizeValid(file, 5)) {
            // Allow up to 5MB before compression
            toast.error(`Banner image ${file.name} is too large. Please select a smaller image.`)
            continue
          }

          // Compress image if it's large - compress if larger than 1MB
          let processedFile = file
          if (file.size > 1024 * 1024) {
            // If larger than 1MB, compress
            try {
              processedFile = await compressImage(file, 1200, 300, 0.7) // Good quality and banner dimensions
            } catch (compressError) {
              console.error("Banner compression failed, using original file:", compressError)
              processedFile = file
            }
          }

          const base64 = await convertToBase64(processedFile)
          newImages.push(base64)
        } catch (error) {
          console.error("Error processing banner image:", error)
          toast.error(`Failed to process banner image ${files[i].name}`)
        }
      }
      if (newImages.length > 0) {
        setField("bannerImages", [...bannerImages, ...newImages])
        toast.success(`Added ${newImages.length} banner image(s)`)
      }
    }
  }

  const removeProductImage = (index: number) => {
    setField(
      "productImages",
      productImages.filter((_, i) => i !== index)
    )
  }

  const removeBannerImage = (index: number) => {
    setField(
      "bannerImages",
      bannerImages.filter((_, i) => i !== index)
    )
  }

  const nextTab = () => {
    const currentIndex = tabs.findIndex((tab) => tab.id === currentTab)
    if (currentIndex < tabs.length - 1) {
      // Validate current tab before proceeding
      if (currentTab === "basic") {
        if (!selectedCategory) {
          toast.error("Please select a category before proceeding")
          return
        }
        if (!name.trim()) {
          toast.error("Please enter a product name before proceeding")
          return
        }
        const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
        if (!slugRegex.test(slug)) {
          toast.error("Invalid slug: avoid spaces and double hyphens. Use lowercase letters, numbers, and single hyphens only.")
          return
        }
        if (!description.trim()) {
          toast.error("Please enter a product description before proceeding")
          return
        }
        if (!stock || parseFloat(stock) <= 0) {
          toast.error("Please enter a valid stock quantity before proceeding")
          return
        }
      }
      if (currentTab === "pricing") {
        if (!actualPrice || parseFloat(actualPrice) <= 0) {
          toast.error("Please enter a valid actual price before proceeding")
          return
        }
      }
      setCurrentTab(tabs[currentIndex + 1].id)
    }
  }

  const prevTab = () => {
    const currentIndex = tabs.findIndex((tab) => tab.id === currentTab)
    if (currentIndex > 0) {
      setCurrentTab(tabs[currentIndex - 1].id)
    }
  }

  const handleSubmit = async () => {
    // Check total payload size before submission
    const totalImages = productImages.length + bannerImages.length
    if (totalImages > 10) {
      toast.error("Too many images. Please reduce the number of images to 10 or fewer.")
      return
    }

    // Create FormData from state
    const submitFormData = new FormData()

    // Add all form fields
    submitFormData.append("name", name)
    submitFormData.append("slug", slug)
    submitFormData.append("sku", sku)
    submitFormData.append("shortDescription", shortDescription)
    submitFormData.append("description", description)
    submitFormData.append("stock", stock)
    submitFormData.append("category", selectedCategory) // Add category field
    submitFormData.append("status", "active") // Add status field
    submitFormData.append("actualPrice", actualPrice)
    submitFormData.append("discountedPrice", discountedPrice)
    submitFormData.append("weight", weight)

    // Add dimensions as separate fields (backend expects dimensions.length, dimensions.width)
    submitFormData.append("dimensions.length", length)
    submitFormData.append("dimensions.width", width)
    submitFormData.append("dimensions.height", "") // Add height field (empty for now)

    submitFormData.append("careInstructions", careInstructions)
    submitFormData.append("warranty", warranty)
    submitFormData.append("deliveryInfo", deliveryInfo)
    submitFormData.append("returnPolicy", returnPolicy)
    submitFormData.append("seoTitle", seoTitle)
    submitFormData.append("seoDescription", seoDescription)

    // Add boolean fields as strings (backend will parse them)
    submitFormData.append("isActive", isActive.toString())
    submitFormData.append("isFeatured", isFeatured.toString())
    submitFormData.append("hasDiscount", (discountedPrice && discountedPrice.trim() !== "").toString()) // Auto-calculate based on discountedPrice
    submitFormData.append("freeShipping", freeShipping.toString())
    submitFormData.append("inStock", (parseFloat(stock) > 0).toString()) // Auto-calculate based on stock
    submitFormData.append("allowReviews", allowReviews.toString())

    // Add order quantity fields
    submitFormData.append("minOrderQuantity", "1")
    submitFormData.append("maxOrderQuantity", "100")

    // Add selected colors and sizes
    selectedColors.forEach((color) => {
      submitFormData.append("colors", color)
    })
    selectedSizes.forEach((size) => {
      submitFormData.append("sizes", size)
    })

    // Add product images
    productImages.forEach((image) => {
      submitFormData.append("images", image)
    })

    // Add banner images
    bannerImages.forEach((image) => {
      submitFormData.append("bannerImages", image)
    })

    // Add features and specifications
    features.forEach((feature) => {
      if (feature.trim()) {
        submitFormData.append("features", feature)
      }
    })
    specifications.forEach((spec) => {
      if (spec.trim()) {
        submitFormData.append("specifications", spec)
      }
    })

    // Call the form action
    formAction(submitFormData)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/products">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Add New Product</h1>
            <p className="text-muted-foreground">Create a new product with all details and specifications.</p>
          </div>
        </div>
      </div>

      <form>
        {/* Progress indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {tabs.findIndex((tab) => tab.id === currentTab) + 1} of {tabs.length}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(((tabs.findIndex((tab) => tab.id === currentTab) + 1) / tabs.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((tabs.findIndex((tab) => tab.id === currentTab) + 1) / tabs.length) * 100}%`,
              }}></div>
          </div>
        </div>

        <Tabs value={currentTab} className="space-y-6">
          <div className="px-6">
            <TabsList className="grid w-full grid-cols-6">
              {tabs.map((tab) => (
                <TabsTrigger key={tab.id} value={tab.id} disabled={true} className="cursor-not-allowed opacity-60">
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="basic" className="space-y-6 px-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="mb-2 block">
                      Product Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Enter product name"
                      required
                      value={name}
                      onChange={(e) => setField("name", e.target.value)}
                    />
                    {state.fieldErrors?.name && (
                      <p className="text-sm text-red-500 mt-1">{state.fieldErrors.name[0]}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="slug" className="mb-2 block">
                      Product Slug
                    </Label>
                    <Input
                      id="slug"
                      name="slug"
                      placeholder="product-slug"
                      value={slug}
                      onChange={(e) => setField("slug", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="category" className="mb-2 block">
                      Category <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      name="category"
                      value={selectedCategory}
                      onValueChange={(value) => setField("selectedCategory", value)}
                      required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category._id} value={category.slug}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {!selectedCategory && <p className="text-sm text-red-500 mt-1">Please select a category</p>}
                    {state.fieldErrors?.category && (
                      <p className="text-sm text-red-500 mt-1">{state.fieldErrors.category[0]}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="sku" className="mb-2 block">
                      SKU
                    </Label>
                    <Input
                      id="sku"
                      name="sku"
                      placeholder="Stock Keeping Unit"
                      value={sku}
                      onChange={(e) => setField("sku", e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="shortDescription" className="mb-2 block">
                    Short Description
                  </Label>
                  <Textarea
                    id="shortDescription"
                    name="shortDescription"
                    placeholder="Brief description for product listings"
                    rows={3}
                    value={shortDescription}
                    onChange={(e) => setField("shortDescription", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="mb-2 block">
                    Full Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Detailed product description"
                    rows={6}
                    required
                    value={description}
                    onChange={(e) => setField("description", e.target.value)}
                  />
                  {state.fieldErrors?.description && (
                    <p className="text-sm text-red-500 mt-1">{state.fieldErrors.description[0]}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="stock" className="mb-2 block">
                      Stock Quantity <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="stock"
                      name="stock"
                      type="number"
                      placeholder="0"
                      required
                      value={stock}
                      onChange={(e) => setField("stock", e.target.value)}
                    />
                    {state.fieldErrors?.stock && (
                      <p className="text-sm text-red-500 mt-1">{state.fieldErrors.stock[0]}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="status" className="mb-2 block">
                      Status
                    </Label>
                    <Select name="status" defaultValue="draft">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pricing" className="space-y-6 px-6">
            <Card>
              <CardHeader>
                <CardTitle>Pricing Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="actualPrice" className="mb-2 block">
                      Actual Price <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="actualPrice"
                      name="actualPrice"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      required
                      value={actualPrice}
                      onChange={(e) => setField("actualPrice", e.target.value)}
                    />
                    {state.fieldErrors?.actualPrice && (
                      <p className="text-sm text-red-500 mt-1">{state.fieldErrors.actualPrice[0]}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="discountedPrice" className="mb-2 block">
                      Discounted Price
                    </Label>
                    <Input
                      id="discountedPrice"
                      name="discountedPrice"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={discountedPrice}
                      onChange={(e) => setField("discountedPrice", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="mb-2 block">Discount Percentage</Label>
                    <Input
                      id="discountPercentage"
                      placeholder="Auto calculated"
                      disabled
                      value={calculateDiscountPercentage()}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="hasDiscount"
                    name="hasDiscount"
                    checked={hasDiscount}
                    onCheckedChange={(checked) => setField("hasDiscount", checked)}
                  />
                  <Label htmlFor="hasDiscount" className="mb-2 block">
                    Enable discount
                  </Label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="minOrderQuantity" className="mb-2 block">
                      Minimum Order Quantity
                    </Label>
                    <Input
                      id="minOrderQuantity"
                      name="minOrderQuantity"
                      type="number"
                      placeholder="1"
                      defaultValue="1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxOrderQuantity" className="mb-2 block">
                      Maximum Order Quantity
                    </Label>
                    <Input
                      id="maxOrderQuantity"
                      name="maxOrderQuantity"
                      type="number"
                      placeholder="100"
                      defaultValue="100"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="images" className="space-y-6 px-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="mb-2 block">Product Images</Label>
                  <p className="text-sm text-gray-500 mb-3">
                    Upload product images (max 5MB each, will be compressed if larger than 1MB)
                  </p>
                  <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {productImages.map((image, index) => (
                      <div
                        key={index}
                        className="relative aspect-square border-2 border-gray-300 rounded-lg overflow-hidden">
                        <Image src={image} alt={`Product image ${index + 1}`} fill className="object-cover" />
                        <button
                          type="button"
                          onClick={() => removeProductImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    <div className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <input
                          type="file"
                          id="product-images"
                          multiple
                          accept="image/*"
                          onChange={handleProductImageUpload}
                          className="hidden"
                        />
                        <label htmlFor="product-images" className="cursor-pointer">
                          <Upload className="mx-auto h-8 w-8 text-gray-400" />
                          <p className="text-sm text-gray-500">Add Image</p>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <Label className="mb-2 block">Banner Images</Label>
                  <p className="text-sm text-gray-500 mb-3">
                    Upload banner images (max 5MB each, will be compressed if larger than 1MB)
                  </p>
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {bannerImages.map((image, index) => (
                      <div
                        key={index}
                        className="relative aspect-[4/1] border-2 border-gray-300 rounded-lg overflow-hidden">
                        <Image src={image} alt={`Banner image ${index + 1}`} fill className="object-cover" />
                        <button
                          type="button"
                          onClick={() => removeBannerImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    <div className="aspect-[4/1] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <input
                          type="file"
                          id="banner-images"
                          multiple
                          accept="image/*"
                          onChange={handleBannerImageUpload}
                          className="hidden"
                        />
                        <label htmlFor="banner-images" className="cursor-pointer">
                          <Upload className="mx-auto h-8 w-8 text-gray-400" />
                          <p className="text-sm text-gray-500">Add Banner</p>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="variants" className="space-y-6 px-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Variants</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-base font-medium mb-3 block">Available Colors</Label>
                  <div className="grid grid-cols-5 gap-3 mb-4">
                    {colorOptions
                      .concat(customColors.map((c) => ({name: c.name, color: c.color, label: c.name})))
                      .map((color, idx) => {
                        const isCustom = customColors.some((cc) => cc.name === color.name)
                        return (
                          <div key={color.name} className="text-center">
                            <button
                              type="button"
                              onClick={() => toggleColor(color.name)}
                              className={`w-12 h-12 rounded border-2 ${isCustom ? "" : color.color} ${selectedColors.includes(color.name) ? "border-gray-900" : "border-gray-300"}`}
                              {...(isCustom
                                ? {
                                    style: {
                                      backgroundColor: color.color,
                                      borderColor: selectedColors.includes(color.name) ? "#111" : "#d1d5db",
                                    },
                                  }
                                : {})}
                              title={color.label}
                            />
                            <p className="text-xs mt-1">{color.label}</p>
                            {isCustom && (
                              <button
                                type="button"
                                className="text-xs text-red-500"
                                onClick={() => removeCustomColor(idx - colorOptions.length)}>
                                Remove
                              </button>
                            )}
                          </div>
                        )
                      })}
                  </div>
                  <div className="flex gap-2 items-end mb-2">
                    <div>
                      <Label htmlFor="customColorName" className="mb-2 block">
                        Color Name
                      </Label>
                      <Input
                        id="customColorName"
                        value={customColorInput.name}
                        onChange={(e) => setCustomColorInput({name: e.target.value, color: customColorInput.color})}
                        placeholder="e.g. Orange"
                      />
                    </div>
                    <div>
                      <Label htmlFor="customColorCode" className="mb-2 block">
                        Color
                      </Label>
                      <Input
                        id="customColorCode"
                        type="color"
                        value={customColorInput.color}
                        onChange={(e) => setCustomColorInput({name: customColorInput.name, color: e.target.value})}
                        className="w-12 h-10 p-0"
                      />
                    </div>
                    <Button type="button" onClick={addCustomColor} className="mb-1">
                      Add Color
                    </Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <Label className="text-base font-medium mb-3 block">Available Sizes</Label>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-4">
                    {sizeOptions.concat(customSizes).map((size, idx) => (
                      <div key={size.value} className="flex flex-col items-center">
                        <button
                          type="button"
                          onClick={() => toggleSize(size.value)}
                          className={`px-3 py-2 rounded text-sm border ${selectedSizes.includes(size.value) ? "bg-black text-white border-black" : "border-gray-300 hover:border-gray-400"}`}>
                          {size.label}
                        </button>
                        {idx >= sizeOptions.length && (
                          <button
                            type="button"
                            className="text-xs text-red-500 mt-1"
                            onClick={() => removeCustomSize(idx - sizeOptions.length)}>
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 items-end mb-2">
                    <div>
                      <Label htmlFor="customSizeNumeric" className="mb-2 block">
                        Number
                      </Label>
                      <Input
                        type="number"
                        value={customSizeInput.numeric}
                        onChange={(e) => setCustomSizeInput({numeric: e.target.value, unit: customSizeInput.unit})}
                        placeholder="e.g. 69"
                      />
                    </div>
                    <div>
                      <Label htmlFor="customSizeUnit" className="mb-2 block">
                        Unit
                      </Label>
                      <Input
                        id="customSizeUnit"
                        value={customSizeInput.unit}
                        onChange={(e) => setCustomSizeInput({numeric: customSizeInput.numeric, unit: e.target.value})}
                        placeholder="e.g. pieces"
                      />
                    </div>
                    <Button type="button" onClick={addCustomSize}>
                      Add Size
                    </Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <Label className="text-base font-medium mb-3 block">Product Features</Label>
                  <div id="features-container">
                    {features.map((feature, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <Input
                          name="features"
                          placeholder="Enter product feature"
                          value={feature}
                          onChange={(e) => updateFeature(index, e.target.value)}
                        />
                        <Button type="button" variant="outline" size="sm" onClick={() => removeFeature(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={addFeature}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Feature
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="space-y-6 px-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="weight" className="mb-2 block">
                      Weight (kg)
                    </Label>
                    <Input
                      id="weight"
                      name="weight"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={weight}
                      onChange={(e) => setField("weight", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="length" className="mb-2 block">
                      Length (cm)
                    </Label>
                    <Input
                      id="length"
                      name="dimensions.length"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={length}
                      onChange={(e) => setField("length", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="width" className="mb-2 block">
                      Width (cm)
                    </Label>
                    <Input
                      id="width"
                      name="dimensions.width"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={width}
                      onChange={(e) => setField("width", e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="specifications" className="mb-2 block">
                    Specifications
                  </Label>
                  <div id="specifications-container">
                    {specifications.map((spec, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <Input
                          name="specifications"
                          placeholder="Enter specification"
                          value={spec}
                          onChange={(e) => updateSpecification(index, e.target.value)}
                        />
                        <Button type="button" variant="outline" size="sm" onClick={() => removeSpecification(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={addSpecification}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Specification
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="careInstructions" className="mb-2 block">
                    Care Instructions
                  </Label>
                  <Textarea
                    id="careInstructions"
                    name="careInstructions"
                    placeholder="How to care for this product"
                    rows={4}
                    value={careInstructions}
                    onChange={(e) => setField("careInstructions", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="warranty" className="mb-2 block">
                    Warranty Information
                  </Label>
                  <Input
                    id="warranty"
                    name="warranty"
                    placeholder="e.g., 4 year warranty against premature cracking"
                    value={warranty}
                    onChange={(e) => setField("warranty", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="deliveryInfo" className="mb-2 block">
                    Delivery Information
                  </Label>
                  <Textarea
                    id="deliveryInfo"
                    name="deliveryInfo"
                    placeholder="Delivery details and shipping information"
                    rows={3}
                    value={deliveryInfo}
                    onChange={(e) => setField("deliveryInfo", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="returnPolicy" className="mb-2 block">
                    Return Policy
                  </Label>
                  <Textarea
                    id="returnPolicy"
                    name="returnPolicy"
                    placeholder="Return policy details"
                    rows={3}
                    value={returnPolicy}
                    onChange={(e) => setField("returnPolicy", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seo" className="space-y-6 px-6">
            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="seoTitle" className="mb-2 block">
                    SEO Title
                  </Label>
                  <Input
                    id="seoTitle"
                    name="seoTitle"
                    placeholder="SEO optimized title"
                    value={seoTitle}
                    onChange={(e) => setField("seoTitle", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="seoDescription" className="mb-2 block">
                    SEO Description
                  </Label>
                  <Textarea
                    id="seoDescription"
                    name="seoDescription"
                    placeholder="SEO meta description"
                    rows={3}
                    value={seoDescription}
                    onChange={(e) => setField("seoDescription", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold text-gray-900">Product Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    name="isActive"
                    checked={isActive}
                    onCheckedChange={(checked) => setField("isActive", checked)}
                  />
                  <Label htmlFor="isActive" className="mb-2 block">
                    Active
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isFeatured"
                    name="isFeatured"
                    checked={isFeatured}
                    onCheckedChange={(checked) => setField("isFeatured", checked)}
                  />
                  <Label htmlFor="isFeatured" className="mb-2 block">
                    Featured
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="freeShipping"
                    name="freeShipping"
                    checked={freeShipping}
                    onCheckedChange={(checked) => setField("freeShipping", checked)}
                  />
                  <Label htmlFor="freeShipping" className="mb-2 block">
                    Free Shipping
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="inStock"
                    name="inStock"
                    checked={inStock}
                    onCheckedChange={(checked) => setField("inStock", checked)}
                  />
                  <Label htmlFor="inStock" className="mb-2 block">
                    In Stock
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="allowReviews"
                    name="allowReviews"
                    checked={allowReviews}
                    onCheckedChange={(checked) => setField("allowReviews", checked)}
                  />
                  <Label htmlFor="allowReviews" className="mb-2 block">
                    Allow Reviews
                  </Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Navigation buttons */}
        <div className="flex justify-between pt-6">
          <div>
            {currentTab !== "basic" && (
              <Button type="button" variant="outline" onClick={prevTab}>
                Previous
              </Button>
            )}
          </div>

          <div className="flex gap-4">
            <Link href="/admin/products">
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </Link>

            {currentTab === "seo" ? (
              <Button type="button" onClick={handleSubmit} disabled={isPending} className="min-w-[140px]">
                {isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating...
                  </div>
                ) : (
                  "Create Product"
                )}
              </Button>
            ) : (
              <Button type="button" onClick={nextTab}>
                Next
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}
