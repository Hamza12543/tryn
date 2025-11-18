import Hero from "@/components/custom/hero"
import TrustUsSection from "@/components/custom/trust-us-section"

export default function PrivacyPolicy() {
  return (
    <>
      <Hero title="Privacy Policy" />
      <div className="max-w-7xl mx-auto p-6 bg-white">
        <h1 className="text-2xl font-semibold text-gray-800 mb-8">Privacy Policy</h1>
      </div>
      <TrustUsSection />
    </>
  )
}
