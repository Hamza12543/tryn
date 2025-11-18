import CategoriesOverview from "@/components/custom/categories-overview"
import HeroBanner from "@/components/custom/hero-banner"
import WhyUs from "@/components/custom/why-us"
import BestsellersSection from "@/components/custom/bestsellers-section"
import TrendingProductSection from "@/components/custom/trending-product-section"
import TestimonialsSlider from "@/components/custom/testimonials-slider"
import ContactSection from "@/components/custom/contact-section"
import TrustUsSection from "@/components/custom/trust-us-section"
import {getProducts} from "@/actions/product"

export default async function Home() {
  const productsRaw = await getProducts(undefined, undefined, undefined, true)
  // Map to the Product interface expected by BestsellersSection
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
      <HeroBanner />
      <CategoriesOverview />
      <WhyUs />
      <BestsellersSection products={products.slice(0, 8)} />
      <TrendingProductSection />
      <TestimonialsSlider />
      <ContactSection />
      <TrustUsSection />
    </>
  )
}
