import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { catalogService, Medicine, MedicineSearchParams } from '@/services/catalogApi'
import { cartService } from '@/services/cartApi'
import { useCartStore } from '@/stores/cartStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Search, Package, Pill, ShoppingCart } from 'lucide-react'

export default function CatalogPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<MedicineSearchParams>({})
  const { setCart } = useCartStore()
  const [addingToCart, setAddingToCart] = useState<string | null>(null)

  useEffect(() => {
    const loadMedicines = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const params: MedicineSearchParams = {
          ...filters,
          ...(searchQuery && { search: searchQuery }),
        }
        const data = await catalogService.getAllMedicines(params)
        setMedicines(data)
      } catch (err: any) {
        setError('Failed to load medicines')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadMedicines()
  }, [filters, searchQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // The useEffect will automatically trigger when searchQuery changes
    // No need to manually call loadMedicines
  }

  const handleFilterChange = (key: keyof MedicineSearchParams, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === '' ? undefined : value,
    }))
  }

  const handleAddToCart = async (medicineId: string) => {
    if (!medicineId) return
    
    try {
      setAddingToCart(medicineId)
      const updatedCart = await cartService.addToCart({
        medicineId,
        quantity: 1,
      })
      setCart(updatedCart)
      alert('Added to cart!')
    } catch (err: any) {
      alert('Failed to add to cart')
      console.error(err)
    } finally {
      setAddingToCart(null)
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
        return <Pill className="w-5 h-5" />
      default:
        return <Package className="w-5 h-5" />
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">Loading medicines...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Medicine Catalog</h1>
        <p className="text-gray-600">Browse and search for medicines</p>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Search Medicines</Label>
                <div className="flex gap-2">
                  <Input
                    id="search"
                    placeholder="Search by name or generic name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit">
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="form">Form</Label>
                <select
                  id="form"
                  className="w-full px-3 py-2 border rounded-md"
                  value={filters.form || ''}
                  onChange={(e) => handleFilterChange('form', e.target.value)}
                >
                  <option value="">All Forms</option>
                  <option value="TABLET">Tablet</option>
                  <option value="CAPSULE">Capsule</option>
                  <option value="SYRUP">Syrup</option>
                  <option value="INJECTION">Injection</option>
                  <option value="CREAM">Cream</option>
                  <option value="DROPS">Drops</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <Label htmlFor="schedule">Schedule</Label>
                <select
                  id="schedule"
                  className="w-full px-3 py-2 border rounded-md"
                  value={filters.schedule || ''}
                  onChange={(e) => handleFilterChange('schedule', e.target.value)}
                >
                  <option value="">All Schedules</option>
                  <option value="H">H</option>
                  <option value="H1">H1</option>
                  <option value="X">X</option>
                  <option value="NONE">None</option>
                </select>
              </div>

              <div>
                <Label htmlFor="prescription">Prescription Required</Label>
                <select
                  id="prescription"
                  className="w-full px-3 py-2 border rounded-md"
                  value={filters.prescriptionRequired === undefined ? '' : filters.prescriptionRequired.toString()}
                  onChange={(e) => handleFilterChange('prescriptionRequired', e.target.value === 'true')}
                >
                  <option value="">All</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {error && (
        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      {/* Medicines Grid */}
      {medicines.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Medicines Found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {medicines.map((medicine) => (
            <Card key={medicine.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  {getFormIcon(medicine.form)}
                  {medicine.inStock ? (
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                      In Stock
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                      Out of Stock
                    </span>
                  )}
                </div>
                <CardTitle className="text-lg">{medicine.name}</CardTitle>
                {medicine.genericName && (
                  <CardDescription>{medicine.genericName}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="space-y-2 mb-4 flex-1">
                  {medicine.manufacturer && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Manufacturer:</span> {medicine.manufacturer}
                    </p>
                  )}
                  {medicine.strength && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Strength:</span> {medicine.strength}
                    </p>
                  )}
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Form:</span> {medicine.form}
                  </p>
                  {medicine.prescriptionRequired && (
                    <p className="text-xs text-orange-600">Prescription Required</p>
                  )}
                </div>

                <div className="border-t pt-4 space-y-2">
                  {medicine.minPrice > 0 ? (
                    <>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-primary">
                          {formatPrice(medicine.minPrice)}
                        </span>
                        {medicine.minMrp > medicine.minPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            {formatPrice(medicine.minMrp)}
                          </span>
                        )}
                      </div>
                      {medicine.maxDiscount > 0 && (
                        <p className="text-sm text-green-600">
                          {medicine.maxDiscount.toFixed(0)}% off
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-gray-500">Price not available</p>
                  )}
                  
                  <div className="flex gap-2">
                    <Button
                      className="flex-1"
                      disabled={!medicine.inStock || addingToCart === medicine.id}
                      onClick={() => handleAddToCart(medicine.id)}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {addingToCart === medicine.id ? 'Adding...' : 'Add to Cart'}
                    </Button>
                    <Link to={`/catalog/medicines/${medicine.id}`}>
                      <Button variant="outline" disabled={!medicine.inStock}>
                        View
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

