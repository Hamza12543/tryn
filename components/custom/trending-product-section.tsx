import Image from "next/image"
import {Button} from "@/components/ui/button"

export default function TrendingProductSection() {
  return (
    <section className="bg-[#F2F2F2] py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Placeholder Image */}
          <div className="relative">
            <Image
              src="/images/featured-product.svg"
              alt="Workout scene with floor mats"
              width={400}
              height={300}
              className="w-full h-auto rounded-lg"
              priority
            />
          </div>

          {/* Right Side - Product Information */}
          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-xs font-semibold text-gray-500 tracking-[0.2em] uppercase">Introducing</p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                Soft Interlocking Floor Mats
              </h2>
            </div>
            h
            <p className="text-gray-600 text-sm leading-relaxed max-w-md">
              This EVA Foam-Rubber Non Slip Tiles 60cm x 60cm x 10mm mat offers the same folding and stacking
              flexibility as high-performance mats, now enhanced with a premium textured layer for improved durability
              and superior grip.
            </p>
            <Button className="bg-black hover:bg-gray-800 text-white border-0 px-8 py-3 text-xs font-semibold tracking-[0.1em] uppercase rounded-none cursor-pointer">
              Shop Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
