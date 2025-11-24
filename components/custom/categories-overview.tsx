import Image from "next/image"
import Link from "next/link"
import {MoreHorizontal} from "lucide-react"

export default function CategoriesOverview() {
  const categories = [
    {
      id: 1,
      name: "Gym flooring",
      icon: "/icons/dumbbell.svg",
      href: "/gym-flooring",
    },
    {
      id: 2,
      name: "Entrance Mat",
      icon: "/icons/mate.svg",
      href: "/entrance-mat",
    },
    {
      id: 3,
      name: "Exercise & Yoga mats",
      icon: "/icons/excercise.svg",
      href: "/exercise-yoga-mats",
    },
    {
      id: 4,
      name: "Kids Playmats",
      icon: "/icons/kids-playmate.svg",
      href: "/kids-playmats",
    },
    {
      id: 5,
      name: "View All",
      icon: MoreHorizontal,
      href: "/all-categories",
    },
  ]

  return (
    <section className="w-full py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-light text-center text-gray-900 mb-16">The Full Collection</h2>
        {/* Scrollable on mobile, centered on larger screens */}
        <div className="overflow-x-auto no-scrollbar scroll-smooth md:overflow-visible -mx-4 md:mx-0">
          <div className="flex items-center md:justify-center gap-6 md:gap-20 lg:gap-24 px-4 snap-x snap-mandatory">
          {categories.map((category) => {
            if (typeof category.icon === "string") {
              // Custom SVG icon
              return (
                <Link
                  key={category.id}
                  href={category.href}
                  className="flex flex-col items-center group cursor-pointer transition-transform hover:scale-105 w-24 shrink-0 snap-start"
                >
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-gray-200 transition-colors">
                    <Image src={category.icon} alt={category.name} width={40} height={40} className="text-gray-700" />
                  </div>
                  <span className="text-xs md:text-sm text-gray-800 text-center font-medium w-24 leading-tight">
                    {category.name}
                  </span>
                </Link>
              )
            } else {
              // Lucide React icon (for "View All")
              const IconComponent = category.icon
              return (
                <Link
                  key={category.id}
                  href={category.href}
                  className="flex flex-col items-center group cursor-pointer transition-transform hover:scale-105 w-24 shrink-0 snap-start"
                >
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-gray-200 transition-colors">
                    <IconComponent className="w-10 h-10 text-gray-700" strokeWidth={1.5} />
                  </div>
                  <span className="text-xs md:text-sm text-gray-800 text-center font-medium w-24 leading-tight">
                    {category.name}
                  </span>
                </Link>
              )
            }
          })}
          </div>
        </div>
      </div>
    </section>
  )
}
