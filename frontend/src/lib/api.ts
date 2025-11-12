import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

// Base URLs for different services
const AUTH_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api'
const PATIENT_API_BASE_URL = import.meta.env.VITE_PATIENT_API_BASE_URL || 'http://localhost:8082/api'
const PRESCRIPTION_API_BASE_URL = import.meta.env.VITE_PRESCRIPTION_API_BASE_URL || 'http://localhost:8083/api'

export const api = axios.create({
  baseURL: AUTH_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Patient API instance - uses proxy path
export const patientApi = axios.create({
  baseURL: '/patient-api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Prescription API instance - uses proxy path
export const prescriptionApi = axios.create({
  baseURL: '/prescription-api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Catalog API instance - uses proxy path
export const catalogApi = axios.create({
  baseURL: '/catalog-api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Cart API instance - uses proxy path
export const cartApi = axios.create({
  baseURL: '/cart-api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Order API instance - uses proxy path
export const orderApi = axios.create({
  baseURL: '/order-api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Helper to extract user ID from JWT token
function getUserIdFromToken(): string | null {
  try {
    const token = localStorage.getItem('auth-storage')
    if (token) {
      const authData = JSON.parse(token)
      if (authData.state?.token) {
        const decoded: any = jwtDecode(authData.state.token)
        return decoded.userId || null
      }
    }
  } catch (e) {
    // Ignore errors
  }
  return null
}

// Request interceptor for auth API
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth-storage')
    if (token) {
      try {
        const authData = JSON.parse(token)
        if (authData.state?.token) {
          config.headers.Authorization = `Bearer ${authData.state.token}`
        }
      } catch (e) {
        // Ignore parsing errors
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Request interceptor for patient API
patientApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth-storage')
    if (token) {
      try {
        const authData = JSON.parse(token)
        if (authData.state?.token) {
          config.headers.Authorization = `Bearer ${authData.state.token}`
          
          // Extract and add user ID for patient service calls
          const userId = getUserIdFromToken()
          if (userId) {
            config.headers['X-User-Id'] = userId
          }
        }
      } catch (e) {
        // Ignore parsing errors
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Request interceptor for prescription API
prescriptionApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth-storage')
    if (token) {
      try {
        const authData = JSON.parse(token)
        if (authData.state?.token) {
          config.headers.Authorization = `Bearer ${authData.state.token}`
          
          // Extract and add user ID for prescription service calls
          const userId = getUserIdFromToken()
          if (userId) {
            config.headers['X-User-Id'] = userId
          }
        }
      } catch (e) {
        // Ignore parsing errors
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for both APIs
const responseInterceptor = (error: any) => {
  if (error.response?.status === 401) {
    // Handle unauthorized - clear auth and redirect
    localStorage.removeItem('auth-storage')
    window.location.href = '/login'
  }
  return Promise.reject(error)
}

// Don't apply response interceptor to blob responses for prescription API
api.interceptors.response.use(
  (response) => response,
  responseInterceptor
)

patientApi.interceptors.response.use(
  (response) => response,
  responseInterceptor
)

prescriptionApi.interceptors.response.use(
  (response) => {
    // For blob responses, return as-is without modification
    if (response.config.responseType === 'blob') {
      return response
    }
    return response
  },
  responseInterceptor
)

// Request interceptor for cart API
cartApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth-storage')
    if (token) {
      try {
        const authData = JSON.parse(token)
        if (authData.state?.token) {
          config.headers.Authorization = `Bearer ${authData.state.token}`
          
          // Extract and add user ID for cart service calls
          const userId = getUserIdFromToken()
          if (userId) {
            config.headers['X-User-Id'] = userId
          }
        }
      } catch (e) {
        // Ignore parsing errors
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

catalogApi.interceptors.response.use(
  (response) => response,
  responseInterceptor
)

cartApi.interceptors.response.use(
  (response) => response,
  responseInterceptor
)

// Request interceptor for order API
orderApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth-storage')
    if (token) {
      try {
        const authData = JSON.parse(token)
        if (authData.state?.token) {
          config.headers.Authorization = `Bearer ${authData.state.token}`
          
          // Extract and add user ID for order service calls
          const userId = getUserIdFromToken()
          if (userId) {
            config.headers['X-User-Id'] = userId
          }
        }
      } catch (e) {
        // Ignore parsing errors
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

orderApi.interceptors.response.use(
  (response) => response,
  responseInterceptor
)

