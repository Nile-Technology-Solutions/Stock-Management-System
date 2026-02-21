import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import PublicLayout from '../components/layout/PublicLayout';
import AdminLayout from '../components/layout/AdminLayout';
import SuperAdminLayout from '../components/layout/SuperAdminLayout';
import ProtectedRoute from './ProtectedRoute';
import PublicOnlyRoute from './PublicOnlyRoute';
import Loader from '../components/common/Loader';
import { ROLES } from '../utils/roleUtils';

// Lazy load all pages
const Home = lazy(() => import('../modules/public/Home'));
const Products = lazy(() => import('../modules/public/Products'));
const ProductDetail = lazy(() => import('../modules/public/ProductDetail'));
const NewsList = lazy(() => import('../modules/public/news/NewsListPage'));
const NewsDetail = lazy(() => import('../modules/public/news/NewsDetailPage'));
const OrderTracking = lazy(() => import('../modules/public/OrderTracking'));
const OrderPlacement = lazy(() => import('../modules/public/OrderPlacement'));

// Payment Pages
const PaymentInitialization = lazy(() => import('../pages/payment/PaymentInitialization'));
const PaymentSuccess = lazy(() => import('../pages/payment/PaymentSuccess'));
const PaymentFailed = lazy(() => import('../pages/payment/PaymentFailed'));
const PaymentPending = lazy(() => import('../pages/payment/PaymentPending'));

// Auth Pages
const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/Register'));

// Role-Specific Dashboards
const AdminDashboard = lazy(() => import('../modules/admin/dashboard/AdminDashboardPage'));
const SuperAdminDashboard = lazy(() => import('../modules/superAdmin/dashboard/SuperAdminDashboardPage'));

// Modularized Core/Admin Pages
const Analytics = lazy(() => import('../modules/core/analytics/AnalyticsPage'));
const Stock = lazy(() => import('../modules/core/stock/StockPage'));
const Production = lazy(() => import('../modules/core/production/ProductionPage'));
const Orders = lazy(() => import('../modules/core/orders/OrdersPage'));
const Payments = lazy(() => import('../modules/core/payments/PaymentsPage'));
const UserManagement = lazy(() => import('../modules/superAdmin/userManagement/UserManagementPage'));
const Todo = lazy(() => import('../modules/admin/todo/TodoPage'));
const NewsAdmin = lazy(() => import('../modules/admin/news/NewsAdminPage'));

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
          <Route path="news" element={<NewsList />} />
          <Route path="news/:id" element={<NewsDetail />} />
          <Route path="order/:productId" element={<OrderPlacement />} />
          <Route path="order-tracking" element={<OrderTracking />} />
          
          <Route path="payment/initialize" element={<PaymentInitialization />} />
          <Route path="payment/success" element={<PaymentSuccess />} />
          <Route path="payment/failed" element={<PaymentFailed />} />
          <Route path="payment/pending" element={<PaymentPending />} />
        </Route>

        {/* Auth Routes - Protected from logged-in users */}
        <Route path="/login" element={
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        } />
        <Route path="/register" element={
          <PublicOnlyRoute>
            <Register />
          </PublicOnlyRoute>
        } />

        {/* Protected Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="stock" element={<Stock />} />
          <Route path="production" element={<Production />} />
          <Route path="orders" element={<Orders />} />
          <Route path="todo" element={<Todo />} />
          <Route path="news" element={<NewsAdmin />} />
        </Route>

        {/* Protected Super Admin Routes */}
        <Route
          path="/super-admin"
          element={
            <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
              <SuperAdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/super-admin/dashboard" replace />} />
          <Route path="dashboard" element={<SuperAdminDashboard />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="payments" element={<Payments />} />
          <Route path="stock" element={<Stock />} />
          {/* Add more super-admin routes here */}
        </Route>

        {/* Error Pages */}
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

        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;