// "use client"
// import {useState, useEffect} from "react"
// import {useSession} from "next-auth/react"
// import {useRouter} from "next/navigation"
// import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
// import {Button} from "@/components/ui/button"
// import {Input} from "@/components/ui/input"
// import {Label} from "@/components/ui/label"
// import {Textarea} from "@/components/ui/textarea"
// import {Badge} from "@/components/ui/badge"
// import {Separator} from "@/components/ui/separator"
// import {ArrowLeft, ShoppingBag, Loader2, CreditCard, MapPin, User, AlertCircle} from "lucide-react"
// import Image from "next/image"
// import Link from "next/link"
// import {useCartStore} from "@/store/cart-store"
// import {createCheckout} from "@/actions/checkout"
// import {toast} from "sonner"

// export default function CheckoutPage() {
//   const {data: session} = useSession()
//   console.log("Session data:", session?.user?.address?.postcode)
//   const router = useRouter()
//   const {items, getTotal, clearCart} = useCartStore()
//   const [isLoading, setIsLoading] = useState(false)
//   const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
//   const [customerInfo, setCustomerInfo] = useState({
//     name: session?.user?.name || "",
//     email: session?.user?.email || "",
//     phone: session?.user?.phone || "",
//     notes: "",
//   })
//   const [shippingAddress, setShippingAddress] = useState({
//     street: session?.user?.address?.addressLine1 || "",
//     city: session?.user?.address?.city || "",
//     state: session?.user?.address?.county || "",
//     postalCode: session?.user?.address?.postcode || "",
//     country: session?.user?.address?.country || "GB",
//   })

//   useEffect(() => {
//     if (!session?.user) {
//       router.push("/login?redirect=/checkout")
//       return
//     }

//     if (items.length === 0) {
//       router.push("/shop")
//       return
//     }
//   }, [session, items, router])

//   const validateForm = () => {
//     const errors: Record<string, string> = {}

//     if (!customerInfo.name.trim()) {
//       errors.name = "Full name is required"
//     }

//     if (!customerInfo.email.trim()) {
//       errors.email = "Email is required"
//     } else if (!/\S+@\S+\.\S+/.test(customerInfo.email)) {
//       errors.email = "Please enter a valid email address"
//     }

//     if (!shippingAddress.street.trim()) {
//       errors.street = "Street address is required"
//     }

//     if (!shippingAddress.city.trim()) {
//       errors.city = "City is required"
//     }

//     if (!shippingAddress.postalCode.trim()) {
//       errors.postalCode = "Postal code is required"
//     }

//     setValidationErrors(errors)
//     return Object.keys(errors).length === 0
//   }

//   const handleCheckout = async () => {
//     if (!validateForm()) {
//       toast.error("Please fix the errors in the form")
//       return
//     }

//     setIsLoading(true)

//     try {
//       const result = await createCheckout({
//         items: items.map((item) => ({
//           id: item.id,
//           name: item.name,
//           price: item.price,
//           quantity: item.quantity,
//           image: item.image,
//         })),
//         customerEmail: customerInfo.email,
//         customerName: customerInfo.name,
//         shippingAddress,
//       })

