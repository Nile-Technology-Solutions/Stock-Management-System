# Nile Technology Solutions - Stock Management System (SMS)

A premium, modern web application for comprehensive stock management, production tracking, and order fulfillment. Designed with a high-performance Neo-Enterprise UI featuring glassmorphism aesthetics and role-based access control.

## 🌟 Key Features

### 🏢 Core Modules
- **Inventory Management**: Real-time tracking of raw materials and hardware with low-stock alerts.
- **Production Control**: Manage manufacturing batches, track progress, and document production with photo uploads.
- **Order Pipeline**: Full sales lifecycle from public product showcase to admin fulfillment.
- **Financial Oversight**: Comprehensive revenue tracking and financial reporting (Super Admin only).
- **User Management**: Advanced RBAC for managing system users, roles, and permissions.

### 🔐 Security & Access (RBAC)
- **Super Admin**: Full oversight, system analytics, financial reports, and user governance.
- **Admin**: Daily operations, stock control, production tracking, and order management.
- **Customer**: Public product browsing, secure ordering, and real-time order tracking.

### 🎨 Design & Experience
- **Premium UI**: Ultra-clean Neo-Enterprise design with smooth glassmorphism effects.
- **Fully Responsive**: Optimized for desktop, tablet, and mobile workflows.
- **Interactive Analytics**: Dynamic charts and real-time status indicators.
- **Advanced UX**: Robust form validation, loading states, and error handling.

## 🚀 Tech Stack

- **Frontend**: React 18+ with Vite
- **Styling**: Tailwind CSS (Glassmorphism design system)
- **State/Auth**: React Context + JWT Authorization
- **Icons**: Lucide-inspired custom icon pack
- **API**: Centralized service layer (Axios-ready fetch architecture)

## 🛠️ Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone [repository-url]
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   - Create a `.env` file based on `.env.development` or `.env.production`.
4. Start the development server:
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```bash
src/
├── components/          # Design system components (GlassCard, Button, Table, etc.)
├── context/             # Auth and global state providers
├── pages/
│   ├── public/          # Public product showcase and tracking
│   ├── auth/            # Secure login and registration
│   ├── admin/           # Admin operational dashboards
│   └── superAdmin/      # Enterprise oversight and user management
├── services/            # API integration layer (Stock, Orders, Users, etc.)
├── routes/              # Protected and public routing logic
└── utils/               # Formatting and role-based helpers
```

## 🔧 Environment Configuration

Ensure your `.env` file contains the correct API base URL:
```env
VITE_API_BASE_URL=http://your-api-endpoint:5000
VITE_USE_MOCK=false
```

## 📋 Available Roles & Credentials (Demo/Dev)

| Role | Access Level | Responsibilities |
| :--- | :--- | :--- |
| **Super Admin** | Full | System Governance, Finance, User Management |
| **Admin** | Managerial | Operations, Stock, Production, Orders |
| **Customer** | Limited | Browsing, Purchasing, Tracking |

## 📄 License

Proprietary and Confidential - Nile Technology Solutions.

---

**Last Updated**: February 25, 2026  
**Version**: 1.5.0 (Enterprise Suite)
