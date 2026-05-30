<h1 align="center">
  🪵 AddHomes Creative Woodworks
</h1>

<p align="center">
  <strong>A premium web application for furniture manufacturing, order management, and business operations.</strong>
  <br />
  Built with a modern UI featuring glassmorphism aesthetics, dark/light theming, and role-based access control (RBAC).
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-7-B73BFE?style=flat-square&logo=vite" alt="Vite 7" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss" alt="Tailwind CSS 4" />
  <img src="https://img.shields.io/badge/Node-18+-339933?style=flat-square&logo=node.js" alt="Node 18+" />
  <img src="https://img.shields.io/badge/License-Proprietary-red?style=flat-square" alt="License" />
</p>

---

## 🚀 Overview

**AddHomes Creative Woodworks** is a full-featured platform for **AddHomes Creatives** (Furniture & Interiors). It provides a complete pipeline from public product showcasing through secure ordering, payment processing, inventory management, production tracking, and administrative oversight — all wrapped in a sleek, glassmorphism-inspired UI.

The platform serves **three distinct user roles** (Super Admin, Admin, Customer) with tailored dashboards and granular permissions.

---

## ✨ Key Features

### 🏪 Public Experience (Customer-Facing)
| Feature | Description |
|---|---|
| **Product Showcase** | Browse furniture & interiors catalog with category filtering |
| **Product Details** | Image gallery, specifications, pricing |
| **Secure Ordering** | Streamlined placement with form validation |
| **Order Tracking** | Real-time order status for customers |
| **Payment Workflow** | Initialize, success, failed, and pending states |
| **News & Updates** | Company announcements and blog posts |
| **Dark / Light Mode** | Persistent theme toggle across all pages |

### 🏢 Admin Operations
| Feature | Description |
|---|---|
| **Executive Dashboard** | KPI metrics, charts, and actionable insights (powered by Recharts) |
| **Inventory Management** | Real-time inventory with low-stock alerts |
| **Production Control** | Batch management with photo documentation |
| **Order Pipeline** | Full lifecycle management (placement → fulfillment) |
| **Payment Oversight** | Transaction history and status monitoring |
| **Analytics** | Interactive charts and time-filtered analytics |
| **Reports** | Export-ready inventory, sales, orders, production, and payments reports |
| **News Management** | Publish and manage public-facing articles |
| **Todo Management** | Team task tracking board |
| **Product Showcase** | Manage catalog, categories, and visibility |

### 🔐 Super Admin (Enterprise Governance)
| Feature | Description |
|---|---|
| **User Management** | Full CRUD for system users, role assignment, permissions |
| **Audit Logs** | Immutable trail of all system activities |
| **Financial Audit** | Revenue analytics and financial reporting |
| **System Settings** | Global configuration and system preferences |
| **All Admin Capabilities** | Inherits full admin access |

### 🎨 Design System
- **Modern UI** — Ultra-clean interface with smooth glassmorphism effects
- **Fully Responsive** — Seamless across mobile, tablet, and desktop
- **Tailwind CSS v4** — Utility-first styling with custom glass components
- **Custom Icon Pack** — Lucide-inspired icon library
- **Loading States** — Skeleton cards, loaders, and progressive enhancement
- **Error Handling** — Error boundaries, empty states, and user-friendly error displays
- **Recharts Integration** — Beautiful, interactive analytics charts

---

## 🛠️ Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| **React** | ^19.2.0 | UI framework |
| **Vite** | ^7.3.1 | Build tool & dev server |
| **Tailwind CSS** | ^4.1.18 | Utility-first CSS framework |
| **React Router** | ^7.13.0 | SPA routing |
| **Recharts** | ^3.7.0 | Interactive data visualization |
| **Lucide React** | ^0.565.0 | Icon library |
| **React Hot Toast** | ^2.6.0 | Toast notifications |
| **jsPDF** | ^4.2.0 | PDF report generation |
| **date-fns** | ^4.1.0 | Date utilities |

### Architecture

| Layer | Description |
|---|---|
| **Routing** | Lazy-loaded pages with Suspense for code-splitting |
| **State Management** | React Context (Auth, Theme) |
| **API Layer** | Centralized Fetch-based service with token management |
| **Mock Data** | Built-in mock service for development without backend |
| **Auth** | JWT-based token storage with automatic redirect on 401 |
| **RBAC** | Hierarchical role utilities (`hasRoleAccess`, `isRoleAllowed`) |

---

## 🗂️ Project Architecture

