import CategoriesOverviewWithProducts from "@/components/custom/categories-overview-with-products"
import Hero from "@/components/custom/hero"
import TrustUsSection from "@/components/custom/trust-us-section"
import {getProducts} from "@/actions/product"

interface ShopPageProps {
  searchParams: Promise<{[key: string]: string | string[] | undefined}>
}

export default async function Shop({searchParams}: ShopPageProps) {
  const params = await searchParams
  const category = typeof params.category === "string" ? params.category : undefined

  const productsRaw = await getProducts(undefined, undefined, category)
  const products = productsRaw.map((p: any) => ({
    _id: p._id?.toString?.() ?? "",
    name: p.name,
    images: p.images,
    actualPrice: p.actualPrice,
    discountedPrice: p.discountedPrice,
    colors: p.colors ?? [],
    slug: p.slug,
  }))
  return (
    <>
      <Hero
        image="/images/products-hero.png"
        title="GYM MATS"
        description=" Tryn's Gym Mats are designed for smart, customizable fitness spaces — snap them together for full coverage,
            layer them for added support, or shape them to fit any workout zone. Versatile, durable, and easy to
            reconfigure, they move with your routine!"
      />
      <CategoriesOverviewWithProducts products={products} />
      <TrustUsSection />
    </>
  )
}
