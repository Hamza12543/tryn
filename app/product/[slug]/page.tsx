import Image from "next/image"
import {ChevronDown} from "lucide-react"
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible"
import TrustUsSection from "@/components/custom/trust-us-section"
import {getProductBySlug} from "@/actions/product"
import {notFound} from "next/navigation"
import ProductClientSection from "./ProductClientSection"
import ProductImageGallery from "./ProductImageGallery"

export default async function ProductPage({params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  // Fallbacks for missing fields
  const images = product.images && product.images.length > 0 ? product.images : []
  const colors =
    product.colors && product.colors.length > 0 ? product.colors : ["midnight", "black", "purple", "dark", "light"]
  const sizes = product.sizes && product.sizes.length > 0 ? product.sizes : ["8pcs", "3sets"]

  // Convert product to plain object for client component
  const plainProduct = JSON.parse(JSON.stringify(product))

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="border-t">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center text-sm text-gray-600">
            <span>Home</span>
            <span className="mx-2">›</span>
            <span>{plainProduct.name}</span>
          </div>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Image Gallery + Features */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <ProductImageGallery images={images} productName={plainProduct.name} />

            {/* Product Features and Collapsible Sections */}
            <div className="mt-16">
              {/* Product Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  {plainProduct.features && plainProduct.features.length > 0 ? (
                    plainProduct.features.map((feature: string, idx: number) => (
                      <div className="flex items-start gap-3" key={idx}>
                        <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                        <div className="text-gray-600 text-sm">{feature}</div>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                      <div className="text-sm">
                        <span className="font-medium">Ultra-dense tiles:</span>
                        <span className="text-gray-600"> 11mm to 63mm thickness for extreme high-impact training.</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  {plainProduct.warranty && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                      <div className="text-sm">
                        <span className="font-medium">Warranty:</span>
                        <span className="text-gray-600"> {plainProduct.warranty}</span>
                      </div>
                    </div>
                  )}
                  {plainProduct.deliveryInfo && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                      <div className="text-sm">
                        <span className="font-medium">Fast shipping:</span>
                        <span className="text-gray-600"> {plainProduct.deliveryInfo}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Collapsible Sections */}
              <div className="space-y-4">
                {[
                  {key: "description", title: "Description", icon: "📝", content: plainProduct.description},
                  {
                    key: "specifications",
                    title: "Specification & Dimensions",
                    icon: "📏",
                    content: plainProduct.specifications?.join(", "),
                  },
                  {key: "care", title: "Care Instruction", icon: "🧽", content: plainProduct.careInstructions},
                  {key: "delivery", title: "Delivery & Returns", icon: "🚚", content: plainProduct.returnPolicy},
                ].map((section) => (
                  <Collapsible key={section.key}>
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <span>{section.icon}</span>
                        <span className="font-medium text-sm">{section.title}</span>
                      </div>
                      <ChevronDown className="w-5 h-5 flex-shrink-0" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="p-4 border-l border-r border-b border-gray-200 rounded-b-lg bg-white">
                      <div className="text-gray-600 text-sm leading-relaxed break-words">
                        {section.content || `Content for ${section.title} would go here...`}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="lg:col-span-5 order-3">
            <ProductClientSection product={plainProduct} colors={colors} sizes={sizes} />
          </div>
        </div>
      </div>

      {/* Banner Images */}
      {plainProduct.bannerImages && plainProduct.bannerImages.length > 0 && (
        <div className="mt-16 space-y-0">
          {plainProduct.bannerImages.map((bannerImage: string, index: number) => (
            <div key={index} className="w-full h-64 relative overflow-hidden">
              <Image
                src={bannerImage}
                alt={`${plainProduct.name} banner ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                priority={index === 0}
              />
            </div>
          ))}
        </div>
      )}
      <TrustUsSection />
    </div>
  )
}
