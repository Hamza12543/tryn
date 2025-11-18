import Link from "next/link"

export default function AnnouncementBanner() {
  return (
    <div className="w-full py-3 px-4 bg-[#252F34]">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex-1 text-center">
          <p className="text-white text-sm font-medium">
            Get 10% off your first order when spend £30+. Use code: <span className="font-semibold">SAVE10</span>
          </p>
        </div>
        <Link href="/help" className="text-white text-sm hover:text-gray-200 transition-colors ml-4">
          Help
        </Link>
      </div>
    </div>
  )
}
