import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { cartService, Cart } from '@/services/cartApi'
import { useCartStore } from '@/stores/cartStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight } from 'lucide-react'

export default function CartPage() {
  const { cart, setCart, setLoading, isLoading } = useCartStore()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadCart()
  }, [])

  const loadCart = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await cartService.getCart()
      setCart(data)
    } catch (err: any) {
      setError('Failed to load cart')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemoveItem(itemId)
      return
    }

    try {
      const updatedCart = await cartService.updateCartItem(itemId, { quantity: newQuantity })
      setCart(updatedCart)
    } catch (err: any) {
      alert('Failed to update quantity')
      console.error(err)
    }
  }

  const handleRemoveItem = async (itemId: string) => {
    if (!confirm('Remove this item from cart?')) {
      return
    }

    try {
      const updatedCart = await cartService.removeFromCart(itemId)
      setCart(updatedCart)
    } catch (err: any) {
      alert('Failed to remove item')
      console.error(err)
    }
  }

  const handleClearCart = async () => {
    if (!confirm('Clear all items from cart?')) {
      return
    }

    try {
      await cartService.clearCart()
      setCart(null)
    } catch (err: any) {
      alert('Failed to clear cart')
      console.error(err)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(price)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">Loading cart...</div>
      </div>
    )
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
              <p className="text-gray-600 mb-4">Add some medicines to get started</p>
              <Link to="/catalog">
                <Button>
                  Browse Medicines
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        {cart.items.length > 0 && (
          <Button variant="outline" onClick={handleClearCart}>
            Clear Cart
          </Button>
        )}
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <Card key={item.id}>
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  {/* Medicine Image/Icon */}
                  <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    {item.medicineImageUrl ? (
                      <img
                        src={item.medicineImageUrl}
                        alt={item.medicineName}
                        className="w-full h-full object-contain rounded-lg"
                      />
                    ) : (
                      <ShoppingCart className="w-8 h-8 text-gray-400" />
                    )}
                  </div>

                  {/* Item Details */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{item.medicineName}</h3>
                    <div className="flex items-center gap-4 mb-3">
                      <div>
                        <span className="text-sm text-gray-600">Price: </span>
                        <span className="font-medium">{formatPrice(item.unitPrice)}</span>
                      </div>
                      {item.discountPercentage > 0 && (
                        <span className="text-sm text-green-600">
                          {item.discountPercentage.toFixed(0)}% off
                        </span>
                      )}
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => {
                            const newQty = parseInt(e.target.value) || 1
                            handleUpdateQuantity(item.id, newQty)
                          }}
                          className="w-16 text-center"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Total Price */}
                  <div className="text-right">
                    <p className="text-lg font-bold">{formatPrice(item.totalPrice)}</p>
                    <p className="text-sm text-gray-500">
                      {item.quantity} × {formatPrice(item.unitPrice)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
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
                  <span>Calculated at checkout</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{formatPrice(cart.total)}</span>
                  </div>
                </div>
              </div>

              <Link to="/patient/checkout" className="block">
                <Button className="w-full" size="lg">
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>

              <Link to="/catalog">
                <Button variant="outline" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
