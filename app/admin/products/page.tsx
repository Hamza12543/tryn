import {Button} from "@/components/ui/button"
import {Plus} from "lucide-react"
import Link from "next/link"
import {getProducts} from "@/actions/product"
import {getCategories} from "@/actions/category"
import {ProductsClient} from "./products-client"

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{search?: string; status?: string; category?: string}>
}) {
  const params = await searchParams

  const productsRaw = await getProducts(params.search, params.status, params.category)

  // Map to the Product interface expected by ProductsClient
  const products = productsRaw.map((p: any) => ({
    _id: p._id?.toString?.() ?? "",
    name: p.name,
    category: p.category,
    actualPrice: p.actualPrice,
    discountedPrice: p.discountedPrice,
    stock: p.stock,
    status: p.status,
    images: p.images,
    slug: p.slug,
  }))

  const categories = await getCategories()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Manage your product catalog and inventory.</p>
        </div>
        <Link href="/admin/products/add">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>

      <ProductsClient products={products} categories={categories} searchParams={params} />
    </div>
  )
}
