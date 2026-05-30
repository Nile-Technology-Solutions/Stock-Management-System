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
const Home = lazy(() => import('../pages/public/Home'));
const About = lazy(() => import('../pages/public/About'));
const Products = lazy(() => import('../pages/public/Products'));
const ProductDetail = lazy(() => import('../pages/public/ProductDetail'));
const NewsList = lazy(() => import('../pages/public/news/NewsListPage'));
const NewsDetail = lazy(() => import('../pages/public/news/NewsDetailPage'));
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
const ForgotPassword = lazy(() => import('../pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('../pages/auth/ResetPassword'));

// Profile Page
const Profile = lazy(() => import('../pages/profile/ProfilePage'));

// Unified Admin Dashboard (role-based content)
const AdminDashboard = lazy(() => import('../pages/admin/dashboard/AdminDashboardPage'));

// Modularized Core/Admin Pages
const Analytics = lazy(() => import('../pages/core/analytics/AnalyticsPage'));
const Stock = lazy(() => import('../pages/core/stock/StockPage'));
const Showcase = lazy(() => import('../pages/admin/showcase'));
const Production = lazy(() => import('../pages/core/production/ProductionPage'));
const Orders = lazy(() => import('../pages/core/orders/OrdersPage'));
const Payments = lazy(() => import('../pages/core/payments/PaymentsPage'));
const Reports = lazy(() => import('../pages/core/reports'));
const UserManagement = lazy(() => import('../pages/superAdmin/userManagement/UserManagementPage'));
const Settings = lazy(() => import('../pages/superAdmin/settings'));
const AuditLogs = lazy(() => import('../pages/superAdmin/auditLogs/AuditLogsPage'));
const Todo = lazy(() => import('../pages/admin/todo/TodoPage'));
const NewsAdmin = lazy(() => import('../pages/admin/news/NewsAdminPage'));

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
          <Route path="about" element={<About />} />
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
        <Route path="/forgot-password" element={
          <PublicOnlyRoute>
            <ForgotPassword />
          </PublicOnlyRoute>
        } />
        <Route path="/reset-password" element={
          <PublicOnlyRoute>
            <ResetPassword />
          </PublicOnlyRoute>
        } />

        {/* Profile Route - Protected, accessible by all authenticated users */}
        <Route path="/profile" element={
          <ProtectedRoute allowedRoles={[ROLES.CUSTOMER, ROLES.ADMIN, ROLES.SUPER_ADMIN]}>
            <Profile />
          </ProtectedRoute>
        } />

        {/* Protected Admin Routes - Accessible by both Admin and Super Admin */}
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
          <Route path="showcase" element={<Showcase />} />
          <Route path="production" element={<Production />} />
          <Route path="orders" element={<Orders />} />
          <Route path="payments" element={<Payments />} />
          <Route path="reports" element={<Reports />} />
          <Route path="todo" element={<Todo />} />
          <Route path="news" element={<NewsAdmin />} />
          
          {/* Super Admin Exclusive Routes */}
          <Route 
            path="users" 
            element={
              <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
                <UserManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="audit-logs" 
            element={
              <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
                <AuditLogs />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="settings" 
            element={
              <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
                <Settings />
              </ProtectedRoute>
            } 
          />
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