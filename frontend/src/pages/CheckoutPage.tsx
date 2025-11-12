import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { useCartStore } from '@/stores/cartStore'
import { orderService, CreateOrderRequest } from '@/services/orderApi'
import { patientService, Patient } from '@/services/patientApi'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, CreditCard, MapPin } from 'lucide-react'

const shippingAddressSchema = z.object({
  addressLine1: z.string().min(1, 'Address line 1 is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  country: z.string().min(1, 'Country is required'),
})

type ShippingAddressFormData = z.infer<typeof shippingAddressSchema>

export default function CheckoutPage() {
  const { cart, setCart } = useCartStore()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [patient, setPatient] = useState<Patient | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ShippingAddressFormData>({
    resolver: zodResolver(shippingAddressSchema),
  })

  useEffect(() => {
    // Load patient profile to pre-fill address
    loadPatientProfile()
  }, [])

  const loadPatientProfile = async () => {
    try {
      const profile = await patientService.getProfile()
      setPatient(profile)
      // Pre-fill form with patient address if available
      if (profile.addressLine1) {
        reset({
          addressLine1: profile.addressLine1 || '',
          addressLine2: profile.addressLine2 || '',
          city: profile.city || '',
          state: profile.state || '',
          postalCode: profile.postalCode || '',
          country: profile.country || 'India',
        })
      }
    } catch (err) {
      // Ignore errors - user can still enter address manually
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(price)
  }

  const onSubmit = async (data: ShippingAddressFormData) => {
    if (!cart || cart.items.length === 0) {
      setError('Your cart is empty')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Convert address to JSON string
      const shippingAddress = JSON.stringify({
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        country: data.country,
      })

      const request: CreateOrderRequest = {
        shippingAddress,
      }

      const order = await orderService.createOrder(request)

      // Clear cart after successful order
      setCart(null)

      // Navigate to order confirmation page
      navigate(`/patient/orders/${order.id}/confirmation`)
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to create order. Please try again.')
      console.error('Order creation error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <p className="mb-4">Your cart is empty</p>
              <Link to="/catalog">
                <Button>Browse Medicines</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/patient/cart" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Cart
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Shipping Address Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Shipping Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                  {error}
                </div>
              )}

              <div>
                <Label htmlFor="addressLine1">Address Line 1 *</Label>
                <Input
                  id="addressLine1"
                  {...register('addressLine1')}
                  placeholder="Street address, P.O. box"
                />
                {errors.addressLine1 && (
                  <p className="text-sm text-destructive mt-1">{errors.addressLine1.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="addressLine2">Address Line 2</Label>
                <Input
                  id="addressLine2"
                  {...register('addressLine2')}
                  placeholder="Apartment, suite, unit, building, floor, etc."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input id="city" {...register('city')} placeholder="City" />
                  {errors.city && (
                    <p className="text-sm text-destructive mt-1">{errors.city.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="state">State *</Label>
                  <Input id="state" {...register('state')} placeholder="State" />
                  {errors.state && (
                    <p className="text-sm text-destructive mt-1">{errors.state.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="postalCode">Postal Code *</Label>
                  <Input id="postalCode" {...register('postalCode')} placeholder="Postal code" />
                  {errors.postalCode && (
                    <p className="text-sm text-destructive mt-1">{errors.postalCode.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="country">Country *</Label>
                  <Input id="country" {...register('country')} placeholder="Country" defaultValue="India" />
                  {errors.country && (
                    <p className="text-sm text-destructive mt-1">{errors.country.message}</p>
                  )}
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                <CreditCard className="w-5 h-5 mr-2" />
                {isLoading ? 'Placing Order...' : 'Place Order'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <div>
                    <p className="font-medium">{item.medicineName}</p>
                    <p className="text-sm text-gray-600">
                      {item.quantity} × {formatPrice(item.unitPrice)}
                    </p>
                  </div>
                  <p className="font-medium">{formatPrice(item.totalPrice)}</p>
                </div>
              ))}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(cart.subtotal)}</span>
                </div>
                {cart.totalDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatPrice(cart.totalDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Tax</span>
                  <span>Calculated at payment</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Shipping</span>
                  <span>Calculated at payment</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{formatPrice(cart.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