```
frontend/
├── index.html                    # Vite entry point
├── vite.config.js                # Vite configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── postcss.config.js             # PostCSS configuration
├── eslint.config.js              # ESLint flat config
├── package.json                  # Dependencies & scripts
│
├── public/                       # Static assets
│   ├── favicon.ico / .png        # Favicon set
│   ├── robots.txt                # SEO crawl instructions
│   ├── site.webmanifest          # PWA manifest
│   └── humans.txt                # Team credits
│
└── src/
    ├── main.jsx                  # React root mount
    ├── App.jsx                   # Root component (ThemeProvider, AuthProvider, Router)
    ├── index.css                 # Global styles + Tailwind directives + glass utilities
    │
    ├── assets/                   # Images & icons
    ├── config/
    │   ├── env.js                # Environment variables (API URL, mock toggle, timeouts)
    │   └── reportConfig.js       # Report column definitions
    │
    ├── context/
    │   ├── AuthContext.jsx       # Auth state, login/logout, token management
    │   └── ThemeContext.jsx      # Dark/light theme persistence
    │
    ├── hooks/
    │   ├── useOrders.js          # Order data fetching hook
    │   ├── useProduction.js      # Production data fetching hook
    │   └── useStock.js           # Stock data fetching hook
    │
    ├── services/                 # API service layer
    │   ├── api.js                # Base fetch wrapper (GET, POST, PUT, PATCH, DELETE)
    │   ├── authApi.js            # Authentication endpoints
    │   ├── productApi.js         # Product CRUD
    │   ├── categoryApi.js        # Category management
    │   ├── orderApi.js           # Order lifecycle
    │   ├── paymentApi.js         # Payment processing
    │   ├── stockApi.js           # Inventory management
    │   ├── productionApi.js      # Production tracking
    │   ├── reportApi.js          # Report generation
    │   ├── newsApi.js            # News/announcements
    │   ├── profileApi.js         # User profile
    │   ├── addressApi.js         # Address management
    │   ├── todoApi.js            # Task management
    │   ├── uploadApi.js          # File uploads
    │   ├── auditLogService.js    # Audit trail
    │   ├── superAdminApi.js      # Super Admin operations
    │   ├── mockData.js           # Development mock data
    │   └── superAdminMockData.js # Super Admin mock data
    │
    ├── utils/
    │   ├── roleUtils.js          # RBAC helpers (ROLES, hasRoleAccess, redirectByRole)
    │   ├── imageUrl.js           # Image URL utilities
    │   ├── pdfGenerator.js       # PDF report export
    │   └── excelExport.js        # Excel report export
    │
    ├── routes/
    │   ├── AppRoutes.jsx         # Full route tree with lazy loading
    │   ├── ProtectedRoute.jsx    # Auth guard component
    │   └── PublicOnlyRoute.jsx   # Redirects authenticated users away
    │
    ├── components/
    │   ├── common/               # Design system atoms & molecules
    │   │   ├── Button.jsx        # Multi-variant button (primary, glass, ghost, etc.)
    │   │   ├── Card.jsx          # Standard card container
    │   │   ├── GlassCard.jsx     # Glassmorphism card component
    │   │   ├── GlassModal.jsx    # Glassmorphism modal overlay
    │   │   ├── Modal.jsx         # Standard modal
    │   │   ├── Table.jsx         # Reusable data table
    │   │   ├── SearchInput.jsx   # Debounced search input
    │   │   ├── Select.jsx        # Styled dropdown
    │   │   ├── Badge.jsx         # Status/department badges
    │   │   ├── Loader.jsx        # Loading spinner
    │   │   ├── SkeletonCard.jsx  # Skeleton loading placeholder
    │   │   ├── MetricCard.jsx    # KPI metric display
    │   │   ├── ChartCard.jsx     # Chart wrapper container
    │   │   ├── ImageUpload.jsx   # Drag-and-drop image upload
    │   │   ├── OptimizedImage.jsx# Lazy-loaded optimized image
    │   │   ├── ThemeToggle.jsx   # Dark/light mode switch
    │   │   ├── DateRangeFilter.jsx # Date range picker
    │   │   ├── EmptyState.jsx    # Empty data state
    │   │   ├── EnhancedEmptyState.jsx
    │   │   ├── ErrorBoundary.jsx # React error boundary
    │   │   ├── ErrorState.jsx    # Error display component
    │   │   ├── LogoutModal.jsx   # Logout confirmation
    │   │   ├── ReportCard.jsx    # Report summary card
    │   │   ├── ReportTable.jsx   # Report data table
    │   │   └── ReportViewer.jsx  # Report display container
    │   │
    │   ├── layout/
    │   │   ├── PublicLayout.jsx      # Public pages wrapper (navigation + footer)
    │   │   ├── PublicNavigation.jsx  # Responsive nav with auth menu
    │   │   ├── Footer.jsx            # Site footer
    │   │   ├── AdminLayout.jsx       # Admin dashboard layout
    │   │   └── SuperAdminLayout.jsx  # Super Admin dashboard layout
    │   │
    │   ├── auth/
    │   │   └── AuthGuard.jsx     # Auth verification component
    │   │
    │   ├── public/               # Public-facing components
    │   │   ├── ProductCard.jsx
    │   │   ├── ProductCardSkeleton.jsx
    │   │   ├── ProductImageGallery.jsx
    │   │   ├── ProductSpecs.jsx
    │   │   ├── CategoryCard.jsx
    │   │   ├── CategoryFilter.jsx
    │   │   ├── SearchInput.jsx
    │   │   └── PublicWrapper.jsx
    │   │
    │   ├── order/                # Order lifecycle components
    │   │   ├── OrderForm.jsx
    │   │   ├── OrderSummaryCard.jsx
    │   │   ├── OrderStatusTimeline.jsx
    │   │   ├── OrderSuccessModal.jsx
    │   │   ├── PaymentRedirectNotice.jsx
    │   │   └── ImageWithFallback.jsx
    │   │
    │   ├── payment/
    │   │   ├── PaymentStatusCard.jsx
    │   │   ├── PaymentSummaryCard.jsx
    │   │   ├── StatusIcon.jsx
    │   │   └── RedirectLoader.jsx
    │   │
    │   ├── reports/
    │   │   ├── SalesReportView.jsx
    │   │   ├── StockReportView.jsx
    │   │   ├── OrdersReportView.jsx
    │   │   ├── PaymentsReportView.jsx
    │   │   └── ProductionReportView.jsx
    │   │
    │   ├── analytics/
    │   │   ├── AnalyticsChart.jsx
    │   │   └── TimeFilter.jsx
    │   │
    │   └── icons/                # Custom Lucide-inspired icon set
    │
    └── pages/
        ├── public/               # Public site pages
        │   ├── Home.jsx
        │   ├── About.jsx
        │   ├── Products.jsx
        │   ├── ProductDetail.jsx
        │   ├── News.jsx
        │   ├── news/NewsListPage.jsx
        │   ├── news/NewsDetailPage.jsx
        │   ├── OrderPlacement.jsx
        │   ├── OrderTracking.jsx
        │   └── OrderSuccess.jsx
        │
        ├── auth/                 # Authentication pages
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   ├── ForgotPassword.jsx
        │   ├── ResetPassword.jsx
        │   └── Unauthorized.jsx
        │
        ├── payment/              # Payment workflow pages
        │   ├── PaymentInitialization.jsx
        │   ├── PaymentSuccess.jsx
        │   ├── PaymentFailed.jsx
        │   └── PaymentPending.jsx
        │
        ├── profile/
        │   └── ProfilePage.jsx
        │
        ├── admin/                # Admin dashboards
        │   ├── dashboard/
        │   │   ├── AdminDashboardPage.jsx
        │   │   └── ExecutiveDashboard.jsx
        │   ├── showcase/
        │   ├── news/
        │   └── todo/
        │
        ├── core/                 # Core operational modules
        │   ├── dashboard/
        │   ├── analytics/
        │   ├── stock/
        │   ├── production/
        │   ├── orders/
        │   ├── payments/
        │   ├── reports/
        │   └── users/
        │
        └── superAdmin/           # Super Admin modules
            ├── dashboard/
            ├── userManagement/
            ├── auditLogs/
            ├── financialAudit/
            ├── reports/
            ├── settings/
            └── systemSettings/
```

