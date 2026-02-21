# Design Document: Component Architecture Restructuring

## Overview

This design outlines the restructuring of the React application from its current mixed structure (with both `src/pages/admin/` and `src/modules/` directories) into a unified, modular architecture under `src/modules/`. The restructuring consolidates all feature-specific code into role-based modules (core, admin, superAdmin) while maintaining shared components in `src/components/`. This approach improves code organization, maintainability, and scalability without changing any functio

### Current State

The application currently has:
- Components in `src/components/` organized by type (analytics, auth, common, icons, layout, order, payment, public)
- Pages in `src/pages/` with admin, auth, payment, and public subfolders
- Some modularization already exists in `src/pages/admin/` with feature subdirectories (dashboard, analytics, stock, etc.)
- Role-based access control via AuthContext with three roles: Customer, Admin, Super Admin

### Target State

The new structure will organize components into:
- `src/components/modules/core/` - Shared between Admin & Super Admin
- `src/components/modules/admin/` - Admin-only features
- `src/components/modules/superAdmin/` - Super Admin exclusive features
- Existing `src/components/common/`, `src/components/layout/`, etc. remain for truly shared components

## Architecture

### Directory Structure

```
src/
├── components/
│   ├── modules/
│   │   ├── core/                     # Shared between Admin & Super Admin
│   │   │   ├── dashboard/
│   │   │   │   ├── DashboardPage.jsx
│   │   │   │   ├── DashboardCards.jsx
│   │   │   │   ├── DashboardCharts.jsx
│   │   │   │   ├── dashboardService.js
│   │   │   │   └── index.js
│   │   │   ├── analytics/
│   │   │   │   ├── AnalyticsPage.jsx
│   │   │   │   └── index.js
│   │   │   ├── stock/
│   │   │   │   ├── StockPage.jsx
│   │   │   │   ├── stockService.js
│   │   │   │   └── index.js
│   │   │   ├── production/
│   │   │   │   ├── ProductionPage.jsx
│   │   │   │   ├── productionService.js
│   │   │   │   └── index.js
│   │   │   ├── orders/
│   │   │   │   ├── OrdersPage.jsx
│   │   │   │   ├── ordersService.js
│   │   │   │   └── index.js
│   │   │   ├── payments/
│   │   │   │   ├── PaymentsPage.jsx
│   │   │   │   ├── paymentsService.js
│   │   │   │   └── index.js
│   │   │   ├── reports/
│   │   │   │   └── index.js
│   │   │   └── users/
│   │   │       └── index.js
│   │   │
│   │   ├── admin/                    # Admin-only features
│   │   │   ├── showcase/
│   │   │   │   └── index.js
│   │   │   ├── news/
│   │   │   │   ├── NewsPage.jsx
│   │   │   │   └── index.js
│   │   │   └── todo/
│   │   │       └── index.js
│   │   │
│   │   └── superAdmin/               # Super Admin exclusive features
│   │       ├── userManagement/
│   │       │   └── index.js
│   │       ├── financialAudit/
│   │       │   └── index.js
│   │       └── systemSettings/
│   │           └── index.js
│   │
│   ├── common/                       # Shared UI components (unchanged)
│   ├── layout/                       # Layout components (unchanged)
│   ├── icons/                        # Icon components (unchanged)
│   ├── auth/                         # Auth components (unchanged)
│   ├── order/                        # Order components (unchanged)
│   ├── payment/                      # Payment components (unchanged)
│   └── public/                       # Public-facing components (unchanged)
│
├── pages/                            # Entry point pages (minimal, mostly re-exports)
│   ├── admin/
│   │   ├── Dashboard.jsx             # Re-exports from modules/core/dashboard
│   │   ├── Analytics.jsx
│   │   ├── Stock.jsx
│   │   ├── Production.jsx
│   │   ├── Orders.jsx
│   │   └── News.jsx                  # Re-exports from modules/admin/news
│   ├── auth/                         # Auth pages (unchanged)
│   ├── payment/                      # Payment pages (unchanged)
│   └── public/                       # Public pages (unchanged)
│
├── routes/                           # Routing (updated imports)
├── services/                         # Shared services (unchanged)
├── utils/                            # Shared utilities (unchanged)
├── context/                          # Context providers (unchanged)
└── hooks/                            # Custom hooks (unchanged)
```

### Module Organization Principles

1. **Core Modules**: Features accessible to both Admin and Super Admin roles
   - Dashboard, Analytics, Stock, Production, Orders, Payments, Reports, Users
   - These modules contain the main business logic for the application
   - Reports module is accessible to Super Admin for generating system-wide reports

