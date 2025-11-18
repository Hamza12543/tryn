"use client"
import {ShoppingCart} from "lucide-react"
import {useCartStore} from "@/store/cart-store"
import {Button} from "@/components/ui/button"
import {Badge} from "@/components/ui/badge"
import {useState, useEffect} from "react"
import CartSheet from "./CartSheet"

export default function CartButton() {
  const getCount = useCartStore((s) => s.getCount())
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="relative h-10 w-10 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group"
        onClick={() => setOpen(true)}
      >
        <ShoppingCart className="h-5 w-5 transition-transform group-hover:scale-110" />
        {mounted && getCount > 0 && (
          <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 hover:bg-red-600 text-white text-xs font-bold p-0 flex items-center justify-center border-2 border-white shadow-lg animate-pulse">
            {getCount > 99 ? "99+" : getCount}
          </Badge>
        )}
        <span className="sr-only">Cart</span>
      </Button>
      <CartSheet open={open} onOpenChange={setOpen} />
    </>
  )
}
