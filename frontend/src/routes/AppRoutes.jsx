import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import PublicLayout from '../components/layout/PublicLayout';
import AdminLayout from '../components/layout/AdminLayout';
import ProtectedRoute from './ProtectedRoute';
import Loader from '../components/common/Loader';

// Lazy load all pages for better performance
const Home = lazy(() => import('../pages/public/Home'));
const Products = lazy(() => import('../pages/public/Products'));
const ProductDetail = lazy(() => import('../pages/public/ProductDetail'));
const News = lazy(() => import('../pages/public/News'));
const OrderTracking = lazy(() => import('../pages/public/OrderTracking'));
const OrderPlacement = lazy(() => import('../pages/public/OrderPlacement'));

// Payment Pages
const PaymentInitialization = lazy(() => import('../pages/payment/PaymentInitialization'));
const PaymentSuccess = lazy(() => import('../pages/payment/PaymentSuccess'));
const PaymentFailed = lazy(() => import('../pages/payment/PaymentFailed'));
const PaymentPending = lazy(() => import('../pages/payment/PaymentPending'));

// Auth Pages
const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/Register'));

// Admin Pages
const Dashboard = lazy(() => import('../pages/admin/Dashboard'));
const Analytics = lazy(() => import('../pages/admin/Analytics'));
const Stock = lazy(() => import('../pages/admin/Stock'));
const Production = lazy(() => import('../pages/admin/Production'));
const Orders = lazy(() => import('../pages/admin/Orders'));
const Payments = lazy(() => import('../pages/admin/Payments'));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
    <Loader size="large" text="Loading..." />
  </div>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:id" element={<ProductDetail />} />
          <Route path="news" element={<News />} />
          <Route path="order/:productId" element={<OrderPlacement />} />
          <Route path="order-tracking" element={<OrderTracking />} />
          
          {/* Payment Routes */}
          <Route path="payment/initialize" element={<PaymentInitialization />} />
          <Route path="payment/success" element={<PaymentSuccess />} />
          <Route path="payment/failed" element={<PaymentFailed />} />
          <Route path="payment/pending" element={<PaymentPending />} />
        </Route>

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {/* Redirect /admin to /admin/dashboard */}
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          
          {/* Admin routes - accessible by both admin and super_admin */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="stock" element={<Stock />} />
          <Route path="production" element={<Production />} />
          <Route path="orders" element={<Orders />} />
          
          {/* Super Admin only routes */}
          <Route 
            path="payments" 
            element={
              <ProtectedRoute requiredRole="super_admin">
                <Payments />
              </ProtectedRoute>
            } 
          />
        </Route>

        {/* 404 Page */}
        <Route path="/404" element={
          <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-slate-900 dark:text-slate-100 mb-4">404</h1>
              <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">Page not found</p>
              <button 
                onClick={() => window.history.back()}
                className="bg-cyan-400 hover:bg-cyan-500 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
              >
                Go Back
              </button>
            </div>
          </div>
        } />

        {/* Catch all route - redirect to 404 */}
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;