//       if (result.url) {
//         window.location.href = result.url
//       } else {
//         throw new Error("Failed to create checkout session")
//       }
//     } catch (error) {
//       console.error("Checkout error:", error)
//       const errorMessage = error instanceof Error ? error.message : "Failed to proceed to checkout. Please try again."
//       toast.error(errorMessage)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   if (!session?.user || items.length === 0) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <Loader2 className="h-8 w-8 animate-spin" />
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-6xl mx-auto px-4">
//         {/* Header */}
//         <div className="mb-8">
//           <Link href="/shop" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Back to Shop
//           </Link>
//           <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
//           <p className="text-gray-600 mt-2">Complete your purchase</p>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Main Checkout Form */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Customer Information */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <User className="h-5 w-5" />
//                   Customer Information
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <Label htmlFor="name">Full Name *</Label>
//                     <Input
//                       id="name"
//                       value={customerInfo.name}
//                       onChange={(e) => {
//                         setCustomerInfo((prev) => ({...prev, name: e.target.value}))
//                         if (validationErrors.name) {
//                           setValidationErrors((prev) => ({...prev, name: ""}))
//                         }
//                       }}
//                       placeholder="Enter your full name"
//                       className={validationErrors.name ? "border-red-500" : ""}
//                     />
//                     {validationErrors.name && <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>}
//                   </div>
//                   <div>
//                     <Label htmlFor="email">Email *</Label>
//                     <Input
//                       id="email"
//                       type="email"
//                       value={customerInfo.email}
//                       onChange={(e) => {
//                         setCustomerInfo((prev) => ({...prev, email: e.target.value}))
//                         if (validationErrors.email) {
//                           setValidationErrors((prev) => ({...prev, email: ""}))
//                         }
//                       }}
//                       placeholder="Enter your email"
//                       className={validationErrors.email ? "border-red-500" : ""}
//                     />
//                     {validationErrors.email && <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>}
//                   </div>
//                 </div>
//                 <div>
//                   <Label htmlFor="phone">Phone Number</Label>
//                   <Input
//                     id="phone"
//                     value={customerInfo.phone}
//                     onChange={(e) => setCustomerInfo((prev) => ({...prev, phone: e.target.value}))}
//                     placeholder="Enter your phone number"
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="notes">Order Notes</Label>
//                   <Textarea
//                     id="notes"
//                     value={customerInfo.notes}
//                     onChange={(e) => setCustomerInfo((prev) => ({...prev, notes: e.target.value}))}
//                     placeholder="Any special instructions or notes..."
//                     rows={3}
//                   />
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Shipping Address */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <MapPin className="h-5 w-5" />
//                   Shipping Address
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div>
//                   <Label htmlFor="street">Street Address *</Label>
//                   <Input
//                     id="street"
//                     value={shippingAddress.street}
//                     onChange={(e) => {
//                       setShippingAddress((prev) => ({...prev, street: e.target.value}))
//                       if (validationErrors.street) {
//                         setValidationErrors((prev) => ({...prev, street: ""}))
//                       }
//                     }}
//                     placeholder="Enter your street address"
//                     className={validationErrors.street ? "border-red-500" : ""}
//                   />
//                   {validationErrors.street && <p className="text-red-500 text-sm mt-1">{validationErrors.street}</p>}
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   <div>
//                     <Label htmlFor="city">City *</Label>
//                     <Input
//                       id="city"
//                       value={shippingAddress.city}
//                       onChange={(e) => {
//                         setShippingAddress((prev) => ({...prev, city: e.target.value}))
//                         if (validationErrors.city) {
//                           setValidationErrors((prev) => ({...prev, city: ""}))
//                         }
//                       }}
//                       placeholder="City"
//                       className={validationErrors.city ? "border-red-500" : ""}
//                     />
//                     {validationErrors.city && <p className="text-red-500 text-sm mt-1">{validationErrors.city}</p>}
//                   </div>
//                   <div>
//                     <Label htmlFor="state">State/Province</Label>
//                     <Input
//                       id="state"
//                       value={shippingAddress.state}
//                       onChange={(e) => setShippingAddress((prev) => ({...prev, state: e.target.value}))}
//                       placeholder="State"
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor="postalCode">Postal Code *</Label>
//                     <Input
//                       id="postalCode"
//                       value={shippingAddress.postalCode}
//                       onChange={(e) => {
//                         setShippingAddress((prev) => ({...prev, postalCode: e.target.value}))
//                         if (validationErrors.postalCode) {
//                           setValidationErrors((prev) => ({...prev, postalCode: ""}))
//                         }
//                       }}
//                       placeholder="Postal Code"
//                       className={validationErrors.postalCode ? "border-red-500" : ""}
//                     />
//                     {validationErrors.postalCode && (
//                       <p className="text-red-500 text-sm mt-1">{validationErrors.postalCode}</p>
//                     )}
//                   </div>
//                 </div>
//                 <div>
//                   <Label htmlFor="country">Country</Label>
//                   <Input
//                     id="country"
//                     value={shippingAddress.country}
//                     onChange={(e) => setShippingAddress((prev) => ({...prev, country: e.target.value}))}
//                     placeholder="Country"
//                   />
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Order Summary */}
//           <div className="space-y-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <ShoppingBag className="h-5 w-5" />
//                   Order Summary
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {items.map((item) => (
//                     <div key={`${item.id}-${item.color || ""}-${item.size || ""}`} className="flex gap-3">
//                       <div className="relative">
//                         <Image
//                           src={item.image}
//                           alt={item.name}
//                           width={60}
//                           height={60}
//                           className="rounded-lg object-cover border"
//                         />
//                         <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full text-xs p-0 flex items-center justify-center">
//                           {item.quantity}
//                         </Badge>
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <h4 className="font-medium text-sm truncate">{item.name}</h4>
//                         <div className="flex items-center gap-2 mt-1">
//                           {item.color && (
//                             <Badge variant="secondary" className="text-xs">
//                               {item.color}
//                             </Badge>
//                           )}
//                           {item.size && (
//                             <Badge variant="secondary" className="text-xs">
//                               {item.size}
//                             </Badge>
//                           )}
//                         </div>
//                         <p className="text-sm text-gray-600">£{item.price.toFixed(2)} each</p>
//                       </div>
//                       <div className="text-right">
//                         <p className="font-medium">£{(item.price * item.quantity).toFixed(2)}</p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 <Separator className="my-4" />

//                 <div className="space-y-2">
//                   <div className="flex justify-between items-center">
//                     <span className="text-gray-600">Subtotal</span>
//                     <span className="font-medium">£{getTotal().toFixed(2)}</span>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="text-gray-600">Shipping</span>
//                     <span className="text-green-600 font-medium">Free</span>
//                   </div>
//                   <Separator />
//                   <div className="flex justify-between items-center">
//                     <span className="text-lg font-bold">Total</span>
//                     <span className="text-xl font-bold">£{getTotal().toFixed(2)}</span>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Payment Method */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <CreditCard className="h-5 w-5" />
//                   Payment Method
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="p-4 bg-blue-50 rounded-lg">
//                   <p className="text-sm text-blue-800">
//                     You&apos;ll be redirected to Stripe to complete your payment securely.
//                   </p>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Checkout Button */}
//             <Button
//               variant="default"
//               size="lg"
//               className="w-full font-semibold py-4 text-lg rounded-lg cursor-pointer"
//               onClick={handleCheckout}
//               disabled={isLoading}
//             >
//               {isLoading ? (
//                 <>
//                   <Loader2 className="h-5 w-5 mr-2 animate-spin" />
//                   Processing...
//                 </>
//               ) : (
//                 <>
//                   <CreditCard className="h-5 w-5 mr-2" />
//                   Pay £{getTotal().toFixed(2)}
//                 </>
//               )}
//             </Button>

//             <p className="text-xs text-gray-500 text-center">Secure checkout powered by Stripe</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

"use client"
import {useState, useEffect} from "react"
import {useSession} from "next-auth/react"
import {useRouter} from "next/navigation"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Textarea} from "@/components/ui/textarea"
import {Badge} from "@/components/ui/badge"
import {Separator} from "@/components/ui/separator"
import {ArrowLeft, ShoppingBag, Loader2, CreditCard, MapPin, User} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import {useCartStore} from "@/store/cart-store"
import {createCheckout} from "@/actions/checkout"
import {toast} from "sonner"

export default function CheckoutPage() {
  const {data: session} = useSession()
  const router = useRouter()
  const {items, getTotal} = useCartStore()
  const [isLoading, setIsLoading] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [useSaved, setUseSaved] = useState<"saved" | "new">("saved")
  const [couponCode, setCouponCode] = useState("")
  const [discount, setDiscount] = useState(0)
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)
  const [isApplying, setIsApplying] = useState(false)

  const [customerInfo, setCustomerInfo] = useState({
  name: session?.user?.name || "",
  email: session?.user?.email || "",
  phone: (session?.user as any)?.phone || "", // Temporary fix with type assertion
  notes: "",
})

const [shippingAddress, setShippingAddress] = useState({
  street: (session?.user as any)?.address?.addressLine1 || "",
  city: (session?.user as any)?.address?.city || "",
  state: (session?.user as any)?.address?.county || "",
  postalCode: (session?.user as any)?.address?.postcode || "",
  country: (session?.user as any)?.address?.country || "GB",
})

// Handle switching between saved / new address
useEffect(() => {
  if (useSaved === "saved" && (session?.user as any)?.address) {
    setShippingAddress({
      street: (session?.user as any)?.address?.addressLine1 || "",
      city: (session?.user as any)?.address?.city || "",
      state: (session?.user as any)?.address?.county || "",
      postalCode: (session?.user as any)?.address?.postcode || "",
      country: (session?.user as any)?.address?.country || "GB",
    })
  }
  if (useSaved === "new") {
    setShippingAddress({
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "GB",
    })
  }
}, [useSaved, session])

  useEffect(() => {
    // Only redirect if cart is empty
    if (items.length === 0) {
      router.push("/shop")
      return
    }
  }, [items, router])

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!customerInfo.name.trim()) {
      errors.name = "Full name is required"
    }
    if (!customerInfo.email.trim()) {
      errors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(customerInfo.email)) {
      errors.email = "Please enter a valid email address"
    }
    if (!shippingAddress.street.trim()) {
      errors.street = "Street address is required"
    }
    if (!shippingAddress.city.trim()) {
      errors.city = "City is required"
    }
    if (!shippingAddress.postalCode.trim()) {
      errors.postalCode = "Postal code is required"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleCheckout = async () => {
    if (!validateForm()) {
      toast.error("Please fix the errors in the form")
      return
    }

    setIsLoading(true)
    try {
      const result = await createCheckout({
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          price: appliedCoupon
            ? Number((item.price - (item.price * discount) / getTotal()).toFixed(2)) // ✅ discounted
            : item.price,
          originalPrice: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        customerEmail: customerInfo.email,
        customerName: customerInfo.name,
        shippingAddress,
        isGuestCheckout: !session?.user,
      })

      if (result.url) {
        window.location.href = result.url
      } else {
        throw new Error("Failed to create checkout session")
      }
    } catch (error) {
      console.error("Checkout error:", error)
      toast.error("Failed to proceed to checkout. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code")
      return
    }

    setIsApplying(true)
    try {
      const res = await fetch("/api/coupons/apply", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({code: couponCode, cartTotal: getTotal()}),
      })

      const data = await res.json()
      if (data.success) {
        setDiscount(data.discount)
        setAppliedCoupon(data.appliedCoupon)
        toast.success(`Coupon applied! You saved £${data.discount.toFixed(2)}`)
      } else {
        setDiscount(0)
        setAppliedCoupon(null)
        toast.error(data.message || "Invalid coupon")
      }
    } catch (err) {
      console.error("Coupon error:", err)
      toast.error("Something went wrong while applying coupon")
    } finally {
      setIsApplying(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link href="/shop" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Shop
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your purchase</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Name + Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="mb-1">
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo((prev) => ({...prev, name: e.target.value}))}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="mb-1">
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo((prev) => ({...prev, email: e.target.value}))}
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="phone" className="mb-1">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo((prev) => ({...prev, phone: e.target.value}))}
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <Label htmlFor="notes" className="mb-1">
                    Order Notes
                  </Label>
                  <Textarea
                    id="notes"
                    value={customerInfo.notes}
                    onChange={(e) => setCustomerInfo((prev) => ({...prev, notes: e.target.value}))}
                    placeholder="Any special instructions or notes..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Shipping */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Radio: saved vs new - only show for logged in users */}
                {session?.user && (
                  <div className="flex gap-6 mb-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="addressOption"
                        value="saved"
                        checked={useSaved === "saved"}
                        onChange={() => setUseSaved("saved")}
                        disabled={!(session?.user as any)?.address}
                      />
                      Use saved profile address
                      {!(session?.user as any)?.address && (
                        <span className="text-xs text-muted-foreground ml-2">(No saved address)</span>
                      )}
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="addressOption"
                        value="new"
                        checked={useSaved === "new"}
                        onChange={() => setUseSaved("new")}
                      />
                      Add new address
                    </label>
                  </div>
                )}

                {/* Address form */}
                <div>
                  <Label htmlFor="street" className="mb-1">
                    Street Address *
                  </Label>
                  <Input
                    id="street"
                    value={shippingAddress.street}
                    onChange={(e) => setShippingAddress((prev) => ({...prev, street: e.target.value}))}
                    placeholder="Enter your street address"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city" className="mb-1">
                      City *
                    </Label>
                    <Input
                      id="city"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress((prev) => ({...prev, city: e.target.value}))}
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state" className="mb-1">
                      State
                    </Label>
                    <Input
                      id="state"
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress((prev) => ({...prev, state: e.target.value}))}
                      placeholder="State"
                    />
                  </div>
                  <div>
                    <Label htmlFor="postalCode" className="mb-1">
                      Postal Code *
                    </Label>
                    <Input
                      id="postalCode"
                      value={shippingAddress.postalCode}
                      onChange={(e) => setShippingAddress((prev) => ({...prev, postalCode: e.target.value}))}
                      placeholder="Postal Code"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="country" className="mb-1">
                    Country
                  </Label>
                  <Input
                    id="country"
                    value={shippingAddress.country}
                    onChange={(e) => setShippingAddress((prev) => ({...prev, country: e.target.value}))}
                    placeholder="Country"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>

              <CardContent>
                {items.map((item) => {
                  // calculate discounted price per item if coupon applied
                  const discountedItemPrice = appliedCoupon
                    ? (item.price * (getTotal() - discount)) / getTotal()
                    : item.price

                  return (
                    <div key={`${item.id}-${item.color || ""}-${item.size || ""}`} className="flex gap-3 mb-3">
                      <Image src={item.image} alt={item.name} width={60} height={60} className="rounded-lg border" />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <p className="text-sm">
                          {appliedCoupon ? (
                            <>
                              <span className="line-through text-gray-500 mr-2">£{item.price.toFixed(2)}</span>
                              <span className="text-green-600 font-medium">
                                £{discountedItemPrice.toFixed(2)}
                              </span> × {item.quantity}
                            </>
                          ) : (
                            <>
                              £{item.price.toFixed(2)} × {item.quantity}
                            </>
                          )}
                        </p>
                      </div>
                      <p className="font-medium">
                        {appliedCoupon ? (
                          <>
                            <span className="line-through text-gray-500 mr-2">
                              £{(item.price * item.quantity).toFixed(2)}
                            </span>
                            <span className="text-green-600 font-medium">
                              £{(discountedItemPrice * item.quantity).toFixed(2)}
                            </span>
                          </>
                        ) : (
                          <>£{(item.price * item.quantity).toFixed(2)}</>
                        )}
                      </p>
                    </div>
                  )
                })}

                <Separator className="my-4" />

                {/* Coupon Input */}
                <div className="flex gap-2 mb-4">
                  <Input
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  />
                  <Button onClick={applyCoupon} disabled={isApplying}>
                    {isApplying ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
                  </Button>
                </div>

                {/* Applied Coupon */}
                {appliedCoupon && (
                  <div className="flex justify-between text-green-600 font-medium mb-2">
                    <span>Coupon ({appliedCoupon})</span>
                    <span>-£{discount.toFixed(2)}</span>
                  </div>
                )}

                {/* Totals */}
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>£{(getTotal() - discount).toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    You&apos;ll be redirected to Stripe to complete your payment securely.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Button
              variant="default"
              size="lg"
              className="w-full font-semibold py-4 text-lg rounded-lg cursor-pointer"
              onClick={handleCheckout}
              disabled={isLoading}>
              {isLoading ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : <CreditCard className="h-5 w-5 mr-2" />}
              {/* {isLoading ? "Processing..." : `Pay £${ (getTotal() - discount).toFixed(2) }`} */}
              {isLoading ? (
                "Processing..."
              ) : appliedCoupon ? (
                <>
                  Pay <span className="line-through text-gray-400 mr-2">£{getTotal().toFixed(2)}</span>
                  <span className="text-white">£{(getTotal() - discount).toFixed(2)}</span>
                </>
              ) : (
                `Pay £${getTotal().toFixed(2)}`
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