2. **Admin Modules**: Features exclusive to Admin role
   - Showcase, News, Todo
   - These are admin-specific tools and content management

3. **Super Admin Modules**: Features exclusive to Super Admin role
   - User Management, Financial Audit, System Settings
   - These are system-level administrative functions

4. **Shared Components**: Components used across multiple modules or roles
   - Remain in their current locations (common, layout, icons, etc.)
   - No changes to these directories

### Migration Strategy

The migration follows a systematic approach:

1. **Create Directory Structure**: Create all module directories first
2. **Identify Component Ownership**: Map each component to its appropriate module
3. **Move Components**: Move files to new locations preserving content
4. **Update Imports**: Update all import statements throughout the codebase
5. **Create Index Files**: Add index.js files for clean exports
6. **Update Routes**: Update routing configuration
7. **Verify Build**: Ensure application builds and runs correctly

## Components and Interfaces

### Component Mapping

#### Core Modules

**Dashboard Module** (`modules/core/dashboard/`)
- Source: `src/pages/admin/dashboard/`
- Components:
  - `DashboardPage.jsx` (from `src/pages/admin/dashboard/DashboardPage.jsx`)
  - `DashboardCards.jsx` (from `src/pages/admin/dashboard/DashboardCards.jsx`)
  - `DashboardCharts.jsx` (from `src/pages/admin/dashboard/DashboardCharts.jsx`)
  - `dashboardService.js` (from `src/pages/admin/dashboard/dashboardService.js`)

**Stock Module** (`modules/core/stock/`)
- Source: `src/pages/admin/stock/`
- Components:
  - `StockPage.jsx` (from `src/pages/admin/stock/StockPage.jsx`)
- Hooks: `useStock.js` (from `src/hooks/useStock.js`)
- Services: `stockApi.js` (from `src/services/stockApi.js`)

**Production Module** (`modules/core/production/`)
- Source: `src/pages/admin/production/`
- Components:
  - `ProductionPage.jsx` (from `src/pages/admin/production/ProductionPage.jsx`)
- Hooks: `useProduction.js` (from `src/hooks/useProduction.js`)

**Orders Module** (`modules/core/orders/`)
- Source: `src/pages/admin/orders/`
- Components:
  - `OrdersPage.jsx` (from `src/pages/admin/orders/OrdersPage.jsx`)
- Hooks: `useOrders.js` (from `src/hooks/useOrders.js`)

**Payments Module** (`modules/core/payments/`)
- Source: `src/pages/admin/payments/`
- Components:
  - `PaymentsPage.jsx` (from `src/pages/admin/payments/PaymentsPage.jsx`)

**Analytics Module** (`modules/core/analytics/`)
- Source: `src/pages/admin/analytics/`
- Components:
  - `AnalyticsPage.jsx` (from `src/pages/admin/analytics/AnalyticsPage.jsx`)
- Related: `src/components/analytics/` (AnalyticsChart, TimeFilter remain in shared components)

**Reports Module** (`modules/core/reports/`)
- Placeholder for future Super Admin reporting features
- Will integrate with API endpoints: /api/reports/stock, /api/reports/production, /api/reports/orders, /api/reports/payments, /api/reports/sales

**Users Module** (`modules/core/users/`)
- Placeholder for user-related features shared between Admin and Super Admin

#### Admin Modules

**News Module** (`modules/admin/news/`)
- Source: `src/pages/admin/News.jsx`
- Components:
  - `NewsPage.jsx` (from `src/pages/admin/News.jsx`)

**Showcase Module** (`modules/admin/showcase/`)
- New module (placeholder for future implementation)

**Todo Module** (`modules/admin/todo/`)
- New module (placeholder for future implementation)

#### Super Admin Modules

**User Management Module** (`modules/superAdmin/userManagement/`)
- New module (placeholder for future implementation)

**Financial Audit Module** (`modules/superAdmin/financialAudit/`)
- New module (placeholder for future implementation)

**System Settings Module** (`modules/superAdmin/systemSettings/`)
- New module (placeholder for future implementation)

### Index File Pattern

Each module will have an `index.js` file that exports all components:

```javascript
// Example: src/components/modules/core/dashboard/index.js
export { default as DashboardPage } from './DashboardPage';
export { default as DashboardCards } from './DashboardCards';
export { default as DashboardCharts } from './DashboardCharts';
export * from './dashboardService';
```

