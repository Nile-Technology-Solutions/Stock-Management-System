const request = require('supertest');
const app = require('../app');
const prisma = require('../config/db');

// Mock authentication middleware for testing
jest.mock('../middleware/authMiddleware', () => (req, res, next) => {
  req.user = { id: 1, email: 'test@example.com', role: 'admin' };
  next();
});

describe('Stock Controller - getAllStock', () => {
  beforeAll(async () => {
    // Clean up test data
    await prisma.stock.deleteMany({});
  });

  afterEach(async () => {
    // Clean up after each test
    await prisma.stock.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('GET /api/stock', () => {
    it('should return empty array with pagination metadata when no stock items exist', async () => {
      const response = await request(app)
        .get('/api/stock')
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('pagination');
      expect(response.body.data).toEqual([]);
      expect(response.body.pagination).toEqual({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
      });
    });

    it('should return paginated stock items with default pagination', async () => {
      // Create test stock items
      await prisma.stock.createMany({
        data: [
          { name: 'Item 1', quantity: 10, price: 100 },
          { name: 'Item 2', quantity: 20, price: 200 },
          { name: 'Item 3', quantity: 30, price: 300 }
        ]
      });

      const response = await request(app)
        .get('/api/stock')
        .expect(200);

      expect(response.body.data).toHaveLength(3);
      expect(response.body.pagination).toEqual({
        page: 1,
        limit: 10,
        total: 3,
        totalPages: 1
      });
    });

    it('should respect custom page and limit parameters', async () => {
      // Create 15 test items
      const items = Array.from({ length: 15 }, (_, i) => ({
        name: `Item ${i + 1}`,
        quantity: i + 1,
        price: (i + 1) * 10
      }));
      await prisma.stock.createMany({ data: items });

      const response = await request(app)
        .get('/api/stock?page=2&limit=5')
        .expect(200);

      expect(response.body.data).toHaveLength(5);
      expect(response.body.pagination).toEqual({
        page: 2,
        limit: 5,
        total: 15,
        totalPages: 3
      });
      // Verify we got items 6-10 (second page)
      expect(response.body.data[0].name).toBe('Item 6');
    });

    it('should filter by category when provided', async () => {
      await prisma.stock.createMany({
        data: [
          { name: 'Laptop', quantity: 10, price: 1000, category: 'Electronics' },
          { name: 'Chair', quantity: 20, price: 200, category: 'Furniture' },
          { name: 'Mouse', quantity: 30, price: 50, category: 'Electronics' }
        ]
      });

      const response = await request(app)
        .get('/api/stock?category=Electronics')
        .expect(200);

      expect(response.body.data).toHaveLength(2);
      expect(response.body.pagination.total).toBe(2);
      expect(response.body.data.every(item => item.category === 'Electronics')).toBe(true);
    });

    it('should filter by supplier when provided', async () => {
      await prisma.stock.createMany({
        data: [
          { name: 'Item 1', quantity: 10, price: 100, supplier: 'Supplier A' },
          { name: 'Item 2', quantity: 20, price: 200, supplier: 'Supplier B' },
          { name: 'Item 3', quantity: 30, price: 300, supplier: 'Supplier A' }
        ]
      });

      const response = await request(app)
        .get('/api/stock?supplier=Supplier A')
        .expect(200);

      expect(response.body.data).toHaveLength(2);
      expect(response.body.pagination.total).toBe(2);
      expect(response.body.data.every(item => item.supplier === 'Supplier A')).toBe(true);
    });

    it('should filter by both category and supplier', async () => {
      await prisma.stock.createMany({
        data: [
          { name: 'Laptop', quantity: 10, price: 1000, category: 'Electronics', supplier: 'Dell' },
          { name: 'Chair', quantity: 20, price: 200, category: 'Furniture', supplier: 'IKEA' },
          { name: 'Mouse', quantity: 30, price: 50, category: 'Electronics', supplier: 'Logitech' },
          { name: 'Monitor', quantity: 15, price: 500, category: 'Electronics', supplier: 'Dell' }
        ]
      });

      const response = await request(app)
        .get('/api/stock?category=Electronics&supplier=Dell')
        .expect(200);

      expect(response.body.data).toHaveLength(2);
      expect(response.body.data.every(item => 
        item.category === 'Electronics' && item.supplier === 'Dell'
      )).toBe(true);
    });

    it('should return 400 for invalid page parameter', async () => {
      const response = await request(app)
        .get('/api/stock?page=0')
        .expect(400);

      expect(response.body.message).toContain('Invalid pagination parameters');
    });

    it('should return 400 for invalid limit parameter', async () => {
      const response = await request(app)
        .get('/api/stock?limit=-5')
        .expect(400);

      expect(response.body.message).toContain('Invalid pagination parameters');
    });

    it('should handle non-numeric pagination parameters gracefully', async () => {
      const response = await request(app)
        .get('/api/stock?page=abc&limit=xyz')
        .expect(200);

      // Should default to page=1, limit=10
      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(10);
    });
  });
});

describe('Stock Controller - getStockById', () => {
  beforeAll(async () => {
    // Clean up test data
    await prisma.stock.deleteMany({});
  });

  afterEach(async () => {
    // Clean up after each test
    await prisma.stock.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('GET /api/stock/:id', () => {
    it('should return stock item by valid ID', async () => {
      // Create a test stock item
      const created = await prisma.stock.create({
        data: {
          name: 'Test Item',
          description: 'Test Description',
          quantity: 10,
          price: 99.99,
          category: 'Test Category',
          supplier: 'Test Supplier'
        }
      });

      const response = await request(app)
        .get(`/api/stock/${created.id}`)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body.data.id).toBe(created.id);
      expect(response.body.data.name).toBe('Test Item');
      expect(response.body.data.description).toBe('Test Description');
      expect(response.body.data.quantity).toBe(10);
      expect(parseFloat(response.body.data.price)).toBe(99.99);
      expect(response.body.data.category).toBe('Test Category');
      expect(response.body.data.supplier).toBe('Test Supplier');
    });

    it('should return 404 for non-existent stock item', async () => {
      const response = await request(app)
        .get('/api/stock/99999')
        .expect(404);

      expect(response.body.message).toBe('Stock item not found');
    });

    it('should return 400 for invalid ID format (non-numeric)', async () => {
      const response = await request(app)
        .get('/api/stock/invalid')
        .expect(400);

      expect(response.body.message).toBe('Invalid stock ID');
    });

    it('should return 400 for invalid ID format (negative number)', async () => {
      const response = await request(app)
        .get('/api/stock/-1')
        .expect(400);

      expect(response.body.message).toBe('Invalid stock ID');
    });

    it('should return 400 for invalid ID format (zero)', async () => {
      const response = await request(app)
        .get('/api/stock/0')
        .expect(400);

      expect(response.body.message).toBe('Invalid stock ID');
    });

    it('should return 400 for invalid ID format (decimal)', async () => {
      const response = await request(app)
        .get('/api/stock/1.5')
        .expect(400);

      expect(response.body.message).toBe('Invalid stock ID');
    });

    it('should return stock item with null optional fields', async () => {
      // Create a stock item with only required fields
      const created = await prisma.stock.create({
        data: {
          name: 'Minimal Item',
          quantity: 5,
          price: 50.00
        }
      });

      const response = await request(app)
        .get(`/api/stock/${created.id}`)
        .expect(200);

      expect(response.body.data.name).toBe('Minimal Item');
      expect(response.body.data.description).toBeNull();
      expect(response.body.data.category).toBeNull();
      expect(response.body.data.supplier).toBeNull();
    });
  });
});

describe('Stock Controller - createStock', () => {
  beforeAll(async () => {
    // Clean up test data
    await prisma.stock.deleteMany({});
  });

  afterEach(async () => {
    // Clean up after each test
    await prisma.stock.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/stock', () => {
    it('should create stock item with all fields', async () => {
      const stockData = {
        name: 'Laptop',
        description: 'Dell XPS 15',
        quantity: 10,
        price: 1299.99,
        category: 'Electronics',
        supplier: 'Dell Inc.'
      };

      const response = await request(app)
        .post('/api/stock')
        .send(stockData)
        .expect(201);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('message', 'Stock item created successfully');
      expect(response.body.data.name).toBe(stockData.name);
      expect(response.body.data.description).toBe(stockData.description);
      expect(response.body.data.quantity).toBe(stockData.quantity);
      expect(parseFloat(response.body.data.price)).toBe(stockData.price);
      expect(response.body.data.category).toBe(stockData.category);
      expect(response.body.data.supplier).toBe(stockData.supplier);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('createdAt');
      expect(response.body.data).toHaveProperty('updatedAt');
    });

    it('should create stock item with only required fields', async () => {
      const stockData = {
        name: 'Basic Item',
        quantity: 5,
        price: 50.00
      };

      const response = await request(app)
        .post('/api/stock')
        .send(stockData)
        .expect(201);

      expect(response.body.data.name).toBe(stockData.name);
      expect(response.body.data.quantity).toBe(stockData.quantity);
      expect(parseFloat(response.body.data.price)).toBe(stockData.price);
      expect(response.body.data.description).toBeNull();
      expect(response.body.data.category).toBeNull();
      expect(response.body.data.supplier).toBeNull();
    });

    it('should return 400 when name is missing', async () => {
      const stockData = {
        quantity: 10,
        price: 100
      };

      const response = await request(app)
        .post('/api/stock')
        .send(stockData)
        .expect(400);

      expect(response.body.message).toBe('Validation failed');
      expect(response.body.errors).toContain('Name is required and must be a non-empty string');
    });

    it('should return 400 when name is empty string', async () => {
      const stockData = {
        name: '   ',
        quantity: 10,
        price: 100
      };

      const response = await request(app)
        .post('/api/stock')
        .send(stockData)
        .expect(400);

      expect(response.body.errors).toContain('Name is required and must be a non-empty string');
    });

    it('should return 400 when name exceeds 255 characters', async () => {
      const stockData = {
        name: 'a'.repeat(256),
        quantity: 10,
        price: 100
      };

      const response = await request(app)
        .post('/api/stock')
        .send(stockData)
        .expect(400);

      expect(response.body.errors).toContain('Name must not exceed 255 characters');
    });

    it('should return 400 when quantity is missing', async () => {
      const stockData = {
        name: 'Test Item',
        price: 100
      };

      const response = await request(app)
        .post('/api/stock')
        .send(stockData)
        .expect(400);

      expect(response.body.errors).toContain('Quantity is required');
    });

    it('should return 400 when quantity is negative', async () => {
      const stockData = {
        name: 'Test Item',
        quantity: -5,
        price: 100
      };

      const response = await request(app)
        .post('/api/stock')
        .send(stockData)
        .expect(400);

      expect(response.body.errors).toContain('Quantity must be greater than or equal to 0');
    });

    it('should return 400 when quantity is not an integer', async () => {
      const stockData = {
        name: 'Test Item',
        quantity: 10.5,
        price: 100
      };

      const response = await request(app)
        .post('/api/stock')
        .send(stockData)
        .expect(400);

      expect(response.body.errors).toContain('Quantity must be an integer');
    });

    it('should accept quantity of 0', async () => {
      const stockData = {
        name: 'Out of Stock Item',
        quantity: 0,
        price: 100
      };

      const response = await request(app)
        .post('/api/stock')
        .send(stockData)
        .expect(201);

      expect(response.body.data.quantity).toBe(0);
    });

    it('should return 400 when price is missing', async () => {
      const stockData = {
        name: 'Test Item',
        quantity: 10
      };

      const response = await request(app)
        .post('/api/stock')
        .send(stockData)
        .expect(400);

      expect(response.body.errors).toContain('Price is required');
    });

    it('should return 400 when price is zero', async () => {
      const stockData = {
        name: 'Test Item',
        quantity: 10,
        price: 0
      };

      const response = await request(app)
        .post('/api/stock')
        .send(stockData)
        .expect(400);

      expect(response.body.errors).toContain('Price must be a positive number');
    });

    it('should return 400 when price is negative', async () => {
      const stockData = {
        name: 'Test Item',
        quantity: 10,
        price: -50
      };

      const response = await request(app)
        .post('/api/stock')
        .send(stockData)
        .expect(400);

      expect(response.body.errors).toContain('Price must be a positive number');
    });

    it('should return 400 with multiple validation errors', async () => {
      const stockData = {
        name: '',
        quantity: -5,
        price: 0
      };

      const response = await request(app)
        .post('/api/stock')
        .send(stockData)
        .expect(400);

      expect(response.body.message).toBe('Validation failed');
      expect(response.body.errors).toHaveLength(3);
      expect(response.body.errors).toContain('Name is required and must be a non-empty string');
      expect(response.body.errors).toContain('Quantity must be greater than or equal to 0');
      expect(response.body.errors).toContain('Price must be a positive number');
    });

    it('should return 400 when description is not a string', async () => {
      const stockData = {
        name: 'Test Item',
        description: 123,
        quantity: 10,
        price: 100
      };

      const response = await request(app)
        .post('/api/stock')
        .send(stockData)
        .expect(400);

      expect(response.body.errors).toContain('Description must be a string');
    });

    it('should return 400 when category is not a string', async () => {
      const stockData = {
        name: 'Test Item',
        quantity: 10,
        price: 100,
        category: 123
      };

      const response = await request(app)
        .post('/api/stock')
        .send(stockData)
        .expect(400);

      expect(response.body.errors).toContain('Category must be a string');
    });

    it('should return 400 when supplier is not a string', async () => {
      const stockData = {
        name: 'Test Item',
        quantity: 10,
        price: 100,
        supplier: 123
      };

      const response = await request(app)
        .post('/api/stock')
        .send(stockData)
        .expect(400);

      expect(response.body.errors).toContain('Supplier must be a string');
    });
  });
});