---

## 🧭 Routing Map

```
/                          → Public Home
/about                     → About Us
/products                  → Product Catalog
/products/:id              → Product Detail
/news                      → News List
/news/:id                  → News Detail
/order/:productId          → Order Placement
/order-tracking            → Order Tracking

/login                     → Login (public-only)
/register                  → Register (public-only)
/forgot-password           → Forgot Password (public-only)
/reset-password            → Reset Password (public-only)

/payment/initialize        → Payment Initiation
/payment/success           → Payment Success
/payment/failed            → Payment Failure
/payment/pending           → Payment Pending

/profile                   → User Profile (authenticated)

/admin/dashboard           → Executive Dashboard
/admin/analytics           → Analytics & Charts
/admin/stock               → Inventory Management
/admin/production          → Production Tracking
/admin/orders              → Order Management
/admin/payments            → Payment Oversight
/admin/reports             → Report Center
/admin/showcase            → Product Showcase Management
/admin/todo                → Task Board
/admin/news                → News Publisher

/admin/users               → User Management (Super Admin only)
/admin/audit-logs          → Audit Trail (Super Admin only)
/admin/settings            → System Settings (Super Admin only)
```

---

## 🔐 Role-Based Access Control

| Role | Access Level | Capabilities |
|---|---|---|
| **👑 Super Admin** | **Full System** | User management, audit logs, financial audit, system settings, plus all Admin capabilities |
| **🛠️ Admin** | **Operational** | Stock, production, orders, payments, analytics, reports, news, todo, showcase management |
| **👤 Customer** | **Self-Service** | Product browsing, ordering, order tracking, payment, profile management |

