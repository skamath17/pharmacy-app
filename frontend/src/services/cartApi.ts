import { cartApi } from '@/lib/api'

export interface CartItem {
  id: string
  medicineId: string
  medicineName: string
  medicineImageUrl?: string
  quantity: number
  unitPrice: number
  discountPercentage: number
  totalPrice: number
  inStock: boolean
}

export interface Cart {
  id: string
  patientId: string
  items: CartItem[]
  subtotal: number
  totalDiscount: number
  total: number
  itemCount: number
  createdAt: string
  updatedAt: string
}

export interface AddToCartRequest {
  medicineId: string
  quantity: number
}

export interface UpdateCartItemRequest {
  quantity: number
}

export const cartService = {
  getCart: async (): Promise<Cart> => {
    const response = await cartApi.get('/cart')
    return response.data.data || response.data
  },

  addToCart: async (request: AddToCartRequest): Promise<Cart> => {
    const response = await cartApi.post('/cart/items', request)
    return response.data.data || response.data
  },

  updateCartItem: async (itemId: string, request: UpdateCartItemRequest): Promise<Cart> => {
    const response = await cartApi.put(`/cart/items/${itemId}`, request)
    return response.data.data || response.data
  },

  removeFromCart: async (itemId: string): Promise<Cart> => {
    const response = await cartApi.delete(`/cart/items/${itemId}`)
    return response.data.data || response.data
  },

  clearCart: async (): Promise<void> => {
    await cartApi.delete('/cart')
  },
}


