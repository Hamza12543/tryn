import Image from "next/image"
import Link from "next/link"

export default function HeroBanner() {
  return (
    <section className="relative h-[80vh] w-full overflow-hidden">
      {/* Background Image */}
      <Image
        src="/images/fitness-hero.png"
        alt="Fitness training with medicine ball in modern gym"
        fill
        className="object-cover object-center"
        priority
        sizes="100vw"
      />

      {/* Dark Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content Overlay */}
      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="container mx-auto px-4 text-center text-white">
          {/* Small tagline */}
          <div className="mb-4 flex items-center justify-center gap-2">
            <div className="h-2 w-2 rounded-full bg-red-500" />
            <p className="text-sm font-medium uppercase tracking-wider">With Every Heartbeat</p>
          </div>

          {/* Main Heading */}
          <h1 className="mb-8 text-4xl font-bold leading-tight md:text-6xl lg:text-7xl">
            Your #1 Home
            <br />
            Fitness Brand
          </h1>

          {/* CTA Button */}
          <Link
            href="/shop"
            className="inline-block bg-primary px-8 py-3 text-sm font-semibold uppercase tracking-wider text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </section>
  )
}
