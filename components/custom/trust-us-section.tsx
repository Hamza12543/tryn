import {ThumbsUp, User, Heart, Package} from "lucide-react"

export default function TrustUsSection() {
  const features = [
    {
      icon: ThumbsUp,
      title: "10 Years",
      description: "We've been building and scaling solutions that work",
    },
    {
      icon: User,
      title: "24/7 Support",
      description: "Our team is always available for your needs",
    },
    {
      icon: Heart,
      title: "Trust",
      description: "A track record of happy clients and successful projects",
    },
    {
      icon: Package,
      title: "Shipping",
      description: "We deliver your products at no extra cost",
    },
  ]

  return (
    <section className="py-16 px-4" style={{backgroundColor: "#252F34"}}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-white text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
