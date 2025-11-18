import Image from "next/image"
import {Facebook, Instagram, Twitter} from "lucide-react"
import {Button} from "@/components/ui/button"

// Custom TikTok icon component since it's not in Lucide
const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
)

// Play button overlay component
const PlayButton = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
      <div className="w-0 h-0 border-l-[8px] border-l-gray-800 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1"></div>
    </div>
  </div>
)

export default function SocialMediaSection() {
  // Array to track which images should have video play buttons
  const videoIndices = [4, 5, 6, 7, 8, 9, 10, 11] // Second and third rows have video overlays

  return (
    <section className="w-full py-12 px-4 md:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with title and social media icons */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Follow us on Social Media</h2>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900">
              <Facebook className="w-5 h-5" />
              <span className="sr-only">Facebook</span>
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900">
              <Instagram className="w-5 h-5" />
              <span className="sr-only">Instagram</span>
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900">
              <TikTokIcon />
              <span className="sr-only">TikTok</span>
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900">
              <Twitter className="w-5 h-5" />
              <span className="sr-only">Twitter</span>
            </Button>
          </div>
        </div>

        {/* Image grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({length: 12}, (_, index) => (
            <div key={index} className="relative aspect-square overflow-hidden rounded-lg group cursor-pointer">
              <Image
                src={`/placeholder.svg?height=300&width=300`}
                alt={`Social media post ${index + 1}`}
                fill
                className="object-cover transition-transform duration-200 group-hover:scale-105"
              />
              {videoIndices.includes(index) && <PlayButton />}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
