# Design Document: Stock Module CRUD

## Overview

The Stock Module provides a complete RESTful API for managing inventory items in a Stock Management System. The module implements full CRUD operations (Create, Read, Update, Delete) with authentication, authorization, input validation, and comprehensive error handling.

The implementation uses Node.js with Express framework, Prisma ORM for database operations, and PostgreSQL for data persistence. The module integrates with existing JWT-based authentication and role-based authorization middleware.

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                        API Layer                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Stock Routes (/api/stock)                           │   │
│  │  - GET    /          (List all, paginated)           │   │
│  │  - GET    /:id       (Get single item)               │   │
│  │  - POST   /          (Create new item)               │   │
│  │  - PUT    /:id       (Update existing item)          │   │
│  │  - DELETE /:id       (Delete item)                   │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Middleware Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │ Auth         │→ │ Role         │→ │ Validation       │  │
│  │ Middleware   │  │ Middleware   │  │ (in controller)  │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   Controller Layer                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Stock Controller                                     │   │
│  │  - getAllStock()                                      │   │
│  │  - getStockById()                                     │   │
│  │  - createStock()                                      │   │
│  │  - updateStock()                                      │   │
│  │  - deleteStock()                                      │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                     Data Access Layer                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Prisma Client                                        │   │
│  │  - stock.findMany()                                   │   │
│  │  - stock.findUnique()                                 │   │
│  │  - stock.create()                                     │   │
│  │  - stock.update()                                     │   │
│  │  - stock.delete()                                     │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    PostgreSQL Database                       │
│                      Stock Table                             │
└─────────────────────────────────────────────────────────────┘
```

### Request Flow

1. **Request Reception**: Express receives HTTP request at stock endpoint
2. **Authentication**: authMiddleware validates JWT token and extracts user info
3. **Authorization**: roleMiddleware checks user role against required permissions
4. **Validation**: Controller validates request body/parameters
5. **Business Logic**: Controller processes request and calls Prisma
6. **Data Access**: Prisma executes database query
7. **Response**: Controller formats and returns JSON response
8. **Error Handling**: errorMiddleware catches and formats any errors

## Components and Interfaces

### 1. Stock Model (Prisma Schema)

```prisma
model Stock {
  id          Int      @id @default(autoincrement())
  name        String
  description String?
  quantity    Int      @default(0)
  price       Decimal  @db.Decimal(10, 2)
  category    String?
  supplier    String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

**Field Specifications:**
- `id`: Auto-incrementing primary key
- `name`: Required, non-empty string (max 255 chars)
- `description`: Optional text field
- `quantity`: Required integer, must be >= 0
- `price`: Required decimal with 2 decimal places, must be > 0
- `category`: Optional string for categorization
- `supplier`: Optional string for supplier name
- `createdAt`: Auto-generated timestamp
- `updatedAt`: Auto-updated timestamp

### 2. Stock Routes

**File**: `backend/src/routes/stockRoutes.js`

```javascript
const router = require('express').Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const stockController = require('../controllers/stockController');

// Public/authenticated read operations
router.get('/', authMiddleware, stockController.getAllStock);
router.get('/:id', authMiddleware, stockController.getStockById);

// Admin-only write operations
router.post('/', authMiddleware, roleMiddleware(['admin']), stockController.createStock);
router.put('/:id', authMiddleware, roleMiddleware(['admin']), stockController.updateStock);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), stockController.deleteStock);

module.exports = router;
```

### 3. Stock Controller

**File**: `backend/src/controllers/stockController.js`

**Interface:**

```javascript
// GET /api/stock?page=1&limit=10&category=electronics
getAllStock(req, res, next)
  Input: Query params (page, limit, category, supplier)
  Output: { data: Stock[], pagination: { page, limit, total, totalPages } }
  Errors: 500 on database error

// GET /api/stock/:id
getStockById(req, res, next)
  Input: Path param (id)
  Output: { data: Stock }
  Errors: 404 if not found, 400 if invalid ID, 500 on database error

// POST /api/stock
createStock(req, res, next)
  Input: Body { name, description?, quantity, price, category?, supplier? }
  Output: { data: Stock, message: "Stock item created successfully" }
  Errors: 400 on validation error, 500 on database error

// PUT /api/stock/:id
updateStock(req, res, next)
  Input: Path param (id), Body { name?, description?, quantity?, price?, category?, supplier? }
  Output: { data: Stock, message: "Stock item updated successfully" }
  Errors: 404 if not found, 400 on validation error, 500 on database error

// DELETE /api/stock/:id
deleteStock(req, res, next)
  Input: Path param (id)
  Output: { message: "Stock item deleted successfully" }
  Errors: 404 if not found, 400 if invalid ID, 500 on database error
```

### 4. Validation Rules

**Input Validation Logic:**

```javascript
// Create validation
function validateCreateStock(data) {
  const errors = [];
  
  if (!data.name || typeof data.name !== 'string' || data.name.trim() === '') {
    errors.push('Name is required and must be a non-empty string');
  }
  
  if (data.name && data.name.length > 255) {
    errors.push('Name must not exceed 255 characters');
  }
  
  if (data.quantity === undefined || data.quantity === null) {
    errors.push('Quantity is required');
  }
  
  if (typeof data.quantity !== 'number' || !Number.isInteger(data.quantity)) {
    errors.push('Quantity must be an integer');
  }
  
  if (data.quantity < 0) {
    errors.push('Quantity must be greater than or equal to 0');
  }
  
  if (!data.price) {
    errors.push('Price is required');
  }
  
  if (typeof data.price !== 'number' || data.price <= 0) {
    errors.push('Price must be a positive number');
  }
  
  if (data.description !== undefined && typeof data.description !== 'string') {
    errors.push('Description must be a string');
  }
  
  if (data.category !== undefined && typeof data.category !== 'string') {
    errors.push('Category must be a string');
  }
  
  if (data.supplier !== undefined && typeof data.supplier !== 'string') {
    errors.push('Supplier must be a string');
  }
  
  return errors;
}

// Update validation (all fields optional but must be valid if provided)
function validateUpdateStock(data) {
  const errors = [];
  
  if (data.name !== undefined) {
    if (typeof data.name !== 'string' || data.name.trim() === '') {
      errors.push('Name must be a non-empty string');
    }
    if (data.name.length > 255) {
      errors.push('Name must not exceed 255 characters');
    }
  }
  
  if (data.quantity !== undefined) {
    if (typeof data.quantity !== 'number' || !Number.isInteger(data.quantity)) {
      errors.push('Quantity must be an integer');
    }
    if (data.quantity < 0) {
      errors.push('Quantity must be greater than or equal to 0');
    }
  }
  
  if (data.price !== undefined) {
    if (typeof data.price !== 'number' || data.price <= 0) {
      errors.push('Price must be a positive number');
    }
  }
  
  if (data.description !== undefined && data.description !== null && typeof data.description !== 'string') {
    errors.push('Description must be a string');
  }
  
  if (data.category !== undefined && data.category !== null && typeof data.category !== 'string') {
    errors.push('Category must be a string');
  }
  
  if (data.supplier !== undefined && data.supplier !== null && typeof data.supplier !== 'string') {
    errors.push('Supplier must be a string');
  }
  
  return errors;
}
```

## Data Models

### Stock Item

**TypeScript Interface (for reference):**

```typescript
interface Stock {
  id: number;
  name: string;
  description: string | null;
  quantity: number;
  price: number;
  category: string | null;
  supplier: string | null;
  createdAt: Date;
  updatedAt: Date;
}
```

### API Request/Response Models

**Create Stock Request:**
```json
{
  "name": "Laptop",
  "description": "Dell XPS 15",
  "quantity": 10,
  "price": 1299.99,
  "category": "Electronics",
  "supplier": "Dell Inc."
}
```

**Update Stock Request:**
```json
{
  "quantity": 15,
  "price": 1199.99
}
```

**Stock Response:**
```json
{
  "data": {
    "id": 1,
    "name": "Laptop",
    "description": "Dell XPS 15",
    "quantity": 10,
    "price": 1299.99,
    "category": "Electronics",
    "supplier": "Dell Inc.",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**List Stock Response (with pagination):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Laptop",
      "description": "Dell XPS 15",
      "quantity": 10,
      "price": 1299.99,
      "category": "Electronics",
      "supplier": "Dell Inc.",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

**Error Response:**
```json
{
  "message": "Validation failed",
  "errors": [
    "Name is required and must be a non-empty string",
    "Price must be a positive number"
  ]
}
```

### Authentication and Authorization

**Authentication Flow:**
1. Client includes JWT token in Authorization header: `Bearer <token>`
2. authMiddleware extracts and verifies token
3. User payload (id, email, role) attached to `req.user`
4. Request proceeds to next middleware/controller

**Authorization Rules:**
- **Read Operations** (GET /api/stock, GET /api/stock/:id):
  - Requires: Valid JWT token
  - Allowed roles: Any authenticated user (admin, user)
  
- **Write Operations** (POST, PUT, DELETE):
  - Requires: Valid JWT token + admin role
  - Allowed roles: admin only
  - Returns 403 Forbidden if non-admin attempts write operation

**Token Payload Structure:**
```javascript
{
  id: 1,
  email: "user@example.com",
  role: "admin" // or "user"
}
```


## Error Handling

### Error Categories

**1. Authentication Errors (401 Unauthorized)**
- Missing Authorization header
- Invalid JWT token format
- Expired JWT token
- Token verification failure

**Response:**
```json
{
  "message": "Unauthorized"
}
```

**2. Authorization Errors (403 Forbidden)**
- Valid token but insufficient permissions
- Non-admin user attempting write operations

**Response:**
```json
{
  "message": "Forbidden"
}
```

**3. Validation Errors (400 Bad Request)**
- Missing required fields
- Invalid data types
- Out-of-range values
- Invalid ID format

**Response:**
```json
{
  "message": "Validation failed",
  "errors": [
    "Name is required and must be a non-empty string",
    "Quantity must be greater than or equal to 0"
  ]
}
```

**4. Not Found Errors (404 Not Found)**
- Stock item with specified ID does not exist
- Invalid route

**Response:**
```json
{
  "message": "Stock item not found"
}
```

**5. Server Errors (500 Internal Server Error)**
- Database connection failures
- Unexpected runtime errors
- Prisma query errors

**Response:**
```json
{
  "message": "Internal server error"
}
```

### Error Handling Strategy

**Controller-Level Error Handling:**
```javascript
// Example: getStockById
async getStockById(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    
    // Validation
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ message: 'Invalid stock ID' });
    }
    
    // Database query
    const stock = await prisma.stock.findUnique({ where: { id } });
    
    // Not found check
    if (!stock) {
      return res.status(404).json({ message: 'Stock item not found' });
    }
    
    // Success response
    return res.status(200).json({ data: stock });
    
  } catch (error) {
    // Pass to error middleware
    next(error);
  }
}
```

**Middleware-Level Error Handling:**
- Express error middleware catches unhandled errors
- Logs error details for debugging
- Returns sanitized error response to client
- Prevents sensitive information leakage


## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Data Model and Validation Properties

**Property 1: Required fields presence**
*For any* stock item in the database, it must have non-null values for id, name, quantity, price, createdAt, and updatedAt fields.
**Validates: Requirements 1.1**

**Property 2: Name validation**
*For any* string input as a stock name, the system should accept it if and only if it is non-empty (after trimming) and has length <= 255 characters.
**Validates: Requirements 1.2**

**Property 3: Quantity non-negativity**
*For any* integer input as quantity, the system should accept it if and only if it is >= 0.
**Validates: Requirements 1.3**

**Property 4: Price positivity**
*For any* numeric input as price, the system should accept it if and only if it is > 0.
**Validates: Requirements 1.4**

### CRUD Operation Properties

**Property 5: Create-then-retrieve consistency (Round trip)**
*For any* valid stock item data, after creating the item via POST /api/stock, retrieving it by the returned ID via GET /api/stock/:id should return an item with equivalent field values (excluding auto-generated fields like id and timestamps).
**Validates: Requirements 3.1, 3.3**

**Property 6: Update preserves unmodified fields**
*For any* existing stock item and any partial update data, after updating via PUT /api/stock/:id, all fields not included in the update request should retain their original values.
**Validates: Requirements 4.2**

**Property 7: Update-then-retrieve consistency**
*For any* existing stock item and valid update data, after updating via PUT /api/stock/:id, retrieving the item should return the updated values for modified fields.
**Validates: Requirements 4.1**

**Property 8: Delete removes item**
*For any* existing stock item, after deleting via DELETE /api/stock/:id, attempting to retrieve that item via GET /api/stock/:id should return 404.
**Validates: Requirements 5.1, 5.3**

**Property 9: Pagination subset correctness**
*For any* collection of stock items and pagination parameters (page, limit), the returned items should be a correct subset based on the pagination formula: items from index (page-1)*limit to page*limit-1.
**Validates: Requirements 2.1, 2.2**

### Authentication and Authorization Properties

**Property 10: Authentication requirement**
*For any* stock API endpoint, requests without a valid JWT token should return 401 Unauthorized.
**Validates: Requirements 6.1**

**Property 11: Admin-only write operations**
*For any* write operation (POST, PUT, DELETE) on stock endpoints, requests with valid tokens but non-admin role should return 403 Forbidden.
**Validates: Requirements 6.2**

**Property 12: Authenticated read access**
*For any* read operation (GET) on stock endpoints, requests with valid tokens (regardless of role) should succeed (return 200 or 404, not 401/403).
**Validates: Requirements 6.3**

### Error Handling Properties

**Property 13: Invalid input rejection**
*For any* stock creation or update request with invalid data (empty name, negative quantity, non-positive price), the system should return 400 with descriptive error messages listing all validation failures.
**Validates: Requirements 3.2, 4.4, 7.3**

**Property 14: Idempotent validation**
*For any* invalid stock data, validating it multiple times should produce the same validation errors (validation is deterministic and stateless).
**Validates: Requirements 3.2, 4.4**


## Testing Strategy

### Dual Testing Approach

The Stock Module will be validated using both unit tests and property-based tests. These approaches are complementary and together provide comprehensive coverage:

- **Unit tests**: Verify specific examples, edge cases, and error conditions
- **Property tests**: Verify universal properties across all inputs

Unit tests are helpful for concrete scenarios and integration points, while property-based tests handle comprehensive input coverage through randomization. We should avoid writing too many unit tests since property-based tests already cover many input variations.

### Property-Based Testing

**Framework**: We will use **fast-check** for JavaScript/Node.js property-based testing.

**Configuration**:
- Each property test must run a minimum of 100 iterations
- Each test must reference its corresponding design document property
- Tag format: `// Feature: stock-module-crud, Property {number}: {property_text}`

