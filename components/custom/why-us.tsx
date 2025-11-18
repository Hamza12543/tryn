import {Star} from "lucide-react"

export default function WhyUs() {
  return (
    <div className="bg-[#F2F0EC] py-4 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 text-sm text-gray-700">
          {/* 30-Day Easy Return */}
          <div className="text-center">
            <span className="font-medium">30-Day easy return</span>
          </div>

          {/* Divider - hidden on mobile */}
          <div className="hidden md:block w-px h-6 bg-gray-300"></div>

          {/* Free Delivery */}
          <div className="text-center">
            <span className="font-medium">Free delivery • order over £25</span>
          </div>

          {/* Divider - hidden on mobile */}
          <div className="hidden md:block w-px h-6 bg-gray-300"></div>

          {/* Rating */}
          <div className="text-center flex items-center gap-2">
            <span className="font-medium">Excellent 4.8</span>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#626463] text-[#626463]" />
              ))}
            </div>
            <span className="font-medium">rating</span>
          </div>
        </div>
      </div>
    </div>
  )
}
