"use client"

import {useState, useTransition} from "react"
import {useRouter, useSearchParams} from "next/navigation"
import Image from "next/image"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Badge} from "@/components/ui/badge"
import {Search, Filter, MoreHorizontal, Edit, Trash2, CheckCircle, XCircle} from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {updateProductStatus, deleteProduct} from "@/actions/product"
import {toast} from "sonner"

const statusColors = {
  active: "bg-green-100 text-green-800",
  out_of_stock: "bg-red-100 text-red-800",
  draft: "bg-gray-100 text-gray-800",
}

interface Product {
  _id: string
  name: string
  category: string
  actualPrice: number
  discountedPrice?: number
  stock: number
  status: "draft" | "active" | "out_of_stock"
  images?: string[]
  slug: string
}

interface Category {
  _id: string
  name: string
  slug: string
}

interface ProductsClientProps {
  products: Product[]
  categories: Category[]
  searchParams: {search?: string; status?: string; category?: string}
}

export function ProductsClient({products, categories, searchParams}: ProductsClientProps) {
  const router = useRouter()
  const searchParamsHook = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [search, setSearch] = useState(searchParams.search || "")
  const [statusFilter, setStatusFilter] = useState(searchParams.status || "all")
  const [categoryFilter, setCategoryFilter] = useState(searchParams.category || "all")

  const handleSearch = (value: string) => {
    setSearch(value)
    const params = new URLSearchParams(searchParamsHook)
    if (value) {
      params.set("search", value)
    } else {
      params.delete("search")
    }
    router.push(`/admin/products?${params.toString()}`)
  }

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value)
    const params = new URLSearchParams(searchParamsHook)
    if (value !== "all") {
      params.set("status", value)
    } else {
      params.delete("status")
    }
    router.push(`/admin/products?${params.toString()}`)
  }

  const handleCategoryFilter = (value: string) => {
    setCategoryFilter(value)
    const params = new URLSearchParams(searchParamsHook)
    if (value !== "all") {
      params.set("category", value)
    } else {
      params.delete("category")
    }
    router.push(`/admin/products?${params.toString()}`)
  }

  const handleStatusUpdate = (productId: string, status: "draft" | "active" | "out_of_stock") => {
    startTransition(async () => {
      const result = await updateProductStatus(productId, status, {})
      if (result.success) {
        toast.success("Product status updated successfully")
        router.refresh()
      } else {
        toast.error(result.error || "Failed to update product status")
      }
    })
  }

  const handleDelete = (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      startTransition(async () => {
        const result = await deleteProduct(productId, {})
        if (result.success) {
          toast.success("Product deleted successfully")
          router.refresh()
        } else {
          toast.error(result.error || "Failed to delete product")
        }
      })
    }
  }

  const getDisplayPrice = (product: Product) => {
    return product.discountedPrice || product.actualPrice
  }

  const getProductImage = (product: Product) => {
    if (product.images && product.images.length > 0) {
      return product.images[0]
    }
    return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64' fill='none'%3E%3Crect width='64' height='64' fill='%23F3F4F6'/%3E%3Cpath d='M32 20C35.3137 20 38 17.3137 38 14C38 10.6863 35.3137 8 32 8C28.6863 8 26 10.6863 26 14C26 17.3137 28.6863 20 32 20Z' fill='%239CA3AF'/%3E%3Cpath d='M44 56H20C18.8954 56 18 55.1046 18 54V42C18 38.6863 20.6863 36 24 36H40C43.3137 36 46 38.6863 46 42V54C46 55.1046 45.1046 56 44 56Z' fill='%239CA3AF'/%3E%3C/svg%3E"
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>All Products ({products.length})</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search products..."
                className="w-64 pl-10"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={handleStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="out_of_stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={handleCategoryFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category._id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No products found</p>
            </div>
          ) : (
            products.map((product) => (
              <div key={product._id} className="flex items-center space-x-4 rounded-lg border p-4">
                <div className="h-16 w-16 rounded-lg bg-gray-200 overflow-hidden relative">
                  <Image src={getProductImage(product)} alt={product.name} fill className="object-cover" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">${getDisplayPrice(product).toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">{product.stock} in stock</p>
                </div>
                <Badge className={statusColors[product.status]}>{product.status.replace("_", " ")}</Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" disabled={isPending}>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handleStatusUpdate(product._id, "active")}
                      disabled={product.status === "active"}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Set Active
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleStatusUpdate(product._id, "out_of_stock")}
                      disabled={product.status === "out_of_stock"}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Set Out of Stock
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/products/${product._id}/edit`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Product
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(product._id)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Product
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
