import Image from "next/image"
import {Star} from "lucide-react"
import {Button} from "@/components/ui/button"
import Link from "next/link"

interface Product {
  _id: string
  name: string
  images?: string[]
  actualPrice: number
  discountedPrice?: number
  colors: string[]
  slug: string
  // Optionally add more fields as needed
}

function StarRating({rating, reviews}: {rating: number; reviews: number}) {
  return (
    <div className="flex items-center gap-1 justify-center">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3 h-3 ${star <= rating ? "fill-[#626463] text-[#626463]" : "fill-gray-200 text-gray-200"}`}
          />
        ))}
      </div>
      <span className="text-xs text-gray-500">({reviews} reviews)</span>
    </div>
  )
}

function ColorVariants({colors}: {colors: string[]}) {
  return (
    <div className="flex gap-1 mt-2 justify-center">
      {colors.map((color, index) => (
        <div key={index} className="w-3 h-3 rounded-full border border-gray-300" style={{backgroundColor: color}} />
      ))}
    </div>
  )
}

export default function BestsellersSection({products}: {products: Product[]}) {
  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <p className="text-gray-600 mb-4">Discover Our Top-Performing Products For Your Workout</p>
        <h2 className="text-4xl font-light text-gray-800">Our Bestsellers</h2>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {products.map((product) => (
          <Link key={product._id} href={`/product/${product.slug}`} className="group cursor-pointer text-center block">
            <div className="aspect-square mb-4 overflow-hidden bg-gray-50 rounded-lg">
              <Image
                src={product.images && product.images.length > 0 ? product.images[0] : "/placeholder.svg"}
                alt={product.name}
                width={300}
                height={300}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-sm text-gray-800 leading-tight">{product.name}</h3>
              <div className="flex items-center gap-2 justify-center">
                <span className="text-red-600 font-medium">From £{product.discountedPrice ?? product.actualPrice}</span>
                {product.discountedPrice && (
                  <span className="text-gray-400 line-through text-sm">{product.actualPrice} £</span>
                )}
              </div>
              <StarRating rating={4.5} reviews={117} />
              <ColorVariants colors={product.colors} />
            </div>
          </Link>
        ))}
      </div>
      <div className="text-center">
        <Link href="/shop">
          <Button
            variant="secondary"
            className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-none font-medium tracking-wide cursor-pointer"
          >
            ALL PRODUCTS
          </Button>
        </Link>
      </div>
    </section>
  )
}
