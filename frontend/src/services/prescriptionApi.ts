import { prescriptionApi } from '@/lib/api'

export interface Prescription {
  id: string
  patientId: string
  prescriptionType: 'UPLOADED' | 'ERX' | 'MANUAL'
  fileUrl?: string
  fileType?: string
  status: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'EXPIRED'
  verifiedBy?: string
  verifiedAt?: string
  rejectionReason?: string
  expiresAt?: string
  createdAt: string
  updatedAt: string
}

export const prescriptionService = {
  uploadPrescription: async (file: File): Promise<Prescription> => {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await prescriptionApi.post('/prescriptions/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data.data || response.data
  },

  getMyPrescriptions: async (): Promise<Prescription[]> => {
    const response = await prescriptionApi.get('/prescriptions')
    return response.data.data || response.data
  },

  getPrescription: async (id: string): Promise<Prescription> => {
    const response = await prescriptionApi.get(`/prescriptions/${id}`)
    return response.data.data || response.data
  },

  deletePrescription: async (id: string): Promise<void> => {
    await prescriptionApi.delete(`/prescriptions/${id}`)
  },

  streamFile: async (fileUrl: string): Promise<Blob> => {
    const response = await prescriptionApi.post('/prescriptions/file', { url: fileUrl }, {
      responseType: 'blob',
    })
    return response.data
  },
}

