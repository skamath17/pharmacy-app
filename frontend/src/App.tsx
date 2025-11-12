import { Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import Layout from '@/components/layout/Layout'
import HomePage from '@/pages/HomePage'
import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'
import DashboardPage from '@/pages/patient/DashboardPage'
import PatientProfilePage from '@/pages/patient/PatientProfilePage'
import CreatePatientProfilePage from '@/pages/patient/CreatePatientProfilePage'
import PrescriptionsPage from '@/pages/patient/PrescriptionsPage'
import PrescriptionUploadPage from '@/pages/patient/PrescriptionUploadPage'
import CatalogPage from '@/pages/catalog/CatalogPage'
import MedicineDetailsPage from '@/pages/catalog/MedicineDetailsPage'
import CartPage from '@/pages/CartPage'
import CheckoutPage from '@/pages/CheckoutPage'
import OrdersPage from '@/pages/patient/OrdersPage'
import OrderConfirmationPage from '@/pages/patient/OrderConfirmationPage'
import OrderTrackingPage from '@/pages/patient/OrderTrackingPage'
import PharmacistDashboardPage from '@/pages/pharmacist/DashboardPage'
import ProtectedRoute from '@/components/auth/ProtectedRoute'

function App() {
  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="catalog" element={<CatalogPage />} />
          <Route path="catalog/medicines/:id" element={<MedicineDetailsPage />} />
        </Route>

        {/* Patient routes */}
        <Route
          path="/patient"
          element={
            <ProtectedRoute requiredRole="PATIENT">
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="profile" element={<PatientProfilePage />} />
          <Route path="profile/create" element={<CreatePatientProfilePage />} />
          <Route path="prescriptions" element={<PrescriptionsPage />} />
          <Route path="prescription/upload" element={<PrescriptionUploadPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="orders/:orderId/confirmation" element={<OrderConfirmationPage />} />
          <Route path="orders/:orderId/track" element={<OrderTrackingPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
        </Route>

        {/* Pharmacist routes */}
        <Route
          path="/pharmacist"
          element={
            <ProtectedRoute requiredRole="PHARMACIST">
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<PharmacistDashboardPage />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  )
}

export default App

