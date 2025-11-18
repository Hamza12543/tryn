"use client"

import Image from "next/image"
import {MoreHorizontal} from "lucide-react"
import {useRouter, useSearchParams} from "next/navigation"
import {Star} from "lucide-react"
import Link from "next/link"

interface Product {
  _id: string
  name: string
  images?: string[]
  actualPrice: number
  discountedPrice?: number
  colors: string[]
  slug: string
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

export default function CategoriesOverviewWithProducts({products}: {products: Product[]}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const categories = [
    {
      id: 1,
      name: "Gym flooring",
      icon: "/icons/dumbbell.svg",
      filterValue: "Gym flooring",
    },
    {
      id: 2,
      name: "Entrance Mat",
      icon: "/icons/mate.svg",
      filterValue: "Entrance Mat",
    },
    {
      id: 3,
      name: "Exercise & Yoga mats",
      icon: "/icons/excercise.svg",
      filterValue: "Exercise & Yoga mats",
    },
    {
      id: 4,
      name: "Kids Playmats",
      icon: "/icons/kids-playmate.svg",
      filterValue: "Kids Playmats",
    },
  ]

  const handleCategoryClick = (filterValue: string) => {
    const params = new URLSearchParams(searchParams)
    if (filterValue === searchParams.get("category")) {
      params.delete("category")
    } else {
      params.set("category", filterValue)
    }
    router.push(`/shop?${params.toString()}`)
  }

  const currentCategory = searchParams.get("category")

  return (
    <section className="w-full py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-light text-center text-gray-900 mb-16">The Full Collection</h2>

        <div className="flex justify-center items-center gap-16 md:gap-20 lg:gap-24 mb-16">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.filterValue)}
              className={`flex flex-col items-center group cursor-pointer transition-transform hover:scale-105 w-24 ${
                currentCategory === category.filterValue ? "ring-2 ring-blue-500 ring-offset-2" : ""
              }`}
            >
              <div
                className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 transition-colors ${
                  currentCategory === category.filterValue
                    ? "bg-blue-100 group-hover:bg-blue-200"
                    : "bg-gray-100 group-hover:bg-gray-200"
                }`}
              >
                <Image src={category.icon} alt={category.name} width={40} height={40} className="text-gray-700" />
              </div>
              <span className="text-xs md:text-sm text-gray-800 text-center font-medium w-24 leading-tight">
                {category.name}
              </span>
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <Link
              key={product._id}
              href={`/product/${product.slug}`}
              className="group cursor-pointer text-center block"
            >
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
                  <span className="text-red-600 font-medium">
                    From £{product.discountedPrice ?? product.actualPrice}
                  </span>
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
      </div>
    </section>
  )
}
