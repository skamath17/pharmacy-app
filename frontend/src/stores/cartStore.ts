import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Cart, CartItem } from '@/services/cartApi'

interface CartStore {
  cart: Cart | null
  isLoading: boolean
  setCart: (cart: Cart | null) => void
  setLoading: (loading: boolean) => void
  getItemCount: () => number
  getTotal: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: null,
      isLoading: false,
      setCart: (cart) => set({ cart }),
      setLoading: (loading) => set({ isLoading: loading }),
      getItemCount: () => {
        const cart = get().cart
        return cart?.itemCount || 0
      },
      getTotal: () => {
        const cart = get().cart
        return cart?.total || 0
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

