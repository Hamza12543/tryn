import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Textarea} from "@/components/ui/textarea"
import {Separator} from "@/components/ui/separator"
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible"
import {Search, ChevronDown} from "lucide-react"
import Hero from "@/components/custom/hero"
import TrustUsSection from "@/components/custom/trust-us-section"

export default function HelpPage() {
  return (
    <>
      <Hero title="Customer Help" />
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Left Side - Inquiry Text + Navigation Menu */}
            <div className="lg:col-span-4 space-y-8">
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4 leading-relaxed">
                  FOR ANY INQUIRIES
                  <br />
                  OR QUESTIONS,
                  <br />
                  FEEL FREE TO
                  <br />
                  REACH OUT TO US!
                </h2>
                <p className="text-sm text-gray-600 mb-8">
                  Fill out the form below or shoot us a<br />
                  message at support@mymail.com
                </p>
              </div>

              <div>
                <h3 className="text-lg text-gray-600 mb-8">How can we help?</h3>
                <nav className="space-y-4">
                  <div className="text-sm text-gray-900 font-medium cursor-pointer hover:text-gray-700">My Order</div>
                  <div className="text-sm text-gray-600 cursor-pointer hover:text-gray-900">Shipping & Delivery</div>
                  <div className="text-sm text-gray-600 cursor-pointer hover:text-gray-900">Account details</div>
                  <div className="text-sm text-gray-600 cursor-pointer hover:text-gray-900">Payments</div>
                </nav>
              </div>
            </div>

            {/* Right Side - Contact Form + FAQ */}
            <div className="lg:col-span-8 space-y-12">
              {/* Contact Us Section */}
              <div>
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-semibold text-gray-900 tracking-wide">CONTACT US</h1>
                </div>

                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-sm text-gray-600 mb-2 block">
                        Name
                      </Label>
                      <Input id="name" type="text" className="bg-white" />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-sm text-gray-600 mb-2 block">
                        Email
                      </Label>
                      <Input id="email" type="email" className="bg-white" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="message" className="text-sm text-gray-600 mb-2 block">
                      Message
                    </Label>
                    <Textarea id="message" rows={4} className="bg-white resize-none" />
                  </div>
                  <Button
                    type="submit"
                    className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-2 text-sm font-medium"
                  >
                    SEND
                  </Button>
                </form>
              </div>

              {/* FAQ Section */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">FAQ</h2>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input placeholder="Search FAQ" className="pl-10 bg-white" />
                </div>

                {/* My Order Section */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">My Order</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Once your order is placed, you will receive a confirmation email letting you know that our
                    fulfillment team has received your order. Once your order is fulfilled, you will receive an email
                    notification with your tracking information.
                  </p>

                  {/* FAQ Items */}
                  <div className="space-y-2">
                    <Collapsible>
                      <CollapsibleTrigger className="flex items-center justify-between w-full py-3 text-left text-sm font-medium text-gray-900 hover:text-gray-700">
                        How do I track my order?
                        <ChevronDown className="h-4 w-4" />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="pb-3">
                        <p className="text-sm text-gray-600">
                          You can track your order using the tracking number provided in your confirmation email.
                        </p>
                      </CollapsibleContent>
                    </Collapsible>

                    <Separator />

                    <Collapsible>
                      <CollapsibleTrigger className="flex items-center justify-between w-full py-3 text-left text-sm font-medium text-gray-900 hover:text-gray-700">
                        Can I change delivery detail or order once I&apos;ve placed it?
                        <ChevronDown className="h-4 w-4" />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="pb-3">
                        <p className="text-sm text-gray-600">
                          Changes to delivery details may be possible if your order hasn&apos;t been processed yet.
                          Please contact our support team immediately.
                        </p>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <TrustUsSection />
    </>
  )
}
