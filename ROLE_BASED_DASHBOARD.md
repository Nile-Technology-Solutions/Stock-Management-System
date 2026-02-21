# Role-Based Dashboard Architecture

## Overview

The Stock Management System implements a role-based dashboard architecture where each user role has a dedicated dashboard component with role-specific features and data access.

## Role Hierarchy

Based on the Swagger API specification (`data/api_spec.yaml`), the system supports three user roles:

1. **Customer** (Client) - Public users
2. **Admin** - Administrative staff
3. **Super Admin** - System administrators with full access

## Dashboard Components by Role

### 1. Customer Dashboard
- **Route**: `/` (Public Home)
- **Component**: `src/modules/public/Home.jsx`
- **Access**: Public (no authentication required)
- **Features**:
  - Product browsing
  - Order placement
  - Order tracking
  - News viewing
- **API Endpoints**: Public endpoints only

### 2. Admin Dashboard
- **Route**: `/admin/dashboard`
- **Component**: `src/modules/admin/dashboard/AdminDashboardPage.jsx`
- **Access**: Admin role only
- **Features**:
  - Stock management overview
  - Production tracking
  - Order management
  - Basic analytics
  - News management
  - Todo list
- **API Endpoints**:
  - `GET /api/dashboard/admin` - Admin dashboard data
  - `GET /api/stock` - Stock materials
  - `GET /api/production` - Production records
  - `GET /api/orders` - Orders
  - `GET /api/news` - News posts (admin view)
  - `GET /api/todo` - Todo items
- **Excluded Features**:
  - Revenue statistics
  - Financial reports
  - User management
  - System settings

### 3. Super Admin Dashboard
- **Route**: `/super-admin/dashboard`
- **Component**: `src/modules/superAdmin/dashboard/SuperAdminDashboardPage.jsx`
- **Access**: Super Admin role only
- **Features**:
  - Complete system oversight
  - Revenue and financial statistics
  - User management
  - Advanced analytics
  - Financial audit
  - System settings
  - All admin features
- **API Endpoints**:
  - `GET /api/dashboard/super-admin` - Super Admin dashboard data with financials
  - `GET /api/users` - User management
  - `GET /api/reports/stock` - Stock reports
  - `GET /api/reports/production` - Production reports
  - `GET /api/reports/orders` - Order reports
  - `GET /api/reports/payments` - Payment reports
  - `GET /api/reports/sales` - Sales reports
  - All admin endpoints

## Login Flow and Role-Based Redirect

### Authentication Process

1. **User Login** (`POST /api/auth/login`)
   ```json
   {
     "username": "admin_user",
     "password": "securePass123"
   }
   ```

2. **API Response** includes role-based redirect information:
   ```json
   {
     "token": "eyJhbGciOiJIUzI1NiIsInR...",
     "user": {
       "id": 101,
       "fullName": "Abebe Kebede",
       "username": "abebe_admin",
       "role": "Admin"
     },
     "redirectTo": "/admin/dashboard"
   }
   ```

3. **Frontend Redirect Logic** (`src/utils/roleUtils.js`):
   ```javascript
   export const ROLE_DASHBOARDS = {
     'Super Admin': '/super-admin/dashboard',
     'Admin': '/admin/dashboard',
     'Customer': '/'
   };
   ```

4. **After successful login**, user is automatically redirected to their role-specific dashboard.

## Module Structure

```
src/
├── modules/
│   ├── admin/
│   │   ├── dashboard/
│   │   │   ├── AdminDashboardPage.jsx      # Admin-specific dashboard
│   │   │   └── index.js
│   │   ├── news/                            # Admin-only news management
│   │   ├── todo/                            # Admin-only todo list
│   │   └── showcase/                        # Admin-only product showcase
│   │
│   ├── superAdmin/
│   │   ├── dashboard/
│   │   │   ├── SuperAdminDashboardPage.jsx # Super Admin dashboard
│   │   │   └── index.js
│   │   ├── userManagement/                  # Super Admin only
│   │   ├── financialAudit/                  # Super Admin only
│   │   └── systemSettings/                  # Super Admin only
│   │
│   ├── core/
│   │   ├── dashboard/                       # Shared dashboard components
│   │   │   ├── DashboardCards.jsx          # Reusable card components
│   │   │   ├── DashboardCharts.jsx         # Reusable chart components
│   │   │   └── dashboardService.js         # Shared dashboard logic
│   │   ├── analytics/                       # Shared analytics
│   │   ├── stock/                           # Shared stock management
│   │   ├── production/                      # Shared production tracking
│   │   ├── orders/                          # Shared order management
│   │   └── payments/                        # Shared payment management
│   │
│   └── public/
│       ├── Home.jsx                         # Customer dashboard (public)
│       ├── Products.jsx
│       ├── OrderTracking.jsx
│       └── news/
```

