<div align="center">

# 📦 Stock Management System (SMS)

### Enterprise-Grade Inventory, Production & E-Commerce Platform

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.0-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Express](https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)

[Features](#-key-features) • [Quick Start](#-quick-start) • [Tech Stack](#-tech-stack) • [Architecture](#-architecture) • [API Reference](#-api-reference)

</div>

---

## 🎯 Overview

The **Stock Management System (SMS)** is a comprehensive, full-stack enterprise solution built for **Nile Technology Solutions**. It bridges the gap between internal manufacturing operations and public e-commerce by offering a seamless, unified platform. 

Whether tracking raw materials, monitoring live production workflows, managing financial reporting, or selling finished goods online, SMS is designed for performance, security, and scalability.

---

## 🏗️ Architecture

The system enforces a strict **Role-Based Access Control (RBAC)** architecture to ensure data security and operational isolation across different business domains.

```mermaid
graph TD
    %% Roles
    SuperAdmin[Super Admin]
    Admin[Admin]
    Customer[Customer]

    %% Modules
    SysAdmin((System Admin))
    Finances((Finances & Audit))
    Inventory((Raw Inventory))
    Production((Production Line))
    Shop((E-Commerce))
    Orders((Order Fulfillment))

    %% Connections
    SuperAdmin ==>|Full Access| SysAdmin
    SuperAdmin ==>|Full Access| Finances
    SuperAdmin -.->|Inherits| Admin

    Admin ==>|Manages| Inventory
    Admin ==>|Tracks| Production
    Admin ==>|Processes| Orders

    Customer ==>|Browses| Shop
    Customer ==>|Places| Orders
    
    classDef roles fill:#2D3748,stroke:#4A5568,stroke-width:2px,color:#fff,font-weight:bold;
    classDef modules fill:#E2E8F0,stroke:#CBD5E0,stroke-width:2px,color:#1A202C;
    
    class SuperAdmin,Admin,Customer roles;
    class SysAdmin,Finances,Inventory,Production,Shop,Orders modules;
```

---

## ✨ Key Features

<div className="grid grid-cols-1 md:grid-cols-2 gap-4">

### 🔐 Security & Identity
- **JWT-based Authentication** with secure token handling.
- **Granular RBAC** (SuperAdmin, Admin, Customer).
- **Comprehensive Audit Logs** tracking over 25 unique system actions.
- **Secure File Uploads** via Multer with MIME-type validation.

### 📦 Raw Material & Inventory
- **Real-Time Stock Tracking** with low-stock alerts.
- **Detailed Attributes** (Origin: Local/Imported, Size, Color, Lamination).
- **Category Management** for hierarchical material grouping.

### 🏭 Production Monitoring
- **Workflow Tracking** from raw material to finished product.
- **Automated Stock Deduction** upon production initiation.
- **Visual Documentation** via multi-image upload galleries.
- **Progress Tracking** (0-100% completion metrics).

### 🛍️ Public E-Commerce & Orders
- **Dynamic Product Showcase** with variant and stock sync.
- **Customer Order Pipeline** (Submitted → Processing → Shipped).
- **Integrated Payments** supporting Chapa & Telebirr APIs.
- **Responsive Modern UI** featuring glassmorphism and micro-animations.

</div>

---

## 🚀 Quick Start

### Prerequisites

Ensure you have the following installed on your local environment:
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)
- **PostgreSQL** (v14.0 or higher)

### 1️⃣ Installation

Clone the repository and install dependencies for both frontend and backend:

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

You will need to set up `.env` files in both the `frontend` and `backend` directories.

<details>
<summary><b>Backend <code>backend/.env</code></b></summary>

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/stock_management_db"

# JWT Auth
JWT_SECRET="your_highly_secure_256bit_jwt_secret_key"
JWT_EXPIRES_IN=1h

# Payment Gateways (Optional for dev)
CHAPA_SECRET_KEY="CHASECK_TEST-your-chapa-key"
CHAPA_WEBHOOK_SECRET="your-webhook-secret"

# Client URL
FRONTEND_URL=http://localhost:5173
```
</details>

<details>
<summary><b>Frontend <code>frontend/.env</code></b></summary>

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_USE_MOCK=false
```
</details>