The role system uses a **hierarchical** permission model:
- `SuperAdmin` (level 2) — inherits everything
- `Admin` (level 1) — above Customer
- `Customer` (level 0) — base level

---

## ⚙️ Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **npm** (comes with Node) or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**  
   Create a `.env` file in the `frontend/` root:
   ```env
   VITE_API_BASE_URL=http://localhost:5000
   VITE_USE_MOCK=true
   ```

   > **Note:** `VITE_USE_MOCK` defaults to `true`. Set to `false` to connect to a live backend.

4. **Start development server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`.

---

## 📜 Available Scripts

| Script | Command | Description |
|---|---|---|
| `dev` | `vite` | Start development server with HMR |
| `build` | `vite build` | Production build |
| `preview` | `vite preview` | Preview production build locally |
| `lint` | `eslint .` | Run ESLint on the entire project |

---

## 🔧 Environment Configuration

| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:5000` | Backend API endpoint |
| `VITE_USE_MOCK` | `true` | When `true`, uses mock data instead of real API |

### Development vs Production

The API service layer (`src/services/api.js`) handles:
- **Mock mode** (`USE_MOCK=true`): Returns realistic mock data for frontend development
- **Live mode** (`USE_MOCK=false`): Sends real HTTP requests to the configured backend
- **Automatic token injection**: Auth tokens are attached to all requests
- **Error handling**: 401 → redirect to login, 403 → permission denied, 500 → server error

---

## 🎨 Theming

The application supports **dark mode** and **light mode** with persistent user preference:

- Theme state is managed via `ThemeContext`
- Preference is saved to `localStorage`
- Toggle component is available in the navigation bar
- All components automatically adapt to the active theme

---

## 📊 Reports Module

The system includes a comprehensive reports engine:

| Report Type | Description | Export Options |
|---|---|---|
| **Sales Report** | Revenue, trends, and sales metrics | PDF, Excel |
| **Stock Report** | Inventory levels and movement | PDF, Excel |
| **Orders Report** | Order volume and status breakdown | PDF, Excel |
| **Payments Report** | Transaction history and reconciliation | PDF, Excel |
| **Production Report** | Batch tracking and output metrics | PDF, Excel |

---

## 🌐 API Integration

The centralized API service (`src/services/api.js`) provides:

```javascript
// Available methods
api.get('/endpoint', params)        // GET request
api.post('/endpoint', data)         // POST request
api.put('/endpoint', data)          // PUT request
api.patch('/endpoint', data)        // PATCH request
api.delete('/endpoint')             // DELETE request
api.postMultipart('/endpoint', fd)  // Multipart form upload
```

**Key features:**
- Automatic JWT Bearer token injection
- FormData detection for file uploads (no Content-Type override)
- 401 auto-redirect for expired tokens
- Comprehensive error handling with user-friendly messages
- Configurable timeout (30s), retry attempts (3), and retry delay (1s)

---

## 🧩 Key Design Patterns

### Lazy Loading
All page components are lazy-loaded with `React.lazy()` and `Suspense`, ensuring optimal bundle splitting and faster initial loads.

### Error Boundaries
The `ErrorBoundary` component catches runtime errors in the component tree and displays a fallback UI, preventing full-page crashes.

### Custom Hooks
Encapsulated data-fetching logic in custom hooks (`useOrders`, `useProduction`, `useStock`) for clean, reusable data access patterns.

### RBAC Utilities
Centralized role-checking functions (`hasRoleAccess`, `isRoleAllowed`, `redirectByRole`) ensure consistent authorization across the application.

---

## 🚢 Deployment

### Production Build
```bash
npm run build
```

The output will be in the `dist/` directory, ready to be served by any static file server (nginx, Apache, CDN, etc.).

For Vite-specific deployment guides, refer to the [Vite deployment documentation](https://vite.dev/guide/static-deploy).

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

**Code style:**
- ESLint configuration is already set up — run `npm run lint` before committing
- Follow the existing component patterns and folder structure
- Use the custom icon pack instead of external icon imports where possible

---

## 📄 License

**Proprietary and Confidential**.

All rights reserved. This software may not be reproduced, distributed, or used without explicit written permission.

---

## 🏢 About

Built for **AddHomes Creatives** — Furniture & Interiors.

| | |
|---|---|
| **Product** | AddHomes Creative Woodworks |
| **Version** | 1.0.0 |
| **Client** | AddHomes Creatives — Furniture & Interiors |
| **Last Updated** | May 30, 2026 |

---