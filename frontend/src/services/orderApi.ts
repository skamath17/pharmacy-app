import { orderApi } from '@/lib/api'

export interface OrderItem {
  id: string
  medicineId: string
  medicineName: string
  medicineImageUrl?: string
  inventoryId?: string
  prescriptionItemId?: string
  quantity: number
  unitPrice: number
  discountPercentage: number
  totalPrice: number
  createdAt: string
}

export interface Order {
  id: string
  orderNumber: string
  patientId: string
  prescriptionId?: string
  status: string
  subtotal: number
  discountAmount: number
  taxAmount: number
  shippingCharges: number
  totalAmount: number
  paymentStatus: string
  paymentMethod?: string
  paymentTransactionId?: string
  shippingAddress: string // JSON string
  verifiedBy?: string
  verifiedAt?: string
  shippedAt?: string
  deliveredAt?: string
  trackingNumber?: string
  courierName?: string
  items: OrderItem[]
  createdAt: string
  updatedAt: string
}

export interface CreateOrderRequest {
  shippingAddress: string // JSON string
}

export const orderService = {
  createOrder: async (request: CreateOrderRequest): Promise<Order> => {
    const response = await orderApi.post('/orders', request)
    return response.data.data || response.data
  },

  getMyOrders: async (): Promise<Order[]> => {
    const response = await orderApi.get('/orders')
    return response.data.data || response.data
  },

  getOrderById: async (orderId: string): Promise<Order> => {
    const response = await orderApi.get(`/orders/${orderId}`)
    return response.data.data || response.data
  },
}


