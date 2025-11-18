import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Textarea} from "@/components/ui/textarea"
import Hero from "@/components/custom/hero"
import TrustUsSection from "@/components/custom/trust-us-section"

export default function WholeSaleInquiry() {
  return (
    <>
      <Hero
        image="/placeholder.svg?height=600&width=1200"
        title="WHOLESALE INQUIRY"
        description="We offer best wholesale prices for business customers. please send us your requirements"
      />
      <div className="max-w-2xl mx-auto p-6 bg-white">
        <h1 className="text-2xl font-semibold text-gray-800 mb-8">WHOLESALE INQUIRY</h1>

        <form className="space-y-6">
          {/* First Name and Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm text-gray-600">
                First Name
              </Label>
              <Input id="firstName" type="text" className="bg-gray-100 border-0 h-12" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm text-gray-600">
                Last Name
              </Label>
              <Input id="lastName" type="text" className="bg-gray-100 border-0 h-12" />
            </div>
          </div>

          {/* Email and Business Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm text-gray-600">
                Email
              </Label>
              <Input id="email" type="email" className="bg-gray-100 border-0 h-12" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="businessName" className="text-sm text-gray-600">
                Business Name
              </Label>
              <Input id="businessName" type="text" className="bg-gray-100 border-0 h-12" />
            </div>
          </div>

          {/* Purchase Interest Dropdown */}
          <div className="space-y-2">
            <Label className="text-sm text-gray-600">I am interested in purchasing for my</Label>
            <Select>
              <SelectTrigger className="bg-gray-100 border-0 h-12">
                <SelectValue placeholder="SELECT" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="retail-store">Retail Store</SelectItem>
                <SelectItem value="restaurant">Restaurant</SelectItem>
                <SelectItem value="hotel">Hotel</SelectItem>
                <SelectItem value="event-planning">Event Planning</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Quantity and Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-sm text-gray-600">
                Quantity
              </Label>
              <Input id="quantity" type="text" className="bg-gray-100 border-0 h-12" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm text-gray-600">
                Location
              </Label>
              <Input id="location" type="text" className="bg-gray-100 border-0 h-12" />
            </div>
          </div>

          {/* Product Interest */}
          <div className="space-y-2">
            <Label htmlFor="products" className="text-sm text-gray-600">
              What Product(s) are you interested in?
            </Label>
            <Input id="products" type="text" className="bg-gray-100 border-0 h-12" />
          </div>

          {/* Additional Information */}
          <div className="space-y-2">
            <Label htmlFor="additionalInfo" className="text-sm text-gray-600">
              Additional Information
            </Label>
            <Textarea id="additionalInfo" className="bg-gray-100 border-0 min-h-[100px] resize-none" />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button type="submit" className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 h-12 font-medium">
              SEND
            </Button>
          </div>
        </form>
      </div>
      <TrustUsSection />
    </>
  )
}
