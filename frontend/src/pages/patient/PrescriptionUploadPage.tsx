import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { prescriptionService } from '@/services/prescriptionApi'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react'

export default function PrescriptionUploadPage() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
      if (!validTypes.includes(file.type)) {
        setError('Please select a valid image (JPEG, PNG) or PDF file')
        return
      }
      
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB')
        return
      }
      
      setSelectedFile(file)
      setError(null)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file')
      return
    }

    setIsUploading(true)
    setError(null)
    setSuccess(false)

    try {
      await prescriptionService.uploadPrescription(selectedFile)
      setSuccess(true)
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      
      // Redirect to prescriptions list after 2 seconds
      setTimeout(() => {
        navigate('/patient/prescriptions')
      }, 2000)
    } catch (err: any) {
      console.error('Upload error:', err)
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to upload prescription. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Upload Prescription</h1>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload Your Prescription
            </CardTitle>
            <CardDescription>
              Upload a scanned image or PDF of your prescription. Accepted formats: JPEG, PNG, PDF (Max 10MB)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 text-green-800 text-sm p-3 rounded-md flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Prescription uploaded successfully! Redirecting...
              </div>
            )}

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,application/pdf"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              
              {!selectedFile ? (
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-lg font-medium mb-2">Click to select a file</p>
                  <p className="text-sm text-gray-500">or drag and drop</p>
                  <p className="text-xs text-gray-400 mt-2">JPEG, PNG, PDF (Max 10MB)</p>
                </label>
              ) : (
                <div className="space-y-4">
                  <FileText className="w-12 h-12 mx-auto text-primary mb-4" />
                  <div>
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-gray-500">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleRemoveFile}
                    className="mt-4"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Remove File
                  </Button>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <Button
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
                className="flex-1"
              >
                {isUploading ? 'Uploading...' : 'Upload Prescription'}
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/patient/dashboard')}
              >
                Cancel
              </Button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Tips for uploading:</h3>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>Ensure the prescription is clearly visible</li>
                <li>Make sure all text is readable</li>
                <li>Include doctor's signature and date</li>
                <li>Check that the prescription hasn't expired</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
