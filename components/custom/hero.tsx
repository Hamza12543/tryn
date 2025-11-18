import Image from "next/image"

interface HeroProps {
  image?: string
  title: string
  description?: string
}

export default function Hero({image, title, description}: HeroProps) {
  return (
    <section className="relative h-[350px] md:h-[400px] lg:h-[500px] w-full overflow-hidden">
      {/* Background Image or Solid Color */}
      {image ? (
        <Image src={image} alt={`${title} background`} fill className="object-cover object-center" priority />
      ) : (
        <div className="absolute inset-0 bg-[#F2F0EC]" />
      )}

      {/* Dark Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content Overlay */}
      <div className="relative z-10 flex h-full items-center justify-center px-4">
        <div className="text-center max-w-7xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-wider">{title}</h1>
          <p className="text-white/90 text-sm md:text-base lg:text-lg leading-relaxed mx-auto">{description}</p>
        </div>
      </div>
    </section>
  )
}
