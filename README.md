# Stock Management System

Full-stack stock, production, and order management system for Nile Technology Solutions.

## Overview

This repository contains:

- `backend`: Node.js + Express + Prisma API (PostgreSQL)
- `frontend`: React + Vite + Tailwind client app

Core modules include:

- Authentication and role-based access (`SuperAdmin`, `Admin`, `Customer`)
- Stock/material management
- Production tracking
- Product showcase and ordering
- Order and payment workflows
- To-do and news management
- Reporting endpoints

## Tech Stack

- Backend: Node.js, Express, Prisma ORM, PostgreSQL, JWT
- Frontend: React, Vite, React Router, Tailwind CSS

## Prerequisites

- Node.js 18+
- npm 9+
- PostgreSQL 14+

## Project Structure

```text
Stock-Management-System/
  backend/
    prisma/
    src/
  frontend/
    src/
  api_spec.yaml
```

## Quick Start (Local Development)

1. Install dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

2. Configure backend environment (`backend/.env`)

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/production_db?schema=public"
PORT=5000
JWT_SECRET="replace-with-a-strong-secret"
JWT_EXPIRES_IN="1d"
```

3. Configure frontend environment (`frontend/.env`)

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_USE_MOCK=false
```

4. Initialize database

```bash
cd backend
npx prisma db push
npx prisma generate
npx prisma db seed
```

5. Run both apps (in separate terminals)

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
cd frontend
npm run dev
```

6. Open the app

- Frontend: `http://localhost:5173`
- Backend health check: `http://localhost:5000/health`

## Seeded Demo Accounts

After `npx prisma db seed`:

- `superadmin` / `password123` (`SuperAdmin`)
- `admin` / `password123` (`Admin`)
- `customer` / `password123` (`Customer`)

Change these credentials before any production deployment.

## Available Scripts

Backend (`backend/package.json`):

- `npm run dev` - start API with `nodemon`
- `npm start` - start API with Node
- `npm run prisma:generate` - generate Prisma client
- `npm run prisma:migrate` - run Prisma dev migration

Frontend (`frontend/package.json`):

- `npm run dev` - start Vite dev server
- `npm run build` - production build
- `npm run preview` - preview production build
- `npm run lint` - run ESLint

## API Notes

- Primary route prefixes:
  - `/api/auth`
  - `/api/stock`
  - `/api/users`
  - `/api/production`
  - `/api/products`
  - `/api/orders`
  - `/api/todos`
  - `/api/news`
  - `/api/reports`
- OpenAPI spec is available at:
  - `/api_spec.yaml` (root)
  - `/backend/api_spec.yaml`
- Postman collection: `backend/postman/SMS_API_Collection.json`

## Troubleshooting

- If Prisma cannot connect, verify `DATABASE_URL` and that PostgreSQL is running.
- If frontend requests fail, verify `VITE_API_BASE_URL` matches backend host/port.
- If CORS/auth fails, confirm backend is running and token is present after login.

## License

Proprietary and confidential.
