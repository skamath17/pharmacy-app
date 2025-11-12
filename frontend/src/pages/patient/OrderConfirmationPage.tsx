import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { orderService, Order } from '@/services/orderApi'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Package, ArrowRight, Home } from 'lucide-react'

export default function OrderConfirmationPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (orderId) {
      loadOrder()
    }
  }, [orderId])

  const loadOrder = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await orderService.getOrderById(orderId!)
      setOrder(data)
    } catch (err: any) {
      setError('Failed to load order details')
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

  const parseShippingAddress = (addressJson: string) => {
    try {
      return JSON.parse(addressJson)
    } catch {
      return {}
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">Loading order details...</div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <p className="text-destructive mb-4">{error || 'Order not found'}</p>
              <Link to="/patient/orders">
                <Button variant="outline">View My Orders</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const shippingAddress = parseShippingAddress(order.shippingAddress)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Success Message */}
        <Card className="mb-6 border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
              <div>
                <h2 className="text-2xl font-bold text-green-900">Order Placed Successfully!</h2>
                <p className="text-green-700 mt-1">
                  Your order <span className="font-semibold">{order.orderNumber}</span> has been placed.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <span className="text-sm text-gray-600">Order Number:</span>
                <p className="font-semibold">{order.orderNumber}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Status:</span>
                <p className="font-semibold capitalize">{order.status.toLowerCase()}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Payment Status:</span>
                <p className="font-semibold capitalize">{order.paymentStatus.toLowerCase()}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Order Date:</span>
                <p className="font-semibold">
                  {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Shipping Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 text-sm">
                {shippingAddress.addressLine1 && <p>{shippingAddress.addressLine1}</p>}
                {shippingAddress.addressLine2 && <p>{shippingAddress.addressLine2}</p>}
                <p>
                  {shippingAddress.city}
                  {shippingAddress.state && `, ${shippingAddress.state}`}
                  {shippingAddress.postalCode && ` ${shippingAddress.postalCode}`}
                </p>
                {shippingAddress.country && <p>{shippingAddress.country}</p>}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Items */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 pb-4 border-b last:border-0">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    {item.medicineImageUrl ? (
                      <img
                        src={item.medicineImageUrl}
                        alt={item.medicineName}
                        className="w-full h-full object-contain rounded-lg"
                      />
                    ) : (
                      <Package className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.medicineName}</h3>
                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity} × {formatPrice(item.unitPrice)}
                    </p>
                    {item.discountPercentage > 0 && (
                      <p className="text-sm text-green-600">
                        {item.discountPercentage.toFixed(0)}% discount applied
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatPrice(item.totalPrice)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-{formatPrice(order.discountAmount)}</span>
                </div>
              )}
              {order.taxAmount > 0 && (
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>{formatPrice(order.taxAmount)}</span>
                </div>
              )}
              {order.shippingCharges > 0 && (
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{formatPrice(order.shippingCharges)}</span>
                </div>
              )}
              <div className="border-t pt-2">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{formatPrice(order.totalAmount)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Link to="/patient/orders" className="flex-1">
            <Button variant="outline" className="w-full">
              View My Orders
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link to="/catalog" className="flex-1">
            <Button className="w-full">
              Continue Shopping
              <Home className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}