## Key Differences Between Dashboards

| Feature | Customer | Admin | Super Admin |
|---------|----------|-------|-------------|
| Stock Overview | ❌ | ✅ | ✅ |
| Production Tracking | ❌ | ✅ | ✅ |
| Order Management | Limited | ✅ | ✅ |
| Revenue Statistics | ❌ | ❌ | ✅ |
| Financial Reports | ❌ | ❌ | ✅ |
| User Management | ❌ | ❌ | ✅ |
| System Settings | ❌ | ❌ | ✅ |
| News Management | ❌ | ✅ | ✅ |
| Todo List | ❌ | ✅ | ✅ |
| Product Browsing | ✅ | ✅ | ✅ |

## Protected Routes

### Route Configuration (`src/routes/AppRoutes.jsx`)

```javascript
// Admin Routes - Accessible by Admin and Super Admin
<Route path="/admin" element={
  <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}>
    <AdminLayout />
  </ProtectedRoute>
}>
  <Route path="dashboard" element={<AdminDashboard />} />
  {/* Other admin routes */}
</Route>

// Super Admin Routes - Accessible by Super Admin only
<Route path="/super-admin" element={
  <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
    <SuperAdminLayout />
  </ProtectedRoute>
}>
  <Route path="dashboard" element={<SuperAdminDashboard />} />
  {/* Other super admin routes */}
</Route>
```

## Security Implementation

### Role-Based Access Control (RBAC)

1. **Authentication Check** (`src/routes/ProtectedRoute.jsx`):
   - Verifies user is logged in
   - Checks JWT token validity
   - Redirects to login if not authenticated

2. **Authorization Check**:
   - Validates user role against allowed roles
   - Shows "Unauthorized" page if role doesn't match
   - Uses `isRoleAllowed()` utility function

3. **API Security** (Swagger spec):
   - All dashboard endpoints require `bearerAuth`
   - Backend validates JWT token
   - Backend checks user role before returning data

## Dashboard Data Flow

### Admin Dashboard
```
User Login (Admin) 
  → POST /api/auth/login
  → Redirect to /admin/dashboard
  → AdminDashboardPage.jsx loads
  → GET /api/dashboard/admin?timeRange=7d
  → Display admin-specific data (no revenue)
```

### Super Admin Dashboard
```
User Login (Super Admin)
  → POST /api/auth/login
  → Redirect to /super-admin/dashboard
  → SuperAdminDashboardPage.jsx loads
  → GET /api/dashboard/super-admin?timeRange=7d
  → Display comprehensive data (includes revenue)
```

## Shared Components

Both Admin and Super Admin dashboards reuse core components:

- **DashboardCards.jsx**: Displays metric cards (conditionally shows revenue for Super Admin)
- **DashboardCharts.jsx**: Renders charts and visualizations
- **dashboardService.js**: Handles data fetching and processing

This approach:
- ✅ Reduces code duplication
- ✅ Maintains consistency across dashboards
- ✅ Allows role-specific customization
- ✅ Simplifies maintenance

## Testing Role-Based Access

### Test Scenarios

1. **Login as Admin**:
   - Should redirect to `/admin/dashboard`
   - Should see AdminDashboardPage
   - Should NOT see revenue statistics
   - Should NOT access `/super-admin/*` routes

2. **Login as Super Admin**:
   - Should redirect to `/super-admin/dashboard`
   - Should see SuperAdminDashboardPage
   - Should see revenue statistics
   - Should access both `/admin/*` and `/super-admin/*` routes

3. **Login as Customer**:
   - Should redirect to `/` (home)
   - Should NOT access `/admin/*` or `/super-admin/*` routes
   - Should see public pages only

## API Endpoint Summary

### Dashboard Endpoints
- `GET /api/dashboard/admin` - Admin dashboard data
- `GET /api/dashboard/super-admin` - Super Admin dashboard data

### Authentication
- `POST /api/auth/login` - Login with role-based redirect
- `POST /api/auth/register` - Register new customer

### Role-Specific Endpoints
- **Admin & Super Admin**: `/api/stock`, `/api/production`, `/api/orders`, `/api/news`, `/api/todo`
- **Super Admin Only**: `/api/users`, `/api/reports/*`, `/api/payments`
- **Public**: `/api/products`, `/api/news` (read-only)

## Conclusion

The role-based dashboard architecture ensures:
- ✅ Proper separation of concerns
- ✅ Role-specific feature access
- ✅ Secure data access based on user role
- ✅ Scalable and maintainable codebase
- ✅ Compliance with Swagger API specification
- ✅ Clear user experience based on role
