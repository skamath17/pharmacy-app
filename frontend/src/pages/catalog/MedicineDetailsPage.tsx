import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { catalogService, Medicine } from '@/services/catalogApi'
import { cartService } from '@/services/cartApi'
import { useCartStore } from '@/stores/cartStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, ShoppingCart, Package, Pill } from 'lucide-react'

export default function MedicineDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const [medicine, setMedicine] = useState<Medicine | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { setCart } = useCartStore()
  const [addingToCart, setAddingToCart] = useState(false)

  useEffect(() => {
    if (id) {
      loadMedicine(id)
    }
  }, [id])

  const loadMedicine = async (medicineId: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await catalogService.getMedicineById(medicineId)
      setMedicine(data)
    } catch (err: any) {
      setError('Failed to load medicine details')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(price)
  }

  const getFormIcon = (form: string) => {
    switch (form) {
      case 'TABLET':
      case 'CAPSULE':
        return <Pill className="w-8 h-8" />
      default:
        return <Package className="w-8 h-8" />
    }
  }

  const handleAddToCart = async () => {
    if (!medicine || !medicine.inStock) return
    
    try {
      setAddingToCart(true)
      const updatedCart = await cartService.addToCart({
        medicineId: medicine.id,
        quantity: 1,
      })
      setCart(updatedCart)
      alert('Added to cart!')
    } catch (err: any) {
      alert('Failed to add to cart')
      console.error(err)
    } finally {
      setAddingToCart(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">Loading medicine details...</div>
      </div>
    )
  }

  if (error || !medicine) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <p className="text-destructive mb-4">{error || 'Medicine not found'}</p>
              <Link to="/catalog">
                <Button variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Catalog
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/catalog" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Catalog
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Medicine Image/Icon */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
              {medicine.imageUrl ? (
                <img
                  src={medicine.imageUrl}
                  alt={medicine.name}
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <div className="text-gray-400">
                  {getFormIcon(medicine.form)}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Medicine Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-3xl font-bold">{medicine.name}</h1>
              {medicine.inStock ? (
                <span className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full">
                  In Stock
                </span>
              ) : (
                <span className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded-full">
                  Out of Stock
                </span>
              )}
            </div>
            {medicine.genericName && (
              <p className="text-lg text-gray-600">{medicine.genericName}</p>
            )}
          </div>

          {/* Price */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent>
              {medicine.minPrice > 0 ? (
                <div className="space-y-2">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-primary">
                      {formatPrice(medicine.minPrice)}
                    </span>
                    {medicine.minMrp > medicine.minPrice && (
                      <span className="text-lg text-gray-500 line-through">
                        {formatPrice(medicine.minMrp)}
                      </span>
                    )}
                  </div>
                  {medicine.maxDiscount > 0 && (
                    <p className="text-lg text-green-600 font-medium">
                      {medicine.maxDiscount.toFixed(0)}% off
                    </p>
                  )}
                  {medicine.totalStock > 0 && (
                    <p className="text-sm text-gray-600">
                      {medicine.totalStock} units available
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">Price not available</p>
              )}
            </CardContent>
          </Card>

          {/* Details */}
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {medicine.manufacturer && (
                <div>
                  <span className="font-medium">Manufacturer:</span>{' '}
                  <span className="text-gray-600">{medicine.manufacturer}</span>
                </div>
              )}
              {medicine.strength && (
                <div>
                  <span className="font-medium">Strength:</span>{' '}
                  <span className="text-gray-600">{medicine.strength}</span>
                </div>
              )}
              <div>
                <span className="font-medium">Form:</span>{' '}
                <span className="text-gray-600">{medicine.form}</span>
              </div>
              {medicine.schedule && (
                <div>
                  <span className="font-medium">Schedule:</span>{' '}
                  <span className="text-gray-600">{medicine.schedule}</span>
                </div>
              )}
              <div>
                <span className="font-medium">Prescription Required:</span>{' '}
                <span className="text-gray-600">
                  {medicine.prescriptionRequired ? 'Yes' : 'No'}
                </span>
              </div>
              {medicine.description && (
                <div>
                  <span className="font-medium">Description:</span>
                  <p className="text-gray-600 mt-1">{medicine.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              className="flex-1"
              size="lg"
              disabled={!medicine.inStock || addingToCart}
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              {addingToCart ? 'Adding...' : medicine.inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

