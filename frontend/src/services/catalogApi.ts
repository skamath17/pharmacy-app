import { catalogApi } from '@/lib/api'

export interface Medicine {
  id: string
  name: string
  genericName?: string
  manufacturer?: string
  strength?: string
  form: 'TABLET' | 'CAPSULE' | 'SYRUP' | 'INJECTION' | 'CREAM' | 'DROPS' | 'OTHER'
  prescriptionRequired: boolean
  schedule?: 'H' | 'H1' | 'X' | 'NONE'
  description?: string
  imageUrl?: string
  status: 'ACTIVE' | 'INACTIVE' | 'DISCONTINUED'
  totalStock: number
  minPrice: number
  minMrp: number
  maxDiscount: number
  inStock: boolean
  createdAt: string
  updatedAt: string
}

export interface MedicineSearchParams {
  search?: string
  form?: string
  schedule?: string
  prescriptionRequired?: boolean
}

export const catalogService = {
  getAllMedicines: async (params?: MedicineSearchParams): Promise<Medicine[]> => {
    const response = await catalogApi.get('/catalog/medicines', { params })
    return response.data.data || response.data
  },

  getMedicineById: async (id: string): Promise<Medicine> => {
    const response = await catalogApi.get(`/catalog/medicines/${id}`)
    return response.data.data || response.data
  },

  searchMedicines: async (query: string): Promise<Medicine[]> => {
    const response = await catalogApi.get('/catalog/medicines/search', {
      params: { q: query },
    })
    return response.data.data || response.data
  },
}


