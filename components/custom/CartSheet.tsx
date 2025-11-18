"use client"
import {useCartStore} from "@/store/cart-store"
import {Sheet, SheetContent, SheetTitle} from "@/components/ui/sheet"
import {Button} from "@/components/ui/button"
import {Badge} from "@/components/ui/badge"
import {Separator} from "@/components/ui/separator"
import {Trash2, ShoppingBag, Minus, Plus, X, ArrowRight} from "lucide-react"
import Image from "next/image"
import {useSession} from "next-auth/react"
import {useRouter} from "next/navigation"

export default function CartSheet({open, onOpenChange}: {open: boolean; onOpenChange: (open: boolean) => void}) {
  const {items, removeItem, updateQuantity, clearCart, getTotal} = useCartStore()
  const {data: session} = useSession()
  const router = useRouter()

  const handleCheckout = () => {
    // Allow both guest and authenticated users to proceed to checkout
    router.push("/checkout")
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full max-w-md p-0 bg-white">
        <SheetTitle className="sr-only">Your Cart</SheetTitle>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <ShoppingBag className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Your Cart</h2>
                  <p className="text-sm text-gray-600">
                    {items.length} item{items.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={clearCart}
                className="bg-red-50 hover:bg-red-100 text-red-600 border-red-200 hover:border-red-300 transition-colors cursor-pointer"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <div className="p-4 bg-gray-100 rounded-full mb-4">
                  <ShoppingBag className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-500">Add some products to get started</p>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                {items.map((item) => (
                  <div
                    key={`${item.id}-${item.color || ""}-${item.size || ""}`}
                    className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex gap-4">
                      <div className="relative">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="rounded-lg object-cover border border-gray-100"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6 bg-white border border-gray-200 hover:bg-red-50 hover:border-red-200 rounded-full"
                          onClick={() => removeItem(item.id, item.color, item.size)}
                        >
                          <X className="h-3 w-3 text-gray-500 hover:text-red-500" />
                        </Button>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          {item.color && (
                            <Badge variant="secondary" className="text-xs">
                              {item.color}
                            </Badge>
                          )}
                          {item.size && (
                            <Badge variant="secondary" className="text-xs">
                              {item.size}
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-full cursor-pointer"
                              onClick={() =>
                                updateQuantity(item.id, Math.max(1, item.quantity - 1), item.color, item.size)
                              }
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="px-3 py-1 bg-gray-50 rounded-md text-sm font-medium min-w-[40px] text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-full cursor-pointer"
                              onClick={() => updateQuantity(item.id, item.quantity + 1, item.color, item.size)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-gray-900">£{(item.price * item.quantity).toFixed(2)}</div>
                            <div className="text-sm text-gray-500">£{item.price.toFixed(2)} each</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-gray-100 bg-gray-50">
              <div className="p-6">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">£{getTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-gray-900">£{getTotal().toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  variant="default"
                  size="lg"
                  className="w-full font-semibold cursor-pointer"
                  onClick={handleCheckout}
                >
                  <>
                    Proceed to Checkout
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                </Button>

                <p className="text-xs text-gray-500 text-center mt-3">Secure checkout powered by Stripe</p>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
