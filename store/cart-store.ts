import {create} from "zustand"
import {persist} from "zustand/middleware"

export type CartItem = {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  color?: string
  size?: string
}

type CartState = {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string, color?: string, size?: string) => void
  updateQuantity: (id: string, quantity: number, color?: string, size?: string) => void
  clearCart: () => void
  getTotal: () => number
  getCount: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id && i.color === item.color && i.size === item.size)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id && i.color === item.color && i.size === item.size
                  ? {...i, quantity: i.quantity + item.quantity}
                  : i
              ),
            }
          }
          return {items: [...state.items, item]}
        })
      },
      removeItem: (id, color, size) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.id === id && (color ? i.color === color : true) && (size ? i.size === size : true))
          ),
        }))
      },
      updateQuantity: (id, quantity, color, size) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id && (color ? i.color === color : true) && (size ? i.size === size : true) ? {...i, quantity} : i
          ),
        }))
      },
      clearCart: () => set({items: []}),
      getTotal: () => {
        return get().items.reduce((sum, i) => sum + i.price * i.quantity, 0)
      },
      getCount: () => {
        return get().items.reduce((sum, i) => sum + i.quantity, 0)
      },
    }),
    {
      name: "cart-store",
      partialize: (state) => ({items: state.items}),
    }
  )
)
