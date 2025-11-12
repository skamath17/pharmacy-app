// Placeholder pages - will be implemented fully

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to PharmacyApp</h1>
        <p className="text-xl text-gray-600">Your trusted online pharmacy for prescription medicines</p>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="p-6 border rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Upload Prescription</h3>
          <p className="text-gray-600">Upload your prescription and get medicines delivered to your door</p>
        </div>
        <div className="p-6 border rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Browse Catalog</h3>
          <p className="text-gray-600">Search and order from our wide range of medicines</p>
        </div>
        <div className="p-6 border rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Track Orders</h3>
          <p className="text-gray-600">Real-time tracking of your orders from verification to delivery</p>
        </div>
      </div>
    </div>
  )
}


