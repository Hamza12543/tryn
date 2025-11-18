import {Mail, Phone, MapPin} from "lucide-react"

export default function ContactSection() {
  return (
    <section className="py-16 px-4 bg-[#F2F2F2]">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-gray-900">Have Questions? Contact Us</h2>
              <p className="text-gray-600">Our support team is always happy to help you!</p>
            </div>

            <div className="space-y-6">
              {/* Email */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                  <Mail className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                  <p className="text-gray-600">support@trynmat.com</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                  <Phone className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                  <p className="text-gray-600">+44 141 429 0505</p>
                </div>
              </div>

              {/* Office */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Office</h3>
                  <p className="text-gray-600">Unit 2, 333 West Street Glasgow Scotland UK.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Image */}
          <div className="relative">
            <img src="/images/contact.png" alt="Contact us" className="w-full h-[400px] object-cover rounded-lg" />
          </div>
        </div>
      </div>
    </section>
  )
}
