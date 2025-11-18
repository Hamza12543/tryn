"use client"

import {useState, useEffect} from "react"
import Image from "next/image"
import clsx from "clsx"

interface ProductImageGalleryProps {
  images: string[]
  productName: string
}

export default function ProductImageGallery({images, productName}: ProductImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [imageLoading, setImageLoading] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  // Minimum swipe distance
  const minSwipeDistance = 50

  const handleThumbnailClick = (index: number) => {
    if (index !== selectedImageIndex) {
      setImageLoading(true)
      setSelectedImageIndex(index)
      // Simulate image loading delay for better UX
      setTimeout(() => setImageLoading(false), 200)
    }
  }

  const handleKeyNavigation = (direction: "next" | "prev") => {
    let newIndex: number
    if (direction === "next") {
      newIndex = (selectedImageIndex + 1) % images.length
    } else {
      newIndex = selectedImageIndex === 0 ? images.length - 1 : selectedImageIndex - 1
    }
    handleThumbnailClick(newIndex)
  }

  // Touch handlers for mobile swipe
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      handleKeyNavigation("next")
    }
    if (isRightSwipe) {
      handleKeyNavigation("prev")
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        handleKeyNavigation("next")
      } else if (e.key === "ArrowLeft") {
        handleKeyNavigation("prev")
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedImageIndex, images.length])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-2">
      {/* Thumbnail Images */}
      <div className="lg:col-span-3 order-2 lg:order-1">
        <div className="h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <div className="flex lg:flex-col gap-2 pr-2">
            {images.map((thumb: string, index: number) => (
              <div
                key={index}
                className={clsx(
                  "flex-shrink-0 cursor-pointer transition-all duration-200 hover:scale-105",
                  selectedImageIndex === index && "scale-105"
                )}
                onClick={() => handleThumbnailClick(index)}
              >
                <Image
                  src={thumb || "/placeholder.svg"}
                  alt={`Product thumbnail ${index + 1}`}
                  width={80}
                  height={80}
                  className="w-16 h-16 lg:w-20 lg:h-20 object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Product Image */}
      <div className="lg:col-span-9 order-1 lg:order-2">
        <div
          className="relative w-full h-[500px] rounded-lg overflow-hidden group"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <Image
            src={images[selectedImageIndex]}
            alt={productName}
            fill
            className="object-cover transition-all duration-300 ease-in-out group-hover:scale-105"
            priority
          />
          {imageLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
            </div>
          )}

          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={() => handleKeyNavigation("prev")}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 opacity-0 group-hover:opacity-100"
                aria-label="Previous image"
              >
                <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => handleKeyNavigation("next")}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 opacity-0 group-hover:opacity-100"
                aria-label="Next image"
              >
                <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>
        {/* Image counter */}
        <div className="mt-1 text-center text-sm text-gray-500">
          Image {selectedImageIndex + 1} of {images.length}
        </div>
        {/* Navigation hints */}
        {images.length > 1 && (
          <div className="mt-1 text-center text-xs text-gray-400">
            Use ← → keys, swipe, or click thumbnails to navigate
          </div>
        )}
      </div>
    </div>
  )
}
