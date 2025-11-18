import {Button} from "@/components/ui/button"
import {ArrowLeft} from "lucide-react"
import Link from "next/link"
import {getProduct} from "@/actions/product"
import {notFound} from "next/navigation"
import {EditProductForm} from "./edit-product-form"

export default async function EditProductPage({params}: {params: Promise<{id: string}>}) {
  const {id} = await params
  const product = await getProduct(id)

  if (!product) {
    notFound()
  }

  // Serialize the MongoDB document to a plain object
  const serializedProduct = JSON.parse(JSON.stringify(product))

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
            <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
            <p className="text-muted-foreground">Update product details and specifications.</p>
          </div>
        </div>
      </div>

      <EditProductForm product={serializedProduct} productId={id} />
    </div>
  )
}
