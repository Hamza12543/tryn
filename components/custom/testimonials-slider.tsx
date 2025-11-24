"use client"

import {useState, useEffect} from "react"
import Image from "next/image"
import {ChevronLeft, ChevronRight, Star} from "lucide-react"
import {Button} from "@/components/ui/button"

const testimonials = [
  {
    id: 1,
    name: "Susan K",
    text: "My knees were suffering on my yoga mat and I had no idea until I found your mat. Can&apos;t workout without it now!",
    image: "/images/testimonial-1.png",
    rating: 5,
  },
  {
    id: 2,
    name: "Ali khan",
    text: "No more slipping or loud thuds during intense workouts — this mat stays in place and absorbs sound like a pro",
    image: "/images/testimonial-2.png",
    rating: 5,
  },
  {
    id: 3,
    name: "Maria Rodriguez",
    text: "The quality is outstanding! After 6 months of daily use, it still looks brand new. Best investment for my home gym.",
    image: "/images/testimonial-1.png",
    rating: 5,
  },
  {
    id: 4,
    name: "James Wilson",
    text: "Perfect thickness and grip. My joints feel so much better during workouts. Highly recommend to anyone serious about fitness.",
    image: "/images/testimonial-2.png",
    rating: 5,
  },
  {
    id: 5,
    name: "Emma Thompson",
    text: "Finally found a mat that doesn&apos;t slide around during hot yoga sessions. The grip is incredible even when wet!",
    image: "/images/testimonial-1.png",
    rating: 5,
  },
  {
    id: 6,
    name: "David Chen",
    text: "Excellent cushioning for my knees and joints. Makes a huge difference during floor exercises and stretching.",
    image: "/images/testimonial-2.png",
    rating: 5,
  },
]

export default function TestimonialsSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [itemsPerSlide, setItemsPerSlide] = useState(1)

  // Responsive items per slide: 1 on mobile, 2 on md+
  useEffect(() => {
    if (typeof window === "undefined") return
    const mq = window.matchMedia("(min-width: 768px)")
    const update = () => setItemsPerSlide(mq.matches ? 2 : 1)
    update()
    mq.addEventListener?.("change", update)
    return () => mq.removeEventListener?.("change", update)
  }, [])

  // Calculate total slides based on itemsPerSlide
  const totalSlides = Math.ceil(testimonials.length / itemsPerSlide)

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex === totalSlides - 1 ? 0 : prevIndex + 1))
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, totalSlides])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? totalSlides - 1 : currentIndex - 1)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const goToNext = () => {
    setCurrentIndex(currentIndex === totalSlides - 1 ? 0 : currentIndex + 1)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const renderStars = (rating: number) => {
    return Array.from({length: 5}, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? "fill-[#626463] text-[#626463]" : "fill-gray-200 text-gray-200"}`}
      />
    ))
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 overflow-x-hidden">
      <div className="grid lg:grid-cols-4 gap-8 items-start">
        {/* Header Section */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Let customers speak for us</h2>
          <div className="flex items-center gap-1">{renderStars(5)}</div>
          <p className="text-gray-600 font-medium">Valued Reviews</p>
          {/* Dots Navigation - Aligned with header and nav buttons */}
          <div className="flex gap-2 mt-6 lg:justify-start">
            {Array.from({length: totalSlides}, (_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                  index === currentIndex ? "bg-gray-800" : "bg-gray-300"
                }`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="lg:col-span-3 min-w-0">
          <div className="overflow-hidden min-w-0">
            <div
              className="flex transition-transform duration-500 ease-in-out min-w-0"
              style={{transform: `translateX(-${currentIndex * 100}%)`}}
            >
              {Array.from({length: totalSlides}, (_, slideIndex) => (
                <div key={slideIndex} className="w-full shrink-0 min-w-0">
                  <div className="grid md:grid-cols-2 gap-6">
                    {testimonials
                      .slice(slideIndex * itemsPerSlide, slideIndex * itemsPerSlide + itemsPerSlide)
                      .map((testimonial) => (
                      <div key={testimonial.id} className="bg-white rounded-lg shadow-sm border p-6">
                        <div className="flex flex-col h-full">
                          {/* Image */}
                          <div className="mb-4">
                            <Image
                              src={testimonial.image || "/placeholder.svg"}
                              alt={`${testimonial.name} testimonial`}
                              width={300}
                              height={200}
                              className="w-full h-48 object-cover rounded-lg"
                            />
                          </div>

                          {/* Rating */}
                          <div className="flex items-center gap-1 mb-3">{renderStars(testimonial.rating)}</div>

                          {/* Testimonial Text */}
                          <blockquote className="text-gray-700 mb-4 flex-grow text-sm leading-relaxed">
                            &ldquo;{testimonial.text}&rdquo;
                          </blockquote>

                          {/* Author */}
                          <div className="font-semibold text-gray-900">{testimonial.name}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Arrow Navigation - Bottom right */}
          <div className="flex justify-end mt-8" id="nav-buttons">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className="bg-white shadow-md hover:shadow-lg rounded-full w-10 h-10"
                onClick={goToPrevious}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="bg-white shadow-md hover:shadow-lg rounded-full w-10 h-10"
                onClick={goToNext}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
