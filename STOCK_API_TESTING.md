# Stock Module API - Testing Guide

## Overview
All 5 Stock CRUD endpoints are now implemented and ready for testing.

## Setup for Independent Testing

Since authentication (BE2) and database (BE1) are handled by other team members, follow these steps to test independently:

### Step 1: Run Database Migration
```bash
cd backend
npx prisma migrate dev --name update_stock_schema
npx prisma generate
```

### Step 2: Add Test Data (Optional)
```bash
node prisma/seed.js
```

### Step 3: Generate Test Token
```bash
node test-token-generator.js
```
Copy the ADMIN TOKEN from the output.

### Step 4: Start Server
```bash
npm run dev
```

## Authentication
All endpoints require Bearer token authentication.
Add to Headers: `Authorization: Bearer <your_jwt_token>`

**Get your token from:** Run `node test-token-generator.js` in the backend folder

## Endpoints

### 1. GET /api/stock
Get all stock materials with optional filtering

**Query Parameters:**
- `origin` (optional): Filter by "Local" or "Imported"
- `laminated` (optional): Filter by true/false

**Example:**
```
GET http://localhost:5000/api/stock
GET http://localhost:5000/api/stock?origin=Imported
GET http://localhost:5000/api/stock?laminated=true
```

### 2. GET /api/stock/:id
Get a single stock material by ID

**Example:**
```
GET http://localhost:5000/api/stock/1
```

### 3. POST /api/stock
Create new stock material (Admin only)

**Required Fields:**
- name (string)
- quantity (integer)
- color (string)
- size (string)
- thickness (string)
- origin (string: "Local" or "Imported")

**Optional Fields:**
- laminated (boolean, default: false)
- typeNote (string)

**Example Body:**
```json
{
  "name": "Laminated MDF Board",
  "quantity": 50,
  "color": "Dark Oak",
  "size": "1220mm x 2440mm",
  "thickness": "18mm",
  "laminated": true,
  "origin": "Imported",
  "typeNote": "High-density water resistant"
}
```

### 4. PUT /api/stock/:id
Update stock material (Admin only)

All fields are optional. Only send fields you want to update.

**Example Body:**
```json
{
  "quantity": 45,
  "color": "Light Oak"
}
```

### 5. DELETE /api/stock/:id
Delete stock material (Admin only)

**Example:**
```
DELETE http://localhost:5000/api/stock/1
```

## Response Formats

### Success Responses
- GET all: Returns array of stock items
- GET by ID: Returns single stock item object
- POST: Returns created item with message
- PUT: Returns updated item with message
- DELETE: Returns success message

### Error Responses
- 400: Validation errors or invalid ID
- 401: Unauthorized (missing/invalid token)
- 403: Forbidden (insufficient permissions)
- 404: Stock item not found

## Database Migration
After schema changes, run:
```bash
npx prisma migrate dev --name update_stock_schema
npx prisma generate
```
