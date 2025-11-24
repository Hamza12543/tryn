"use client"

import {useState} from "react"
import {Star, Minus, Plus, Truck, RotateCcw, Check} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Badge} from "@/components/ui/badge"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group"
import {useCartStore} from "@/store/cart-store"
import Image from "next/image"
import {toast} from "sonner"

export default function ProductClientSection({
  product,
  colors,
  sizes,
}: {
  product: any
  colors: string[]
  sizes: string[]
}) {
  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState(colors[0] || "")
  const [selectedSize, setSelectedSize] = useState(sizes[0] || "")
  const [length, setLength] = useState("")
  const [width, setWidth] = useState("")

  const addItem = useCartStore((s) => s.addItem)
  // Add a state to trigger cart sheet open
  const [cartOpen, setCartOpen] = useState(false)

  const calculateTiles = () => {
    if (length && width) {
      const area = Number.parseFloat(length) * Number.parseFloat(width)
      const tilesNeeded = Math.ceil(area / 0.25)
      return tilesNeeded
    }
    return 0
  }

  // Add to Cart handler
  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.discountedPrice || product.actualPrice,
      image: product.images?.[0] || "/placeholder.svg",
      quantity,
      color: selectedColor,
      size: selectedSize,
    })
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("cart:open"))
    }
    toast.success("Added to cart", {
      description: `${product.name} × ${quantity}`,
    })
  }

  return (
    <div className="space-y-3">
      <div>
        {product.hasDiscount && product.discountedPrice && (
          <Badge variant="destructive" className="mb-3 bg-red-500">
            SAVE {Math.round(100 - (product.discountedPrice / product.actualPrice) * 100)}%
          </Badge>
        )}
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl font-bold text-gray-900">£{product.discountedPrice || product.actualPrice}</span>
          {product.hasDiscount && product.discountedPrice && (
            <span className="text-xl text-gray-500 line-through">£{product.actualPrice}</span>
          )}
        </div>
        <p className="text-sm text-gray-600 mb-2">
          VAT included <span className="underline">Shipping calculated at checkout</span>
        </p>
        <div className="flex items-center gap-2 mb-4">
          <Check className="w-4 h-4 text-green-600" />
          <span className="text-sm text-green-600 font-medium">{product.inStock ? "In Stock" : "Out of Stock"}</span>
        </div>
        <div className="flex items-center gap-2 mb-6">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${star <= 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
              />
            ))}
          </div>
          <span className="text-sm font-medium">4.9</span>
          <span className="text-sm text-gray-600">| 190 Reviews</span>
        </div>
      </div>
      {/* Color Selection */}
      <div>
        <Label className="text-base font-medium mb-3 block">
          Color: <span className="capitalize">{selectedColor}</span>
        </Label>
        <div className="flex gap-2">
          {colors.map((color) => {
            const getColorClass = (colorName: string) => {
              switch (colorName.toLowerCase()) {
                case "midnight":
                  return "bg-gray-900"
                case "black":
                  return "bg-black"
                case "purple":
                  return "bg-purple-600"
                case "dark":
                  return "bg-gray-800"
                case "light":
                  return "bg-gray-300"
                case "blue":
                  return "bg-blue-600"
                case "red":
                  return "bg-red-600"
                case "green":
                  return "bg-green-600"
                case "yellow":
                  return "bg-yellow-400"
                case "orange":
                  return "bg-orange-500"
                case "pink":
                  return "bg-pink-500"
                case "brown":
                  return "bg-amber-700"
                case "white":
                  return "bg-white border border-gray-300"
                default:
                  return "bg-gray-200"
              }
            }

            return (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-8 h-8 rounded border-2 ${selectedColor === color ? "border-gray-900" : "border-gray-300"} ${getColorClass(color)}`}
                title={color}
              />
            )
          })}
        </div>
      </div>
      {/* Set Size */}
      <div>
        <Label className="text-base font-medium mb-3 block">Set Size</Label>
        <RadioGroup value={selectedSize} onValueChange={setSelectedSize} className="flex gap-2">
          {sizes.map((size) => (
            <div className="flex items-center space-x-2" key={size}>
              <RadioGroupItem value={size} id={size} />
              <Label htmlFor={size} className="border border-gray-300 px-3 py-1 rounded text-sm cursor-pointer">
                {size}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      {/* Tile Calculator */}
      {product.dimensions?.length && product.dimensions?.width && (
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium mb-3">How Many Tiles Do You Need?</h3>
          <p className="text-sm text-gray-600 mb-3">Input the size of your space | Area Measurement (m²)</p>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div>
              <Label htmlFor="length" className="text-sm">
                Length
              </Label>
              <Input
                id="length"
                type="number"
                placeholder="0"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="mt-1 w-full"
              />
            </div>
            <div>
              <Label htmlFor="width" className="text-sm">
                Width
              </Label>
              <Input
                id="width"
                type="number"
                placeholder="0"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                className="mt-1 w-full"
              />
            </div>
            <div className="flex items-end">
              <Button className="w-full bg-gray-800 hover:bg-gray-900 text-white cursor-pointer">Calculate</Button>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            **The number of Mats is calculated by dividing the area of your room by the mat size (m²), adding 7% waste,
            and rounding up to the nearest whole number.**
          </p>
          {calculateTiles() > 0 && (
            <p className="text-sm text-gray-600 mt-2">You will need approximately {calculateTiles()} tiles.</p>
          )}
        </div>
      )}
      {/* Quantity and Add to Cart */}
      <div>
        <Label className="text-base font-medium mb-3 block">Quantity</Label>
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center border border-gray-300 rounded">
            <Button variant="ghost" size="sm" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3">
              <Minus className="w-4 h-4" />
            </Button>
            <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
            <Button variant="ghost" size="sm" onClick={() => setQuantity(quantity + 1)} className="px-3">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <Button onClick={handleAddToCart} disabled={!product.inStock} className="cursor-pointer">
            Add to Cart
          </Button>
        </div>
        {/* Payment Options */}
        <div className="flex items-center justify-start mb-4">
          <Image
            src="/images/payment-methods.svg"
            alt="Accepted payment methods: G Pay, Apple Pay, VISA, Mastercard, PayPal"
            width={400}
            height={50}
            className="h-12 w-auto"
          />
        </div>
        {/* Delivery Info */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4" />
            <span>Free* Standard Delivery - 2-3 working days</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 flex items-center justify-center">📅</span>
            <span>1-Day dispatch</span>
          </div>
          <div className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            <span>30 Day Returns</span>
          </div>
        </div>
        {/* Delivery Timeline */}
        <div className="flex justify-between items-start mt-6 p-4 bg-[#F2F0EC] rounded">
          <div className="text-center flex-1">
            <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-white text-xs mb-2 mx-auto">
              📦
            </div>
            <div className="text-xs font-medium">
              {new Date().toLocaleDateString("en-GB", {day: "numeric", month: "short"})}
            </div>
            <div className="text-xs text-gray-600">Order Placed</div>
          </div>
          <div className="flex-1 h-px bg-gray-300 mt-4"></div>
          <div className="text-center flex-1">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-xs mb-2 mx-auto">
              🚚
            </div>
            <div className="text-xs font-medium">
              {new Date().toLocaleDateString("en-GB", {day: "numeric", month: "short"})}-
              {new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString("en-GB", {day: "numeric", month: "short"})}
            </div>
            <div className="text-xs text-gray-600">Dispatched</div>
          </div>
          <div className="flex-1 h-px bg-gray-300 mt-4"></div>
          <div className="text-center flex-1">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-xs mb-2 mx-auto">
              📍
            </div>
            <div className="text-xs font-medium">
              {new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
              })}
              -
              {new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
              })}
            </div>
            <div className="text-xs text-gray-600">Delivered</div>
          </div>
        </div>
      </div>
    </div>
  )
}