**Property Test Coverage**:

1. **Data Validation Properties** (Properties 1-4)
   - Generate random strings, numbers, and objects
   - Test boundary conditions (empty strings, zero, negative numbers, max length)
   - Verify validation logic accepts/rejects correctly

2. **CRUD Round-Trip Properties** (Properties 5, 7, 8)
   - Generate random valid stock items
   - Perform create/update/delete operations
   - Verify data consistency after operations

3. **Partial Update Property** (Property 6)
   - Generate random stock items and random partial updates
   - Verify unchanged fields remain constant

4. **Pagination Property** (Property 9)
   - Generate random collections of stock items
   - Test various page/limit combinations
   - Verify correct subsets returned

5. **Authentication/Authorization Properties** (Properties 10-12)
   - Generate requests with various token states (missing, invalid, valid with different roles)
   - Verify correct HTTP status codes

6. **Error Handling Properties** (Properties 13-14)
   - Generate invalid inputs
   - Verify error responses are consistent and descriptive

**Example Property Test Structure**:

```javascript
// Feature: stock-module-crud, Property 5: Create-then-retrieve consistency
const fc = require('fast-check');

describe('Stock CRUD Properties', () => {
  it('should maintain consistency when creating then retrieving stock items', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          name: fc.string({ minLength: 1, maxLength: 255 }),
          description: fc.option(fc.string()),
          quantity: fc.nat(),
          price: fc.double({ min: 0.01, max: 999999 }),
          category: fc.option(fc.string()),
          supplier: fc.option(fc.string())
        }),
        async (stockData) => {
          // Create stock item
          const createResponse = await request(app)
            .post('/api/stock')
            .set('Authorization', `Bearer ${adminToken}`)
            .send(stockData);
          
          expect(createResponse.status).toBe(201);
          const createdId = createResponse.body.data.id;
          
          // Retrieve stock item
          const getResponse = await request(app)
            .get(`/api/stock/${createdId}`)
            .set('Authorization', `Bearer ${adminToken}`);
          
          expect(getResponse.status).toBe(200);
          expect(getResponse.body.data.name).toBe(stockData.name);
          expect(getResponse.body.data.quantity).toBe(stockData.quantity);
          expect(getResponse.body.data.price).toBe(stockData.price);
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Unit Testing

**Framework**: Jest with Supertest for API testing

**Unit Test Focus Areas**:

1. **Edge Cases**:
   - Empty database queries
   - Non-existent IDs (404 scenarios)
   - Invalid ID formats (non-numeric, negative)
   - Boundary values (quantity = 0, price = 0.01)

2. **Specific Examples**:
   - Creating a stock item with all fields populated
   - Creating a stock item with only required fields
   - Updating a single field
   - Deleting an item and verifying it's gone

3. **Integration Points**:
   - Middleware chain execution (auth → role → controller)
   - Prisma client interactions
   - Error middleware handling

4. **Error Conditions**:
   - Missing required fields
   - Invalid data types
   - Unauthorized access attempts
   - Database connection failures (mocked)

**Example Unit Test**:

```javascript
describe('Stock Controller - Edge Cases', () => {
  it('should return 404 when getting non-existent stock item', async () => {
    const response = await request(app)
      .get('/api/stock/99999')
      .set('Authorization', `Bearer ${adminToken}`);
    
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Stock item not found');
  });
  
  it('should return 400 for invalid ID format', async () => {
    const response = await request(app)
      .get('/api/stock/invalid')
      .set('Authorization', `Bearer ${adminToken}`);
    
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid stock ID');
  });
});
```

### Manual Testing with Postman

**Postman Collection Structure**:

1. **Environment Variables**:
   - `baseUrl`: http://localhost:3000
   - `adminToken`: JWT token for admin user
   - `userToken`: JWT token for regular user
   - `stockId`: Dynamic variable for created stock ID

2. **Test Scenarios**:
   - Authentication tests (missing token, invalid token)
   - Authorization tests (user vs admin access)
   - CRUD operations (create, read, update, delete)
   - Validation tests (invalid inputs)
   - Pagination tests (various page/limit combinations)
   - Filter tests (by category, supplier)

3. **Postman Tests** (automated assertions):
   ```javascript
   // Example: Create Stock Item
   pm.test("Status code is 201", function () {
       pm.response.to.have.status(201);
   });
   
   pm.test("Response has stock ID", function () {
       var jsonData = pm.response.json();
       pm.expect(jsonData.data).to.have.property('id');
       pm.environment.set("stockId", jsonData.data.id);
   });
   ```

### Test Coverage Goals

- **Line Coverage**: Minimum 80%
- **Branch Coverage**: Minimum 75%
- **Property Tests**: All 14 properties implemented
- **Unit Tests**: All edge cases and error conditions covered
- **Integration Tests**: All 5 endpoints tested end-to-end

### Continuous Testing

- Run unit tests on every commit
- Run property tests on every pull request
- Manual Postman testing before deployment
- Monitor test execution time (property tests may be slower due to 100+ iterations)

