import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Facebook, Instagram, Twitter} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Custom TikTok icon component since it's not in Lucide
const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
)

export default function Footer() {
  return (
    <footer className="bg-[#F2F2F2] border-t border-gray-200 py-12 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Customer Service */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wide">CUSTOMER SERVICE</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-gray-600 hover:text-gray-900 text-sm">
                  Support
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-gray-900 text-sm">
                  Your account
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-gray-900 text-sm">
                  Order status
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-gray-900 text-sm">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-gray-900 text-sm">
                  Shipping & delivery
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-gray-900 text-sm">
                  Returns & refund
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-gray-900 text-sm">
                  Stronger Warranty Info
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-gray-900 text-sm">
                  Payment options
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-gray-900 text-sm">
                  Terms & conditions of sale
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-gray-900 text-sm">
                  Privacy & cookie policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-gray-900 text-sm">
                  Terms of use
                </Link>
              </li>
            </ul>
          </div>

          {/* Stronger Wellness */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wide">STRONGER WELLNESS</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-gray-600 hover:text-gray-900 text-sm">
                  About us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-gray-900 text-sm">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-gray-900 text-sm">
                  Contact us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-gray-900 text-sm">
                  Blog & Fitness News
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-gray-900 text-sm">
                  Download Catalogue
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wide">CONTACT US</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p>
                Unit 2, 333 West Street
                <br />
                Glasgow Scotland UK
              </p>
              <p>
                Tel:{" "}
                <Link href="tel:+441414290505" className="text-blue-600 hover:underline">
                  +44 141 429 0505
                </Link>
              </p>
              <p>
                Email:{" "}
                <Link href="mailto:support@trynmat.com" className="text-blue-600 hover:underline">
                  support@trynmat.com
                </Link>
              </p>
              <div className="pt-2">
                <Link href="#" className="text-blue-600 hover:underline">
                  Google Business
                </Link>
                <br />
                <Link href="#" className="text-blue-600 hover:underline">
                  Trustpilot
                </Link>
              </div>
              <div className="flex space-x-4 pt-4">
                <Link href="#" className="text-gray-400 hover:text-gray-600">
                  <Facebook className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-gray-600">
                  <Instagram className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-gray-600">
                  <TikTokIcon />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-gray-600">
                  <Twitter className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wide">NEWSLETTER</h3>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                We promise not to spam you (By signing up, you agree to our{" "}
                <Link href="#" className="text-blue-600 hover:underline">
                  privacy policy and terms of use
                </Link>
                )
              </p>
              <div className="flex gap-2">
                <Input type="email" placeholder="Your email address" className="flex-1" />
                <Button className="bg-black hover:bg-gray-800 text-white px-6 cursor-pointer">SUBSCRIBE</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="pt-8 flex flex-col lg:flex-row justify-between items-center">
          <div className="text-lg text-gray-600 mb-4 lg:mb-0">©TRYNMAT.COM</div>
          <div className="flex flex-col items-center lg:items-end space-y-2 -mt-2">
            {/* TRYN Logo */}
            <div className="flex flex-col items-center">
              <Image src="/logo.svg" alt="TRYN Logo" width={254} height={90} className="mb-1" />
            </div>

            {/* Payment Methods */}
            <Image src="/images/payment-methods.svg" alt="Payment Methods" width={320} height={80} />
          </div>
        </div>
      </div>
    </footer>
  )
}