This allows for clean imports:
```javascript
// Before
import DashboardPage from '../../../components/modules/core/dashboard/DashboardPage';

// After
import { DashboardPage } from '../../../components/modules/core/dashboard';
```

### Entry Point Pattern

The `src/pages/admin/` directory will contain minimal entry point files that re-export from modules:

```javascript
// Example: src/pages/admin/Dashboard.jsx
export { DashboardPage as default } from '../../components/modules/core/dashboard';
```

This maintains backward compatibility with the routing system while organizing code in modules.

## Data Models

No data models are changed in this refactoring. All existing data structures, API interfaces, and state management patterns remain identical.

### Preserved Interfaces

- **AuthContext**: No changes to authentication context or user model
- **API Services**: All API service interfaces remain unchanged
- **Custom Hooks**: Hook signatures and return values remain unchanged
- **Component Props**: All component prop interfaces remain unchanged

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system - essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

Since this is a pure refactoring task (restructuring without changing functionality), traditional correctness properties focus on preservation rather than new behavior:

**Property 1: Import Resolution Preservation**
*For any* component that was successfully imported before restructuring, that component should be successfully importable after restructuring (possibly from a different path).
**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5**

**Property 2: Component Content Preservation**
*For any* component file that is moved during restructuring, the file content should be byte-for-byte identical before and after the move.
**Validates: Requirements 2.4, 2.5, 4.2, 4.3**

**Property 3: Route Resolution Preservation**
*For any* route path that was accessible before restructuring, that same route path should resolve to the same component after restructuring.
**Validates: Requirements 4.5**

**Property 4: Build Success Preservation**
*For any* valid build configuration before restructuring, the build should complete successfully after restructuring with no new errors.
**Validates: Requirements 8.1, 8.2**

**Property 5: Module Boundary Correctness**
*For any* component placed in a role-specific module (admin, superAdmin), that component should only be accessible to users with the appropriate role.
**Validates: Requirements 1.2, 1.3, 1.4, 4.4**

## Error Handling

Since this is a refactoring task, error handling focuses on migration safety:

1. **Missing Import Detection**: The build process will fail if any imports cannot be resolved, preventing deployment of broken code
2. **File Move Verification**: Each file move should be verified to ensure the source file was successfully moved to the destination
3. **Backup Strategy**: Before starting the restructuring, create a git branch or backup to allow rollback if issues occur
4. **Incremental Verification**: After each major migration step, verify the application builds and runs
5. **Import Path Validation**: Use IDE or build tools to validate all import paths are correct

## Testing Strategy

### Manual Testing Approach

Since this is a pure refactoring with no functional changes, the testing strategy focuses on verification rather than new test creation:

1. **Build Verification**
   - Run `npm run build` or equivalent to ensure no build errors
   - Verify all lazy-loaded routes resolve correctly
   - Check for any console warnings about missing modules

2. **Visual Regression Testing**
   - Navigate through all routes in the application
   - Verify each page renders correctly
   - Confirm all role-based access controls work as before
   - Test both Admin and Super Admin user flows

3. **Import Path Verification**
   - Use IDE "Find All References" to verify no broken imports remain
   - Search codebase for old import paths (e.g., `from '../pages/admin/`)
   - Verify all index.js files export the correct components

4. **Hot Module Replacement Testing**
   - Run development server
   - Make a small change to a migrated component
   - Verify HMR updates the component without full page reload

5. **Role-Based Access Testing**
   - Test as Admin user: verify access to core + admin modules
   - Test as Super Admin user: verify access to core + superAdmin modules
   - Test as Customer user: verify no access to admin modules

### Existing Test Preservation

If unit tests or integration tests exist:
- Update test file import paths to match new structure
- Move test files to be co-located with their components (if following that pattern)
- Verify all tests pass after restructuring
- No test logic should change - only import paths

### API Integration Verification

Verify that all API integrations remain intact by checking:
- Authentication endpoints (/api/auth/login, /api/auth/register)
- User Management endpoints (/api/users) - Super Admin only
- Stock Management endpoints (/api/stock) - Admin & Super Admin
- Production Tracking endpoints (/api/production) - Admin & Super Admin
- Product Showcase endpoints (/api/products) - Admin & Super Admin (public read)
- Orders endpoints (/api/orders) - Admin & Super Admin
- Payments endpoints (/api/payments) - All roles
- To-Do List endpoints (/api/todo) - Admin & Super Admin
- News endpoints (/api/news) - Admin & Super Admin (public read)
- Reports endpoints (/api/reports/*) - Super Admin only

Each module should maintain its existing API service integration without modification.