### 3️⃣ Database Initialization

Set up the PostgreSQL database schema and seed it with initial admin accounts and demo data:

```bash
cd backend

# Deploy database migrations
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate

# Seed the database (Creates SuperAdmin, Categories, etc.)
npx prisma db seed
```

### 4️⃣ Start Development Servers

Run the backend and frontend simultaneously in separate terminal windows:

**Backend Server**
```bash
cd backend
npm run dev
# 🚀 Server running on http://localhost:5000
```

**Frontend Application**
```bash
cd frontend
npm run dev
# 🚀 App running on http://localhost:5173
```

---

## 🛠️ Tech Stack

### Frontend (Client-Side)
- **Core:** React 19, React Router v7
- **Build Tool:** Vite
- **Styling:** Tailwind CSS v4, PostCSS
- **Data Visualization:** Recharts
- **Icons:** Lucide React

### Backend (Server-Side)
- **Core:** Node.js, Express.js
- **Database:** PostgreSQL, Prisma ORM
- **Authentication:** JSON Web Tokens (JWT), bcryptjs
- **Validation:** Joi validation schemas
- **Storage:** Multer (Local disk storage)
- **Security:** Helmet, CORS

---

## 📁 Project Structure

```text
Stock-Management-System/
├── backend/
│   ├── prisma/
│   │   ├── migrations/       # SQL migration history
│   │   ├── schema.prisma     # Central DB schema & models
│   │   └── seed.js           # Database initialization script
│   ├── src/
│   │   ├── config/           # DB, Multer, and Env setup
│   │   ├── controllers/      # Route logic & request handling
│   │   ├── middleware/       # Auth guards, validators, error handlers
│   │   ├── routes/           # Express router definitions
│   │   ├── services/         # Core business logic & Prisma queries
│   │   └── app.js            # Express application bootstrapping
│   └── uploads/              # Local storage for product/news images
│
└── frontend/
    ├── src/
    │   ├── assets/           # Static files
    │   ├── components/       # Reusable UI (Cards, Tables, Modals)
    │   ├── config/           # Frontend environment settings
    │   ├── context/          # React Context (AuthContext)
    │   ├── hooks/            # Custom React hooks
    │   ├── pages/            # View components (Admin, Public, Auth)
    │   └── services/         # API client handlers (fetch wrappers)
    ├── index.html            # App entry HTML
    └── tailwind.config.js    # Design system configuration
```

---

## 🔌 API Reference

The backend exposes a fully RESTful API. Below are the primary resource domains.

| Resource | Endpoints | Authentication |
|----------|-----------|----------------|
| **Auth** | `/api/auth/*` | Public / Bearer Token |
| **Users** | `/api/users/*` | SuperAdmin |
| **Stock** | `/api/stock/*` | Admin, SuperAdmin |
| **Production** | `/api/production/*` | Admin, SuperAdmin |
| **Products** | `/api/products/*` | Public (GET), Admin (POST/PUT) |
| **Orders** | `/api/orders/*` | Customer (POST), Admin (PUT) |
| **Payments** | `/api/payments/*` | Customer, Admin |
| **Audit Logs** | `/api/audit-logs/*` | SuperAdmin |

> **Note:** A complete OpenAPI specification is available in the `api_spec.yaml` file located in the project root. You can import this file into Postman or Swagger UI.

---

## 🛡️ Security & Best Practices

To ensure enterprise-grade security before deploying to production:
1. **Rotate Secrets:** Replace all default `JWT_SECRET` and database passwords.
2. **HTTPS/TLS:** Ensure traffic is routed through HTTPS.
3. **CORS:** Restrict `CORS_ORIGIN` in the backend to your specific production frontend domain.
4. **Rate Limiting:** Implement a reverse proxy (e.g., Nginx, Cloudflare) with active rate-limiting.
5. **Storage:** Migrate the `uploads/` directory to a managed cloud storage bucket (e.g., AWS S3, Google Cloud Storage) if scaling horizontally.

---

<div align="center">
  <p><b>Proprietary and Confidential</b></p>
  <p>© 2026 Nile Technology Solutions. All rights reserved.</p>
</div>
