import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { patientService, Patient } from '@/services/patientApi'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { User, Upload, ShoppingCart, Package, AlertCircle } from 'lucide-react'

export default function DashboardPage() {
  const { user } = useAuthStore()
  const [patient, setPatient] = useState<Patient | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasProfile, setHasProfile] = useState(false)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      setIsLoading(true)
      const data = await patientService.getProfile()
      setPatient(data)
      setHasProfile(true)
    } catch (err: any) {
      if (err.response?.status === 404) {
        setHasProfile(false)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.email}!</h1>
        <p className="text-gray-600">Manage your prescriptions, orders, and health information</p>
      </div>

      {!hasProfile && !isLoading && (
        <Card className="mb-6 border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-yellow-600 mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold text-yellow-900 mb-2">Complete Your Profile</h3>
                <p className="text-yellow-800 mb-4">
                  Please complete your patient profile to access all features and place orders.
                </p>
                <Link to="/patient/profile/create">
                  <Button>Complete Profile</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link to="/patient/prescriptions">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Prescription
              </CardTitle>
              <CardDescription>Upload your prescription to order medicines</CardDescription>
            </CardHeader>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link to="/catalog">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Browse Medicines
              </CardTitle>
              <CardDescription>Search and browse our medicine catalog</CardDescription>
            </CardHeader>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link to="/patient/orders">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                My Orders
              </CardTitle>
              <CardDescription>View your order history and track deliveries</CardDescription>
            </CardHeader>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link to="/patient/profile">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                My Profile
              </CardTitle>
              <CardDescription>Manage your personal and medical information</CardDescription>
            </CardHeader>
          </Link>
        </Card>
      </div>

      {hasProfile && patient && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <span className="text-sm text-gray-600">Name:</span>{' '}
                <span className="font-medium">{patient.firstName} {patient.lastName}</span>
              </div>
              {patient.city && (
                <div>
                  <span className="text-sm text-gray-600">Location:</span>{' '}
                  <span className="font-medium">{patient.city}, {patient.state}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {patient.allergies && patient.allergies.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Allergies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {patient.allergies.map((allergy, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                    >
                      {allergy}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
