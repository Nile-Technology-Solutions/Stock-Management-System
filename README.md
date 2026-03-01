<div align="center">

# 📦 Stock Management System

### Enterprise-Grade Production & Inventory Management Platform

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-4169E1?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.0-2D3748?style=flat&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/License-Proprietary-red?style=flat)](LICENSE)

[Features](#-features) • [Quick Start](#-quick-start) • [Tech Stack](#-tech-stack) • [Documentation](#-documentation) • [API](#-api-reference)

</div>

---

## 🎯 Overview

A comprehensive full-stack solution for **Nile Technology Solutions** that streamlines inventory management, production tracking, order processing, and business operations. Built with modern technologies and enterprise-grade security.

### 🎭 Role-Based Access Control

```mermaid
graph LR
    A[SuperAdmin] -->|Full Access| B[User Management]
    A -->|Full Access| C[Financial Reports]
    A -->|Full Access| D[Audit Logs]
    E[Admin] -->|Manage| F[Stock & Production]
    E -->|Manage| G[Orders & Content]
    H[Customer] -->|Access| I[Browse Products]
    H -->|Access| J[Place Orders]
```

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🔐 Authentication & Security

- JWT-based authentication
- Role-based access control (RBAC)
- Password reset functionality
- Comprehensive audit logging
- Secure file uploads

### 📊 Inventory Management

- Real-time stock tracking
- Material categorization
- Local/Imported origin tracking
- Color, size, thickness variants
- Low stock alerts

### 🏭 Production Tracking

- Production workflow management
- Progress monitoring (0-100%)
- Material usage tracking
- Photo documentation
- Status management (UnderProcess/Completed/Rejected)

</td>
<td width="50%">

### 🛍️ E-Commerce Features

- Product showcase with photos
- Customer ordering system
- Payment integration (Chapa, Telebirr)
- Order status tracking
- Delivery address management

### 📈 Reporting & Analytics

- Stock reports with filtering
- Production analytics
- Sales & revenue reports
- Payment tracking
- Export to CSV/PDF

### 📰 Content Management

- News & announcements
- Task management (To-Do lists)
- User preferences
- Multi-photo uploads

</td>
</tr>
</table>

---

## 🚀 Quick Start

### Prerequisites

```bash
Node.js 18+  |  npm 9+  |  PostgreSQL 14+
```

### 1️⃣ Clone & Install

```bash
# Clone the repository
git clone <repository-url>
cd Stock-Management-System

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2️⃣ Environment Configuration

<details>
<summary><b>Backend Configuration</b> (<code>backend/.env</code>)</summary>

```env
# Database
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/production_db"
SHADOW_DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/production_db_shadow"

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET="your_super_secret_jwt_key_change_this_in_production"
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:5173

# File Upload
MAX_FILE_SIZE=5242880
MAX_FILES=10
```

</details>

<details>
<summary><b>Frontend Configuration</b> (<code>frontend/.env</code>)</summary>

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_USE_MOCK=false
```

</details>

### 3️⃣ Database Setup

```bash
cd backend

# Run migrations
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate

# Seed demo data
npx prisma db seed
```

### 4️⃣ Launch Applications

<table>
<tr>
<td width="50%">

**Backend Server**

```bash
cd backend
npm run dev
```

🟢 Running on `http://localhost:5000`

</td>
<td width="50%">

**Frontend App**

```bash
cd frontend
npm run dev
```

🟢 Running on `http://localhost:5173`

</td>
</tr>
</table>

---

## 🧪 Demo Accounts

After seeding, use these credentials to explore different roles:

| Role              | Username     | Password      | Access Level                                    |
| ----------------- | ------------ | ------------- | ----------------------------------------------- |
| 🔴 **SuperAdmin** | `superadmin` | `password123` | Full system access, user management, financials |
| 🟡 **Admin**      | `admin`      | `password123` | Stock, production, orders, content management   |
| 🟢 **Customer**   | `customer`   | `password123` | Browse products, place orders, track deliveries |

> ⚠️ **Security Warning**: Change these credentials immediately in production!

---

## 🛠️ Tech Stack

### Backend Architecture

```
┌─────────────────────────────────────────────┐
│  Express.js REST API                        │
├─────────────────────────────────────────────┤
│  • JWT Authentication                       │
│  • Prisma ORM                               │
│  • PostgreSQL Database                      │
│  • Multer File Uploads                      │
│  • Helmet Security                          │
│  • Morgan Logging                           │
└─────────────────────────────────────────────┘
```

**Core Technologies:**

- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.19
- **Database**: PostgreSQL 14+ with Prisma ORM 6.0
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Joi
- **File Handling**: Multer
- **Security**: Helmet, bcryptjs, CORS

### Frontend Architecture

```
┌─────────────────────────────────────────────┐
│  React 19 SPA                               │
├─────────────────────────────────────────────┤
│  • Vite Build Tool                          │
│  • React Router v7                          │
│  • Tailwind CSS v4                          │
│  • Recharts Analytics                       │
│  • Lucide Icons                             │
└─────────────────────────────────────────────┘
```

**Core Technologies:**

- **Framework**: React 19.2
- **Build Tool**: Vite 7.3
- **Routing**: React Router DOM 7.13
- **Styling**: Tailwind CSS 4.1
- **Charts**: Recharts 3.7
- **Icons**: Lucide React

---

## 📁 Project Structure

```
Stock-Management-System/
├── 📂 backend/
│   ├── 📂 prisma/
│   │   ├── schema.prisma          # Database schema
│   │   ├── seed.js                # Demo data seeder
│   │   └── migrations/            # Database migrations
│   ├── 📂 src/
│   │   ├── 📂 config/             # Configuration files
│   │   ├── 📂 controllers/        # Request handlers
│   │   ├── 📂 middleware/         # Auth, validation, logging
│   │   ├── 📂 routes/             # API routes
│   │   ├── 📂 services/           # Business logic
│   │   ├── 📂 utils/              # Helper functions
│   │   ├── app.js                 # Express app setup
│   │   └── server.js              # Server entry point
│   ├── 📂 uploads/                # User-uploaded files
│   └── package.json
│
├── 📂 frontend/
│   ├── 📂 src/
│   │   ├── 📂 components/         # Reusable UI components
│   │   ├── 📂 pages/              # Route pages
│   │   │   ├── admin/             # Admin dashboard
│   │   │   ├── superAdmin/        # SuperAdmin features
│   │   │   └── customer/          # Customer interface
│   │   ├── 📂 utils/              # Utilities & helpers
│   │   ├── 📂 assets/             # Images & static files
│   │   ├── App.jsx                # Root component
│   │   └── main.jsx               # Entry point
│   └── package.json
│
├── api_spec.yaml                  # OpenAPI specification
└── README.md
```

---

## 🔌 API Reference

### Base URL

```
http://localhost:5000/api
```

### Core Endpoints

<details>
<summary><b>🔐 Authentication</b></summary>

```http
POST   /api/auth/register          # Register new user
POST   /api/auth/login             # Login
POST   /api/auth/logout            # Logout
POST   /api/auth/forgot-password   # Request password reset
POST   /api/auth/reset-password    # Reset password
GET    /api/auth/me                # Get current user
```

</details>

<details>
<summary><b>📦 Stock Management</b></summary>

```http
GET    /api/stock                  # List all stock items
GET    /api/stock/:id              # Get stock item
POST   /api/stock                  # Create stock item (Admin+)
PUT    /api/stock/:id              # Update stock item (Admin+)
DELETE /api/stock/:id              # Delete stock item (Admin+)
```

</details>

<details>
<summary><b>🏭 Production</b></summary>

```http
GET    /api/production             # List production records
GET    /api/production/:id         # Get production record
POST   /api/production             # Create production (Admin+)
PUT    /api/production/:id         # Update production (Admin+)
DELETE /api/production/:id         # Delete production (Admin+)
```

</details>

<details>
<summary><b>🛍️ Products & Orders</b></summary>

```http
GET    /api/products               # List products (Public)
GET    /api/products/:id           # Get product (Public)
POST   /api/products               # Create product (Admin+)
PUT    /api/products/:id           # Update product (Admin+)
DELETE /api/products/:id           # Delete product (Admin+)

GET    /api/orders                 # List orders
GET    /api/orders/:id             # Get order
POST   /api/orders                 # Create order (Authenticated)
PUT    /api/orders/:id             # Update order (Admin+)
DELETE /api/orders/:id             # Delete order (Admin+)
```

</details>

<details>
<summary><b>👥 User Management</b></summary>

```http
GET    /api/users                  # List users (SuperAdmin)
GET    /api/users/:id              # Get user (SuperAdmin)
POST   /api/users                  # Create user (SuperAdmin)
PUT    /api/users/:id              # Update user (SuperAdmin)
DELETE /api/users/:id              # Delete user (SuperAdmin)
```

</details>

<details>
<summary><b>📊 Reports</b></summary>

```http
GET    /api/reports/stock          # Stock report (Admin+)
GET    /api/reports/production     # Production report (Admin+)
GET    /api/reports/orders         # Orders report (Admin+)
GET    /api/reports/sales          # Sales report (Admin+)
GET    /api/reports/payments       # Payments report (SuperAdmin)
```

</details>

<details>
<summary><b>🔍 Audit Logs</b></summary>

```http
GET    /api/audit-logs             # List audit logs (SuperAdmin)
GET    /api/audit-logs/:id         # Get audit log (SuperAdmin)
GET    /api/audit-logs/stats       # Get statistics (SuperAdmin)
DELETE /api/audit-logs/cleanup     # Cleanup old logs (SuperAdmin)
```

</details>

### 📄 Full API Documentation

- **OpenAPI Spec**: [`api_spec.yaml`](./api_spec.yaml)
- **Postman Collection**: [`backend/postman/SMS_API_Collection.json`](./backend/postman/SMS_API_Collection.json)

---

## 📚 Documentation

| Document                                           | Description                     |
| -------------------------------------------------- | ------------------------------- |
| [DATABASE_SETUP.md](./backend/DATABASE_SETUP.md)   | Database configuration guide    |
| [MIGRATION_GUIDE.md](./backend/MIGRATION_GUIDE.md) | Database migration instructions |
| [CREDENTIALS.md](./backend/CREDENTIALS.md)         | Credentials management          |

---

## 🧩 Available Scripts

### Backend Commands

```bash
npm run dev              # Start development server with nodemon
npm start                # Start production server
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run database migrations
```

### Frontend Commands

```bash
npm run dev              # Start Vite dev server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run ESLint
```

---

## 🐛 Troubleshooting

<details>
<summary><b>Database Connection Issues</b></summary>

```bash
# Verify PostgreSQL is running
sudo systemctl status postgresql

# Check DATABASE_URL in backend/.env
# Ensure user has proper permissions
psql -U your_username -d production_db
```

</details>

<details>
<summary><b>Prisma Migration Errors</b></summary>

```bash
# Use migrate deploy instead of migrate dev if shadow DB permission denied
npx prisma migrate deploy

# Reset database (WARNING: Deletes all data)
npx prisma migrate reset
```

</details>

<details>
<summary><b>Frontend API Connection Failed</b></summary>

- Verify `VITE_API_BASE_URL` in `frontend/.env` matches backend URL
- Ensure backend server is running on the correct port
- Check browser console for CORS errors

</details>

<details>
<summary><b>File Upload Issues</b></summary>

- Check `MAX_FILE_SIZE` in backend `.env`
- Ensure `uploads/` directory exists and has write permissions
- Verify Multer configuration in `backend/src/config/multer.js`

</details>

---

## 🔒 Security Best Practices

- [ ] Change default JWT_SECRET in production
- [ ] Update demo account passwords
- [ ] Enable HTTPS in production
- [ ] Configure proper CORS origins
- [ ] Set up rate limiting
- [ ] Regular security audits
- [ ] Keep dependencies updated
- [ ] Implement backup strategy

---

## 📈 Performance Optimization

- **Database**: Indexed queries on frequently accessed fields
- **Frontend**: Code splitting with React.lazy()
- **API**: Response caching for static data
- **Images**: Optimized uploads with Multer
- **Build**: Vite's optimized production builds

---

## 🤝 Contributing

This is a proprietary project for Nile Technology Solutions. For internal contributions:

1. Create a feature branch
2. Make your changes
3. Submit a pull request
4. Wait for code review

---

## 📄 License

**Proprietary and Confidential**

© 2026 Nile Technology Solutions. All rights reserved.

---

<div align="center">

### 🌟 Built with ❤️ for Nile Technology Solutions

**Questions?** Contact the development team

</div>
