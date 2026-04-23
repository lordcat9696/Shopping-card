import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Announce } from '@/components/layout/Announce'
import { Header } from '@/components/layout/Header'
import { Newsletter } from '@/components/layout/Newsletter'
import { Footer } from '@/components/layout/Footer'
import { ScrollToTop } from '@/components/layout/ScrollToTop'
import { Toaster } from '@/components/layout/Toaster'
import { HomePage } from '@/pages/HomePage'
import { ProductListPage } from '@/pages/ProductListPage'
import { ProductDetailPage } from '@/pages/ProductDetailPage'
import { CartPage } from '@/pages/CartPage'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { AccountPage } from '@/pages/AccountPage'
import { CheckoutPage } from '@/pages/CheckoutPage'
import { OrderConfirmPage } from '@/pages/OrderConfirmPage'
import { AdminLayout } from '@/pages/admin/AdminLayout'
import { OrdersAdminPage } from '@/pages/admin/OrdersAdminPage'
import { ProductsAdminPage } from '@/pages/admin/ProductsAdminPage'
import { UsersAdminPage } from '@/pages/admin/UsersAdminPage'
import { ReportsAdminPage } from '@/pages/admin/ReportsAdminPage'
import { InventoryAdminPage } from '@/pages/admin/InventoryAdminPage'
import { useAuthStore } from '@/store/auth'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, retry: 1 },
  },
})

function AuthBootstrap() {
  const hydrate = useAuthStore(s => s.hydrate)
  useEffect(() => { void hydrate() }, [hydrate])
  return null
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ScrollToTop />
        <AuthBootstrap />
        <Announce />
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/products/:slug" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders/:code" element={<OrderConfirmPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<OrdersAdminPage />} />
            <Route path="orders" element={<OrdersAdminPage />} />
            <Route path="reports" element={<ReportsAdminPage />} />
            <Route path="products" element={<ProductsAdminPage />} />
            <Route path="inventory" element={<InventoryAdminPage />} />
            <Route path="users" element={<UsersAdminPage />} />
          </Route>
          <Route path="*" element={<HomePage />} />
        </Routes>
        <Newsletter />
        <Footer />
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  )
}
