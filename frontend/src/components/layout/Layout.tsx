import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { useCartStore } from '@/stores/cartStore'
import { Button } from '@/components/ui/button'
import { LogOut, User, ShoppingCart } from 'lucide-react'
import { useEffect } from 'react'
import { cartService } from '@/services/cartApi'

export default function Layout() {
  const { user, logout } = useAuthStore()
  // Subscribe to cart - Zustand will trigger re-render when cart changes
  const cart = useCartStore((state) => state.cart)
  const setCart = useCartStore((state) => state.setCart)
  const navigate = useNavigate()

  // Calculate item count - will update when cart changes
  const itemCount = cart?.itemCount ?? 0

  useEffect(() => {
    // Load cart when user is logged in
    if (user && user.role === 'PATIENT') {
      cartService.getCart().then(setCart).catch(() => {
        // Ignore errors - cart might not exist yet
      })
    }
  }, [user, setCart])

  const handleLogout = () => {
    logout()
    setCart(null) // Clear cart on logout
    navigate('/')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary">
            💊 PharmacyApp
          </Link>
          
          <nav className="flex items-center gap-4">
            <Link to="/catalog" className="hover:text-primary transition-colors">
              Medicines
            </Link>
            
            {user ? (
              <>
                {user.role === 'PATIENT' && (
                  <>
                    <Link to="/patient/dashboard" className="hover:text-primary transition-colors">
                      Dashboard
                    </Link>
                    <Link to="/patient/profile" className="hover:text-primary transition-colors">
                      Profile
                    </Link>
                    <Link to="/patient/cart" className="relative hover:text-primary transition-colors">
                      <ShoppingCart className="w-5 h-5" />
                      {itemCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {itemCount}
                        </span>
                      )}
                    </Link>
                  </>
                )}
                {user.role === 'PHARMACIST' && (
                  <Link to="/pharmacist/dashboard" className="hover:text-primary transition-colors">
                    Dashboard
                  </Link>
                )}
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="text-sm">{user.email}</span>
                </div>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/register">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t bg-gray-50 mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">About</h3>
              <p className="text-sm text-gray-600">
                Your trusted online pharmacy for prescription medicines and health products.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/catalog" className="text-gray-600 hover:text-primary">Medicines</Link></li>
                <li><Link to="/patient/orders" className="text-gray-600 hover:text-primary">My Orders</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>FAQs</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Refund Policy</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-gray-600">
            © 2025 PharmacyApp. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

