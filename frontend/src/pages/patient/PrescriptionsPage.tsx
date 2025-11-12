import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { prescriptionService, Prescription } from '@/services/prescriptionApi'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, FileText, CheckCircle, XCircle, Clock, Trash2 } from 'lucide-react'

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadPrescriptions()
  }, [])

  const loadPrescriptions = async () => {
    try {
      setIsLoading(true)
      const data = await prescriptionService.getMyPrescriptions()
      setPrescriptions(data)
    } catch (err: any) {
      setError('Failed to load prescriptions')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this prescription?')) {
      return
    }

    try {
      await prescriptionService.deletePrescription(id)
      setPrescriptions(prescriptions.filter(p => p.id !== id))
    } catch (err: any) {
      alert('Failed to delete prescription')
    }
  }

  const handleViewPrescription = async (fileUrl: string) => {
    try {
      console.log('Viewing prescription file from URL:', fileUrl)
      
      // Use POST with URL in body to avoid query string issues
      const blob = await prescriptionService.streamFile(fileUrl)
      
      // Create blob URL and open in new window
      const blobUrl = URL.createObjectURL(blob)
      const newWindow = window.open(blobUrl, '_blank')
      
      // Clean up blob URL after window closes
      if (newWindow) {
        newWindow.addEventListener('beforeunload', () => {
          URL.revokeObjectURL(blobUrl)
        })
      }
    } catch (err: any) {
      console.error('Error viewing prescription:', err)
      
      // Handle error response - read blob as text to get error message
      let errorMessage = 'Failed to view prescription'
      if (err.response?.data instanceof Blob) {
        try {
          const text = await err.response.data.text()
          const json = JSON.parse(text)
          errorMessage = json.message || json.error || errorMessage
          console.error('Backend error:', json)
        } catch (parseErr) {
          console.error('Could not parse error response:', parseErr)
        }
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message
      }
      
      alert(`Failed to view prescription: ${errorMessage}`)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'REJECTED':
        return <XCircle className="w-5 h-5 text-red-600" />
      case 'EXPIRED':
        return <XCircle className="w-5 h-5 text-gray-600" />
      default:
        return <Clock className="w-5 h-5 text-yellow-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return 'bg-green-100 text-green-800'
      case 'REJECTED':
        return 'bg-red-100 text-red-800'
      case 'EXPIRED':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">Loading prescriptions...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Prescriptions</h1>
        <Link to="/patient/prescription/upload">
          <Button>
            <Upload className="w-4 h-4 mr-2" />
            Upload Prescription
          </Button>
        </Link>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      {prescriptions.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Prescriptions Yet</h3>
              <p className="text-gray-600 mb-4">Upload your first prescription to get started</p>
              <Link to="/patient/prescription/upload">
                <Button>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Prescription
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {prescriptions.map((prescription) => (
            <Card key={prescription.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(prescription.status)}
                    <div>
                      <CardTitle className="text-lg">
                        Prescription #{prescription.id.substring(0, 8)}
                      </CardTitle>
                      <CardDescription>
                        Uploaded {new Date(prescription.createdAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </CardDescription>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(prescription.status)}`}>
                    {prescription.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Type</p>
                    <p className="font-medium">{prescription.prescriptionType}</p>
                  </div>
                  {prescription.expiresAt && (
                    <div>
                      <p className="text-sm text-gray-600">Expires</p>
                      <p className="font-medium">
                        {new Date(prescription.expiresAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  )}
                  {prescription.verifiedAt && (
                    <div>
                      <p className="text-sm text-gray-600">Verified</p>
                      <p className="font-medium">
                        {new Date(prescription.verifiedAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  )}
                  {prescription.rejectionReason && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600">Rejection Reason</p>
                      <p className="text-sm text-red-600">{prescription.rejectionReason}</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  {prescription.fileUrl && (
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleViewPrescription(prescription.fileUrl!)}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      View Prescription
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => handleDelete(prescription.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

