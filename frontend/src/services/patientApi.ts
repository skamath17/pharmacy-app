import { patientApi as api } from '@/lib/api'

export interface Patient {
  id: string
  userId: string
  firstName: string
  lastName: string
  dateOfBirth?: string
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY'
  addressLine1?: string
  addressLine2?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
  emergencyContactName?: string
  emergencyContactPhone?: string
  allergies?: string[]
  medicalConditions?: string[]
}

export interface CreatePatientRequest {
  firstName: string
  lastName: string
  dateOfBirth?: string
  gender?: string
  addressLine1?: string
  addressLine2?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
  emergencyContactName?: string
  emergencyContactPhone?: string
  allergies?: string[]
  medicalConditions?: string[]
}

export interface UpdatePatientRequest {
  firstName?: string
  lastName?: string
  dateOfBirth?: string
  gender?: string
  addressLine1?: string
  addressLine2?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
  emergencyContactName?: string
  emergencyContactPhone?: string
  allergies?: string[]
  medicalConditions?: string[]
}

export const patientService = {
  getProfile: async (): Promise<Patient> => {
    const response = await api.get('/patients/me')
    return response.data.data || response.data
  },

  createProfile: async (data: CreatePatientRequest): Promise<Patient> => {
    const response = await api.post('/patients', data)
    return response.data.data || response.data
  },

  updateProfile: async (data: UpdatePatientRequest): Promise<Patient> => {
    const response = await api.put('/patients/me', data)
    return response.data.data || response.data
  },
}

