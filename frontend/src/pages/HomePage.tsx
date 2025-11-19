import { Link } from 'react-router-dom'
import { Upload, Search, Package } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  const { user } = useAuthStore()

  const features = [
    {
      title: 'Upload Prescription',
      description: 'Upload your prescription and get medicines delivered to your door',
      icon: Upload,
      link: user ? '/patient/prescription/upload' : '/login',
      color: 'bg-blue-50 hover:bg-blue-100 border-blue-200',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Browse Catalog',
      description: 'Search and order from our wide range of medicines',
      icon: Search,
      link: '/catalog',
      color: 'bg-green-50 hover:bg-green-100 border-green-200',
      iconColor: 'text-green-600',
    },
    {
      title: 'Track Orders',
      description: 'Real-time tracking of your orders from verification to delivery',
      icon: Package,
      link: user && user.role === 'PATIENT' ? '/patient/orders' : '/login',
      color: 'bg-purple-50 hover:bg-purple-100 border-purple-200',
      iconColor: 'text-purple-600',
    },
  ]

  return (
    <div className="min-h-[calc(100vh-200px)]">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-green-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Welcome to PharmacyApp
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              Your trusted online pharmacy for prescription medicines
            </p>
            {!user && (
              <div className="flex gap-4 justify-center">
                <Link to="/register">
                  <Button size="lg" className="text-lg px-8">
                    Get Started
                  </Button>
                </Link>
                <Link to="/catalog">
                  <Button size="lg" variant="outline" className="text-lg px-8">
                    Browse Medicines
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Link
                  key={index}
                  to={feature.link}
                  className={`group relative p-8 border-2 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${feature.color}`}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className={`mb-4 p-4 rounded-full bg-white shadow-md group-hover:shadow-lg transition-shadow ${feature.iconColor}`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-gray-800 group-hover:text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                    <div className="mt-4 text-sm font-semibold text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                      Click to explore →
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* Additional Info Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">
              Why Choose PharmacyApp?
            </h2>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="p-6">
                <div className="text-4xl mb-4">🏥</div>
                <h3 className="text-xl font-semibold mb-2">Verified Prescriptions</h3>
                <p className="text-gray-600">
                  All prescriptions are verified by licensed pharmacists
                </p>
              </div>
              <div className="p-6">
                <div className="text-4xl mb-4">🚚</div>
                <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
                <p className="text-gray-600">
                  Quick and secure delivery to your doorstep
                </p>
              </div>
              <div className="p-6">
                <div className="text-4xl mb-4">💊</div>
                <h3 className="text-xl font-semibold mb-2">Wide Selection</h3>
                <p className="text-gray-600">
                  Extensive catalog of medicines and health products
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


