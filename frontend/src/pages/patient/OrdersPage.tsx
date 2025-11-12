import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { orderService, Order } from '@/services/orderApi'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, CheckCircle, Clock, XCircle, Truck, ArrowRight } from 'lucide-react'

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await orderService.getMyOrders()
      setOrders(data)
    } catch (err: any) {
      setError('Failed to load orders')
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case 'DELIVERED':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'SHIPPED':
      case 'PROCESSING':
        return <Truck className="w-5 h-5 text-blue-600" />
      case 'CANCELLED':
      case 'REFUNDED':
        return <XCircle className="w-5 h-5 text-red-600" />
      default:
        return <Clock className="w-5 h-5 text-yellow-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'DELIVERED':
        return 'bg-green-100 text-green-800'
      case 'SHIPPED':
      case 'PROCESSING':
      case 'VERIFIED':
        return 'bg-blue-100 text-blue-800'
      case 'CANCELLED':
      case 'REFUNDED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PAID':
        return 'bg-green-100 text-green-800'
      case 'FAILED':
        return 'bg-red-100 text-red-800'
      case 'REFUNDED':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">Loading orders...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <p className="text-destructive mb-4">{error}</p>
              <Button onClick={loadOrders}>Try Again</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">My Orders</h1>
        <p className="text-gray-600">View and track your order history</p>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Orders Yet</h3>
              <p className="text-gray-600 mb-4">Start shopping to see your orders here</p>
              <Link to="/catalog">
                <Button>Browse Medicines</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  {/* Order Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-1">
                          Order #{order.orderNumber}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Placed on {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>

                    {/* Order Items Summary */}
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </p>
                      <div className="space-y-1">
                        {order.items.slice(0, 3).map((item) => (
                          <div key={item.id} className="flex items-center gap-2 text-sm">
                            <Package className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-700">
                              {item.medicineName} × {item.quantity}
                            </span>
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <p className="text-sm text-gray-500 ml-6">
                            +{order.items.length - 3} more item{order.items.length - 3 !== 1 ? 's' : ''}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Payment Status */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Payment:</span>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(
                          order.paymentStatus
                        )}`}
                      >
                        {order.paymentStatus}
                      </span>
                    </div>
                  </div>

                  {/* Order Total & Actions */}
                  <div className="md:text-right">
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                      <p className="text-2xl font-bold">{formatPrice(order.totalAmount)}</p>
                      {order.discountAmount > 0 && (
                        <p className="text-sm text-green-600">
                          Saved {formatPrice(order.discountAmount)}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Link to={`/patient/orders/${order.id}/confirmation`}>
                        <Button variant="outline" className="w-full md:w-auto">
                          View Details
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                      {order.status === 'SHIPPED' && order.trackingNumber && (
                        <Link to={`/patient/orders/${order.id}/track`}>
                          <Button variant="outline" className="w-full md:w-auto">
                            Track Order
                          </Button>
                        </Link>
                      )}
                    </div>
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
