const { validateCreateStock, validateUpdateStock } = require('./validation');

describe('Stock Validation Functions', () => {
  describe('validateCreateStock', () => {
    it('should return no errors for valid stock data with all fields', () => {
      const validData = {
        name: 'Laptop',
        description: 'Dell XPS 15',
        quantity: 10,
        price: 1299.99,
        category: 'Electronics',
        supplier: 'Dell Inc.'
      };
      
      const errors = validateCreateStock(validData);
      expect(errors).toEqual([]);
    });

    it('should return no errors for valid stock data with only required fields', () => {
      const validData = {
        name: 'Laptop',
        quantity: 10,
        price: 1299.99
      };
      
      const errors = validateCreateStock(validData);
      expect(errors).toEqual([]);
    });

    it('should return error for missing name', () => {
      const invalidData = {
        quantity: 10,
        price: 1299.99
      };
      
      const errors = validateCreateStock(invalidData);
      expect(errors).toContain('Name is required and must be a non-empty string');
    });

    it('should return error for empty name', () => {
      const invalidData = {
        name: '   ',
        quantity: 10,
        price: 1299.99
      };
      
      const errors = validateCreateStock(invalidData);
      expect(errors).toContain('Name is required and must be a non-empty string');
    });

    it('should return error for name exceeding 255 characters', () => {
      const invalidData = {
        name: 'a'.repeat(256),
        quantity: 10,
        price: 1299.99
      };
      
      const errors = validateCreateStock(invalidData);
      expect(errors).toContain('Name must not exceed 255 characters');
    });

    it('should return error for missing quantity', () => {
      const invalidData = {
        name: 'Laptop',
        price: 1299.99
      };
      
      const errors = validateCreateStock(invalidData);
      expect(errors).toContain('Quantity is required');
    });

    it('should return error for negative quantity', () => {
      const invalidData = {
        name: 'Laptop',
        quantity: -5,
        price: 1299.99
      };
      
      const errors = validateCreateStock(invalidData);
      expect(errors).toContain('Quantity must be greater than or equal to 0');
    });

    it('should return error for non-integer quantity', () => {
      const invalidData = {
        name: 'Laptop',
        quantity: 10.5,
        price: 1299.99
      };
      
      const errors = validateCreateStock(invalidData);
      expect(errors).toContain('Quantity must be an integer');
    });

    it('should accept quantity of 0', () => {
      const validData = {
        name: 'Laptop',
        quantity: 0,
        price: 1299.99
      };
      
      const errors = validateCreateStock(validData);
      expect(errors).toEqual([]);
    });

    it('should return error for missing price', () => {
      const invalidData = {
        name: 'Laptop',
        quantity: 10
      };
      
      const errors = validateCreateStock(invalidData);
      expect(errors).toContain('Price is required');
    });

    it('should return error for non-positive price', () => {
      const invalidData = {
        name: 'Laptop',
        quantity: 10,
        price: 0
      };
      
      const errors = validateCreateStock(invalidData);
      expect(errors).toContain('Price must be a positive number');
    });

    it('should return error for negative price', () => {
      const invalidData = {
        name: 'Laptop',
        quantity: 10,
        price: -100
      };
      
      const errors = validateCreateStock(invalidData);
      expect(errors).toContain('Price must be a positive number');
    });

    it('should return multiple errors for multiple invalid fields', () => {
      const invalidData = {
        name: '',
        quantity: -5,
        price: 0
      };
      
      const errors = validateCreateStock(invalidData);
      expect(errors.length).toBeGreaterThan(1);
      expect(errors).toContain('Name is required and must be a non-empty string');
      expect(errors).toContain('Quantity must be greater than or equal to 0');
      expect(errors).toContain('Price must be a positive number');
    });

    it('should return error for invalid description type', () => {
      const invalidData = {
        name: 'Laptop',
        quantity: 10,
        price: 1299.99,
        description: 123
      };
      
      const errors = validateCreateStock(invalidData);
      expect(errors).toContain('Description must be a string');
    });

    it('should return error for invalid category type', () => {
      const invalidData = {
        name: 'Laptop',
        quantity: 10,
        price: 1299.99,
        category: true
      };
      
      const errors = validateCreateStock(invalidData);
      expect(errors).toContain('Category must be a string');
    });

    it('should return error for invalid supplier type', () => {
      const invalidData = {
        name: 'Laptop',
        quantity: 10,
        price: 1299.99,
        supplier: []
      };
      
      const errors = validateCreateStock(invalidData);
      expect(errors).toContain('Supplier must be a string');
    });
  });

  describe('validateUpdateStock', () => {
    it('should return no errors for valid partial update', () => {
      const validData = {
        quantity: 15,
        price: 1199.99
      };
      
      const errors = validateUpdateStock(validData);
      expect(errors).toEqual([]);
    });

    it('should return no errors for empty update object', () => {
      const validData = {};
      
      const errors = validateUpdateStock(validData);
      expect(errors).toEqual([]);
    });

    it('should return error for invalid name when provided', () => {
      const invalidData = {
        name: '   '
      };
      
      const errors = validateUpdateStock(invalidData);
      expect(errors).toContain('Name must be a non-empty string');
    });

    it('should return error for name exceeding 255 characters', () => {
      const invalidData = {
        name: 'a'.repeat(256)
      };
      
      const errors = validateUpdateStock(invalidData);
      expect(errors).toContain('Name must not exceed 255 characters');
    });

    it('should return error for negative quantity when provided', () => {
      const invalidData = {
        quantity: -10
      };
      
      const errors = validateUpdateStock(invalidData);
      expect(errors).toContain('Quantity must be greater than or equal to 0');
    });

    it('should return error for non-integer quantity when provided', () => {
      const invalidData = {
        quantity: 10.5
      };
      
      const errors = validateUpdateStock(invalidData);
      expect(errors).toContain('Quantity must be an integer');
    });

    it('should return error for non-positive price when provided', () => {
      const invalidData = {
        price: 0
      };
      
      const errors = validateUpdateStock(invalidData);
      expect(errors).toContain('Price must be a positive number');
    });

    it('should allow null for optional fields', () => {
      const validData = {
        description: null,
        category: null,
        supplier: null
      };
      
      const errors = validateUpdateStock(validData);
      expect(errors).toEqual([]);
    });

    it('should return error for invalid description type when not null', () => {
      const invalidData = {
        description: 123
      };
      
      const errors = validateUpdateStock(invalidData);
      expect(errors).toContain('Description must be a string');
    });

    it('should return multiple errors for multiple invalid fields', () => {
      const invalidData = {
        name: '',
        quantity: -5,
        price: -100
      };
      
      const errors = validateUpdateStock(invalidData);
      expect(errors.length).toBeGreaterThan(1);
      expect(errors).toContain('Name must be a non-empty string');
      expect(errors).toContain('Quantity must be greater than or equal to 0');
      expect(errors).toContain('Price must be a positive number');
    });
  });
});
